import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { Server } from 'socket.io'; // Importa el tipo Server para Socket.io
import { createServer } from 'http'; // Para usar Socket.io con Express
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
app.use('/inicio', indexRoutes); // inicio
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// Crear un servidor HTTP para usar con Socket.io
const server = createServer(app);
// Instancia de Socket.io
const io = new Server(server);
// Escuchar conexiones de clientes
io.on('connection', (socket) => {
  console.log('A new user connected');
  // Let others know that you joined
  socket.on('newUser', (data) => {
      socket.data.user = data.user; // Save the data for when the user disconnects
      socket.broadcast.emit('newUser', data);
  });
  socket.on('newMessage', (data) => {
      socket.broadcast.emit('newMessage', data);
  });
  socket.on('disconnect', () => {
      socket.broadcast.emit('userLeft', { ...socket.data });
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
