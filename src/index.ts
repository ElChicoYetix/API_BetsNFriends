import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path'; 

import { loginController } from "./controllers/loginController";
import { registerController } from "./controllers/registerController";

import { googleAuth } from './middlewares/google-auth';
import indexRoutes from './routes/index';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// convert data into json format
app.use(express.json());

// Middleware de análisis de cuerpo
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Agregar Passport y Google Auth
googleAuth(app);

// Configuración del motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);


app.get("/", (req: Request, res: Response) => {
  res.render("login");
});

app.get("/signup", (req: Request, res: Response) => {
  res.render("signup");
});

app.post('/register', registerController);
app.post('/login', loginController);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    app.listen(port, () => {
      console.log(`La aplicación se está ejecutando en el puerto ${port}`);
    });
  })
  .catch((e) => {
    console.error('Fallo en la conexión a la base de datos:', e);
  });
