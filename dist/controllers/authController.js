"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsuarioPage = exports.getRegisterPage = exports.getLoginPage = void 0;
const getLoginPage = async (req, res) => {
    res.render('login'); // Renderiza la vista 'login.ejs' para la página de inicio de sesión
};
exports.getLoginPage = getLoginPage;
const getRegisterPage = async (req, res) => {
    res.render('register'); // Renderiza la vista 'register.ejs' para la página de registro
};
exports.getRegisterPage = getRegisterPage;
const getUsuarioPage = async (req, res) => {
    res.render('usuario'); // Renderiza la vista 'usuario.ejs' para la página de registro
};
exports.getUsuarioPage = getUsuarioPage;
