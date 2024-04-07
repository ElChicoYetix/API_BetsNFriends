import { Request, Response } from 'express';

export const getIndexPage = async (req: Request, res: Response) => {
  try {
    // Aquí  agregar lógica para obtener datos que mostrar en la página principal desde la base de datos o cualquier otra fuente.
    const userData = {
      username: 'usuarioEjemplo',
      email: 'usuario@example.com',
      // Otros campos que mostrar
    };
    
    res.render('index', { userData }); // Renderiza la vista 'index' y pasa los datos al renderizador
  } catch (error) {
    console.error('Error al obtener datos para la página principal:', error);
    res.status(500).send('Error interno del servidor');
  }
};