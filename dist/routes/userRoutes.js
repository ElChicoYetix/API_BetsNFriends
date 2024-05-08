"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get('/', userController_1.getAllUsers);
router.get('/:id', userController_1.getUserById);
router.post('/', userController_1.createUser);
router.put('/:id', userController_1.updateUserById);
router.delete('/:id', userController_1.deleteUserById);
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
// aws
router.get('', (req, res) => { res.send('api works'); });
// router.post('/upload', uploadS3.single('image'), (req, res) => {res.send('ok');});
exports.default = router;
// http://localhost:3000/users/login : Obteniendo usuario por ID
