
import { Request, Response } from 'express';

import User from '../models/user';

const userController = {
    getAll(req: Request, res: Response) {
        User.find({}).then((users: any) => {
            res.send(users);
        }).catch((error: any) => {
            res.status(500).send('Error al obtener usuarios');
        });
    },

    create(req: Request, res: Response) {
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        }).then((newUser: any) => {
            res.send(newUser);
        }).catch((error: any) => {
            res.status(400).send('Error al crear usuario');
        });
    }
};
export default userController;

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