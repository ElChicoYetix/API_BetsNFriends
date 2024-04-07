import express from 'express';
import { getIndexPage } from '../controllers/indexController';

const router = express.Router();

router.get('/', getIndexPage);

router.get('/login', (req, res) => {
    res.render('login');
  });
  
  router.get('/register', (req, res) => {
    res.render('register');
  });
  

export default router;