import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import collection from "../models/login";

export async function registerController(req: Request, res: Response) {
    const data = {
        usuario: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ usuario: data.usuario });

    if (existingUser) {
        res.send('El usuario ya existe, elige otro nombre');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        try {
            const userdata = await collection.create(data);
            console.log(userdata);
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}