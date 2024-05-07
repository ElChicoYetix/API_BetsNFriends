// src/controllers/confirmationController.ts
import { Request, Response } from 'express';

export function confirmationController(req: Request, res: Response) {
    res.render('confirmation', { title: 'Usuario registrado correctamente' });
}