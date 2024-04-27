import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import collection from "../models/login";

export async function registerController(req: Request, res: Response) {
    // Registro de los datos del formulario recibidos en el cuerpo de la solicitud
    console.log(req.body);

    const data = {
        name: req.body.name,
        usuario: req.body.usuario,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }

    console.log('Estamos buscando: ', data);

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ email: data.email });

    console.log('Respuesta usuario:  ', existingUser);
    if (existingUser) {
        res.send('El correo ya existe, elige otro');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        try {
            const userdata = await collection.create(data);
            console.log(userdata);
            res.redirect('/confirmation');
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}