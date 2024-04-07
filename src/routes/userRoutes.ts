import express from 'express';

import { getAllUsers, getUserById, createUser, updateUserById, deleteUserById, registerUser, loginUser } from '../controllers/userController';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;

// http://localhost:3000/users/login : Obteniendo usuario por ID