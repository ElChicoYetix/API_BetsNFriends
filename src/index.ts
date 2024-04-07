
import express, { Request, Response, NextFunction } from 'express';
import indexRoutes from './routes/index';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path'; 

dotenv.config();

const routes = require('./routes');
const app = express();

// Middleware de manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});
// Configurar middleware de análisis de cuerpo
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar tus rutas
app.use('/auth', authRoutes);

// Configuración del motor de plantillas
app.set('view engine', 'ejs'); // Establece EJS como motor de plantillas
app.set('views', path.join(__dirname, 'views')); // Establece la ubicación de las vistas

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

const port = process.env.PORT || 3000;

// Conexión a MongoDB
const db_url = process.env.MONGODB_URI;
mongoose.connect(db_url).then(() => {
  console.log('Connected to the db');
  app.listen(port, () => {
      console.log('app is running...');
  });
}).catch(e => {
  console.log('Failed to connect to the db');
})