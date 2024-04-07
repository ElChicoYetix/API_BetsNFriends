import { Request, Response } from 'express';

export const getLoginPage = async (req: Request, res: Response) => {
  res.render('login'); // Renderiza la vista 'login.ejs' para la página de inicio de sesión
};

export const getRegisterPage = async (req: Request, res: Response) => {
  res.render('register'); // Renderiza la vista 'register.ejs' para la página de registro
};