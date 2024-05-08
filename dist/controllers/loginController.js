"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const login_1 = __importDefault(require("../models/login"));
async function loginController(req, res) {
    try {
        const check = await login_1.default.findOne({ usuario: req.body.username });
        if (!check) {
            res.send("Usuario no encontrado");
        }
        else {
            // Compare the hashed password from the database with the plaintext password
            const isPasswordMatch = await bcrypt_1.default.compare(req.body.password, check.password);
            if (!isPasswordMatch) {
                res.send("Contraseña incorrecta");
            }
            else {
                res.render("home");
            }
        }
    }
    catch (error) {
        console.error("Error al Iniciar Sesion:", error);
        res.status(500).send("Internal Server Error");
    }
}
exports.loginController = loginController;
