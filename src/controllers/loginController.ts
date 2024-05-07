// src/controllers/loginController
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import collection from "../models/login";

export async function loginController(req: Request, res: Response) {
    try {
        const check = await collection.findOne({ usuario: req.body.username });
        if (!check) {
            res.send("Usuario no encontrado")
        } else {
            // Compare the hashed password from the database with the plaintext password
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (!isPasswordMatch) {
                res.send("Contraseña incorrecta");
            } else {
                res.render("home");
            }
        }
    } catch (error) {
        console.error("Error al Iniciar Sesion:", error);
        res.status(500).send("Internal Server Error");
    }
}
