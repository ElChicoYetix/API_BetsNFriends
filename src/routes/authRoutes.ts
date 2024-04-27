// authRoutes.ts

import express from 'express';
import User from '../models/user';
import userController from '../controllers/userController';

const router = express.Router();

router.post('/register', userController.create);

export default router;