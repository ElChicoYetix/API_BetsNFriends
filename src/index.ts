

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { loginController } from "./controllers/loginController";
import { registerController } from "./controllers/registerController";
import { googleAuth } from './middlewares/google-auth';
import indexRoutes from './routes/index';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public'))); 

// Middleware para análisis de cuerpo
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

googleAuth(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/inicio', indexRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// Crear un servidor HTTP para usar con Socket.io
const server = createServer(app);
// Instancia de Socket.io
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
  // Let others know that you joined
  socket.on('newUser', (data) => {
      socket.data.user = data.user; // Save the data for when the user disconnects
      socket.data.chat = data.chat;
      // Join the chat room
      socket.join('chat-' + data.chat);
      // Notify ONLY the OTHER users in that same chat
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

app.post('/register', registerController);
app.post('/login', loginController);

app.use('/views', express.static(path.join(__dirname, 'views')));

