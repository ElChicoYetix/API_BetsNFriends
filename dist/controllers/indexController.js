"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexPage = exports.getOtherIndexPage = void 0;
const getOtherIndexPage = async (req, res) => {
    try {
        // Aquí  agregar lógica para obtener datos que mostrar en la página principal desde la base de datos o cualquier otra fuente.
        const userData = {
            username: 'usuarioEjemplo',
            email: 'usuario@example.com',
        };
        console.log('aqui?', userData);
        res.render('index', { userData }); // Renderiza la vista 'index' y pasa los datos al renderizador
    }
    catch (error) {
        console.error('Error al obtener datos para la página principal:', error);
        res.status(500).send('Error interno del servidor');
    }
};
exports.getOtherIndexPage = getOtherIndexPage;
const getIndexPage = (req, res) => {
    // Pasar el objeto 'user' a la plantilla EJS
    res.render("index", { user: req.user });
};
exports.getIndexPage = getIndexPage;
