"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const loginController_1 = require("./controllers/loginController");
const registerController_1 = require("./controllers/registerController");
const google_auth_1 = require("./middlewares/google-auth");
const index_1 = __importDefault(require("./routes/index"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const fs_1 = __importDefault(require("fs"));
const BetMessage_1 = __importDefault(require("./models/BetMessage"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Define la ruta de la carpeta
const logsDir = path_1.default.join(__dirname, '..', 'chat-logs');
// Lee el contenido de la carpeta
fs_1.default.readdir(logsDir, (err, files) => {
    if (err) {
        console.error('Ocurrió un error al leer la carpeta:', err);
        return;
    }
    // Itera sobre cada archivo
    files.forEach(file => {
        // Asegúrate de que el archivo es un .txt
        if (path_1.default.extname(file) === '.txt') {
            // Define la ruta completa del archivo
            const filePath = path_1.default.join(logsDir, file);
            // Lee el contenido del archivo
            fs_1.default.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Ocurrió un error al leer el archivo ${file}:`, err);
                    return;
                }
                // Imprime el contenido del archivo
                console.log(`Contenido del archivo ${file}:\n${data}\n`);
            });
        }
    });
});
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
}));
// Inicializa Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, google_auth_1.googleAuth)(app);
// Configuración de archivos estáticos
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
// Rutas
app.use('/inicio', index_1.default);
app.use('/users', userRoutes_1.default);
app.use('/auth', authRoutes_1.default);
// Establece el motor de vista a EJS y define la ubicación de las vistas
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
// Crear un servidor HTTP para usar con Socket.io
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
const rooms = [
    { id: 'BayernRMadrid', name: 'Bayern @ R. Madrid' },
    { id: 'AstrosYankees', name: 'Astros @ Yankees' },
    { id: 'PacersKnicks', name: 'Pacers @ Knicks' },
    { id: 'BruinsPanthers', name: 'Bruins @ Panthers' }
];
// List available rooms
app.get('/api/rooms', (req, res) => {
    res.send(rooms);
});
app.get('/chat/:id', (req, res) => {
    const chatId = req.params.id;
    const room = rooms.filter(item => item.id === chatId);
    if (!room.length)
        res.redirect('/');
    res.sendFile(path_1.default.join(__dirname, 'views', 'chat.html'));
});
// Escuchar conexiones de clientes
io.on('connection', (socket) => {
    console.log('A new user connected');
    socket.on('newUser', (data) => {
        socket.data.user = data.user;
        socket.data.chat = data.chat;
        socket.join('chat-' + data.chat);
        socket.to('chat-' + data.chat).emit('newUser', data);
    });
    socket.on('newMessage', (data) => {
        socket.to('chat-' + socket.data.chat).emit('newMessage', data);
    });
    socket.on('newBetMessage', (data) => {
        const fileName = `chat_${socket.data.chat}.txt`;
        const filePath = path_1.default.join(__dirname, '..', 'chat-logs', fileName);
        const messageContent = `${new Date().toISOString()} - ${data.user}: ${data.message}\n`;
        // Append the message to a file
        fs_1.default.appendFile(filePath, messageContent, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            }
        });
        // Create and save a new BetMessage
        const betMessage = new BetMessage_1.default({
            chatId: socket.data.chat,
            user: data.user,
            message: data.message,
            timestamp: new Date(),
        });
        betMessage.save()
            .then(() => console.log(`Bet message saved to MongoDB. File name: ${fileName}`))
            .catch((err) => console.error('Error saving bet message to MongoDB:', err));
        socket.to('chat-' + socket.data.chat).emit('newMessage', data);
    });
    socket.on('disconnect', () => {
        socket.to('chat-' + socket.data.chat).emit('userLeft', { ...socket.data });
    });
});
// Iniciar el servidor
server.listen(port, () => {
    console.log(`El servidor está corriendo en el puerto ${port}`);
});
// Conexión a MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => {
    console.log('Conexión a la base de datos exitosa');
})
    .catch((e) => {
    console.error('Fallo en la conexión a la base de datos:', e);
});
// Endpoints adicionales
app.get("/", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/inicio", (req, res) => {
    // Pasar el objeto 'user' a la plantilla EJS
    const user = req.user || {};
    console.log('Passing user: ', user);
    res.render("index", { user });
});
app.post('/register', registerController_1.registerController);
app.post('/login', loginController_1.loginController);
app.use('/views', express_1.default.static(path_1.default.join(__dirname, 'views')));
