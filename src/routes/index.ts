import express from 'express';
import passport from 'passport';
import { getIndexPage } from '../controllers/indexController';

const router = express.Router();

// Página de inicio
router.get('/', getIndexPage);

// Página de login con botón para Google
router.get('/login', (req, res) => {
    res.render('login');
});

// Iniciar sesión con Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'], // Permisos solicitados a Google
}));

// Callback de autenticación de Google
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login', // Redirige a la página de login si falla
    }),
    (req, res) => {
        res.redirect('/'); // Redirige a la página de inicio después de autenticarse
    }
);

// Página de registro
router.get('/register', (req, res) => {
    res.render('register');
});

export default router;
