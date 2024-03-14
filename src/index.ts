import express from 'express';
import userRoutes from './routes/userRoutes';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use('/users', userRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch(err => console.error('Error al conectar a MongoDB', err));



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running en el puerto ${port}`);
});
