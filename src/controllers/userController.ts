import { Request, Response } from 'express';

export const getAllUsers = (req: Request, res: Response) => {
    res.send('Obteniendo todos los usuarios');
};

export const getUserById = (req: Request, res: Response) => {
    res.send('Obteniendo usuario por ID');
};

export const createUser = (req: Request, res: Response) => {
    res.send('Usuario creado exitosamente');
};

export const updateUserById = (req: Request, res: Response) => {
    res.send('Usuario actualizado por ID');
};

export const deleteUserById = (req: Request, res: Response) => {
    res.send('Usuario eliminado por ID');
};

export const registerUser = (req: Request, res: Response) => {
    res.send('Usuario registrado exitosamente');
};

export const loginUser = (req: Request, res: Response) => {
    res.send('Inicio de sesión exitoso');
};
