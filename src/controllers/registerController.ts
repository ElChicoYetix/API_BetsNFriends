// src/controllers/registerController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import collection from '../models/login';

export async function registerController(req: Request, res: Response) {
    try {
        // Verifica si el usuario ya existe
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send("Usuario ya registrado con este correo");
        }

        // Crea un hash de la contraseña
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Crea un nuevo usuario
        const newUser = new collection({
            name: req.body.name,
            usuario: req.body.usuario,
            email: req.body.email,
            password: hashedPassword,
        });

        // Guarda el usuario en la base de datos
        await newUser.save();

        res.redirect('/inicio/confirmation'); // Redirige a la página de confirmación
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send("Error interno del servidor");
    }
}
