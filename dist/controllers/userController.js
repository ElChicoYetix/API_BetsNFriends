"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.deleteUserById = exports.updateUserById = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const user_1 = __importDefault(require("../models/user"));
const userController = {
    getAll(req, res) {
        user_1.default.find({}).then((users) => {
            res.send(users);
        }).catch((error) => {
            res.status(500).send('Error al obtener usuarios');
        });
    },
    create(req, res) {
        user_1.default.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        }).then((newUser) => {
            res.send(newUser);
        }).catch((error) => {
            res.status(400).send('Error al crear usuario');
        });
    }
};
exports.default = userController;
const getAllUsers = (req, res) => {
    // res.send('Obteniendo todos los usuarios');
    user_1.default.find({}).then((users) => {
        res.send(users);
    }).catch((error) => {
        res.status(500).send('Error al obtener usuarios');
    });
};
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => {
    res.send('Obteniendo usuario por ID');
};
exports.getUserById = getUserById;
const createUser = (req, res) => {
    res.send('Usuario creado exitosamente');
};
exports.createUser = createUser;
const updateUserById = (req, res) => {
    res.send('Usuario actualizado por ID');
};
exports.updateUserById = updateUserById;
const deleteUserById = (req, res) => {
    res.send('Usuario eliminado por ID');
};
exports.deleteUserById = deleteUserById;
const registerUser = (req, res) => {
    res.send('Usuario registrado exitosamente');
};
exports.registerUser = registerUser;
const loginUser = (req, res) => {
    res.send('Inicio de sesión exitoso');
};
exports.loginUser = loginUser;
