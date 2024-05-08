// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import session from 'express-session'; 
import passport from 'passport'; 
import { Server } from 'socket.io';
import { createServer } from 'http';
import { loginController } from "./controllers/loginController";
import { registerController } from "./controllers/registerController";
import { googleAuth } from './middlewares/google-auth';
import indexRoutes from './routes/index';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import fs from 'fs'; 
import BetMessage from './models/BetMessage';
import { GridFSBucket, ObjectId } from 'mongodb';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;


// Define la ruta de la carpeta
const logsDir = path.join(__dirname, '..' ,'chat-logs');

// Lee el contenido de la carpeta
fs.readdir(logsDir, (err, files) => {
  if (err) {
    console.error('Ocurrió un error al leer la carpeta:', err);
    return;
  }

  // Itera sobre cada archivo
  files.forEach(file => {
    // Asegúrate de que el archivo es un .txt
    if (path.extname(file) === '.txt') {
      // Define la ruta completa del archivo
      const filePath = path.join(logsDir, file);
      // Lee el contenido del archivo
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Ocurrió un error al leer el archivo ${file}:`, err);
          return;
        }
        // Imprime el contenido del archivo
        console.log(`Contenido del archivo ${file}:\n${data}\n`);
      });
    }
  });
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false, 
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

// Crear un servidor HTTP para usar con Socket.io
const server = createServer(app);
const io = new Server(server);
const rooms = [
    { id: 'BayernRMadrid', name: 'Bayern @ R. Madrid' },
    { id: 'AstrosYankees', name: 'Astros @ Yankees' },
    { id: 'PacersKnicks', name: 'Pacers @ Knicks' },
    { id: 'BruinsPanthers', name: 'Bruins @ Panthers' }
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
  socket.on('newBetMessage', (data) => {
    const fileName = `chat_${socket.data.chat}.txt`;
    const filePath = path.join(__dirname, '..', 'chat-logs', fileName);
    const messageContent = `${new Date().toISOString()} - ${data.user}: ${data.message}\n`;
  
    // Append the message to a file
    fs.appendFile(filePath, messageContent, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        }
    });
  
    // Create and save a new BetMessage
    const betMessage = new BetMessage({
      chatId: socket.data.chat,
      user: data.user,
      message: data.message,
      timestamp: new Date(),
    });
  
    betMessage.save()
      .then(() => console.log(`Bet message saved to MongoDB. File name: ${fileName}`))
      .catch((err) => console.error('Error saving bet message to MongoDB:', err));
  
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

app.get("/inicio", (req: express.Request, res: express.Response) => {
  // Pasar el objeto 'user' a la plantilla EJS
  const user = req.user || {};
  console.log('Passing user: ', user);
  res.render("index", { user });
});

app.post('/register', registerController);
app.post('/login', loginController);

app.use('/views', express.static(path.join(__dirname, 'views')));