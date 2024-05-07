// src/routes/userRoutes.ts
import express from 'express';

import { getAllUsers, getUserById, createUser, updateUserById, deleteUserById, registerUser, loginUser } from '../controllers/userController';
import { uploadS3 } from './../middlewares/upload-s3';
const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);
router.post('/register', registerUser);
router.post('/login', loginUser);

// aws
router.get('', (req, res) => {res.send('api works');});
// router.post('/upload', uploadS3.single('image'), (req, res) => {res.send('ok');});

export default router;

// http://localhost:3000/users/login : Obteniendo usuario por ID