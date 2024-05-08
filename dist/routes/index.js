"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/index.ts
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const confirmationController_1 = require("../controllers/confirmationController");
const authController_1 = require("../controllers/authController");
const registerController_1 = require("../controllers/registerController");
const betController_1 = require("../controllers/betController");
const router = express_1.default.Router();
// Página de inicio
router.get('/bets', betController_1.getAllBets);
router.get('/login', (req, res) => {
    res.render('login');
});
// Iniciar sesión con Google
router.get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email'], // Permisos solicitados a Google
}));
router.get('/google/callback', passport_1.default.authenticate('google', {
    successRedirect: '/inicio', // Redireccionar a la página principal después del éxito
    failureRedirect: '/auth/login', // Redireccionar si falla
}));
// Ruta para verificar si el usuario está autenticado
router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: 'Successfully Logged In',
            user: req.user,
        });
    }
    else {
        res.status(403).json({ error: true, message: 'Not Authorized' });
    }
});
// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/inicio'); // Redireccionar después de cerrar sesión
    });
});
// Página de registro
router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/register', authController_1.getRegisterPage); // Esto carga la página de registro
router.post('/register', registerController_1.registerController); // Esto procesa el registro
// Página de Usuario
router.get('/usuario', (req, res) => {
    res.render('usuario');
});
// Confirmacion de Registro
router.get('/confirmation', confirmationController_1.confirmationController);
exports.default = router;
