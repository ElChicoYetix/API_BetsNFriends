// src/routes/index.ts
import express from 'express';
import passport from 'passport';
import { getOtherIndexPage } from '../controllers/indexController';
import { confirmationController } from '../controllers/confirmationController';
import { getRegisterPage } from '../controllers/authController';
import { registerController } from '../controllers/registerController';
import { getAllBets } from '../controllers/betController';

const router = express.Router();

// Página de inicio
router.get('/bets', getAllBets);
router.get('/login', (req, res) => {
    res.render('login');
});

// Iniciar sesión con Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'], // Permisos solicitados a Google
}));


router.get(
    '/google/callback',
    passport.authenticate('google', {
      successRedirect: '/inicio', // Redireccionar a la página principal después del éxito
      failureRedirect: '/auth/login', // Redireccionar si falla
    })
  );
  
  // Ruta para verificar si el usuario está autenticado
  router.get('/login/success', (req, res) => {
    if (req.user) {
      res.status(200).json({
        error: false,
        message: 'Successfully Logged In',
        user: req.user,
      });
    } else {
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
router.get('/register', getRegisterPage); // Esto carga la página de registro
router.post('/register', registerController); // Esto procesa el registro

// Página de Usuario
router.get('/usuario', (req, res) => {
    res.render('usuario');
});

// Confirmacion de Registro
router.get('/confirmation', confirmationController);

export default router;
