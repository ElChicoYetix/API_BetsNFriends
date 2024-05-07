// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import session from 'express-session'; // Importa express-session
import passport from 'passport'; // Importa passport
import { Server } from 'socket.io';
import { createServer } from 'http';
import { loginController } from "./controllers/loginController";
import { registerController } from "./controllers/registerController";
import { googleAuth } from './middlewares/google-auth';
import indexRoutes from './routes/index';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import betsRoutes from './routes/betsRoutes'; // Nueva ruta para apuestas

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Configuración para procesar datos POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/inicio', indexRoutes);
app.use('/bets', betsRoutes); // Nueva ruta para guardar apuestas

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false, // Para sesiones auténticas solo cuando el usuario inicia sesión
}));

// Inicializa Passport
app.use(passport.initialize());
app.use(passport.session());
googleAuth(app);


// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public'))); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/inicio', indexRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);


// Establece el motor de vista a EJS y define la ubicación de las vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Crea un servidor HTTP para usar con Socket.io
// Inicia el servidor

// Crear un servidor HTTP para usar con Socket.io
const server = createServer(app);
const io = new Server(server);
const rooms = [
    { id: '1', name: 'Bayern @ R. Madrid' },
    { id: '2', name: 'Astros @ Yankees' },
    { id: '3', name: 'Pacers @ Knicks' },
    { id: '4', name: 'Bruins @ Panthers' }
];

// List available rooms
app.get('/api/rooms', (req, res) => {
    res.send(rooms);
});

app.get('/chat/:id', (req, res) => {
    const chatId = req.params.id;
    const room = rooms.filter(item => item.id === chatId);
    if (!room.length) res.redirect('/');

    res.sendFile(path.join(__dirname, 'views', 'chat.html'));
})

// Escuchar conexiones de clientes
io.on('connection', (socket) => {
  console.log('A new user connected');
  socket.on('newUser', (data) => {
      socket.data.user = data.user; 
      socket.data.chat = data.chat;
      socket.join('chat-' + data.chat);
      socket.to('chat-' + data.chat).emit('newUser', data);
  });
  socket.on('newMessage', (data) => {
      socket.to('chat-' + socket.data.chat).emit('newMessage', data);
  });
  socket.on('disconnect', () => {
      socket.to('chat-' + socket.data.chat).emit('userLeft', { ...socket.data });
  })
})

// Iniciar el servidor
server.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch((e) => {
    console.error('Fallo en la conexión a la base de datos:', e);
  });

// Endpoints adicionales
app.get("/", (req: express.Request, res: express.Response) => {
  res.render("login");
});

app.get("/signup", (req: express.Request, res: express.Response) => {
  res.render("signup");
});

//
app.get("/inicio", (req: express.Request, res: express.Response) => {
  // Pasar el objeto 'user' a la plantilla EJS
  const user = req.user || {};
  console.log('Passing user: ', user);
  res.render("index", { user });
});

app.post('/register', registerController);
app.post('/login', loginController);

app.use('/views', express.static(path.join(__dirname, 'views')));

// express session middleware