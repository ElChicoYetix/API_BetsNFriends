// src/controllers/indexController.ts
import { Request, Response } from 'express';

export const getOtherIndexPage = async (req: Request, res: Response) => {
  try {
    // Aquí  agregar lógica para obtener datos que mostrar en la página principal desde la base de datos o cualquier otra fuente.
    const userData = {
      username: 'usuarioEjemplo',
      email: 'usuario@example.com',
    };

    console.log('aqui?', userData);
    
    res.render('index', { userData }); // Renderiza la vista 'index' y pasa los datos al renderizador
  } catch (error) {
    console.error('Error al obtener datos para la página principal:', error);
    res.status(500).send('Error interno del servidor');
  }
};

export const getIndexPage = (req: Request, res: Response) => {
  // Pasar el objeto 'user' a la plantilla EJS
  res.render("index", { user: req.user });
};