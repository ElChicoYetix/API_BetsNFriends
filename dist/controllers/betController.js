"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBets = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Lee y devuelve las apuestas de la carpeta 'chat-logs'
const getAllBets = (req, res) => {
    const betsDir = path_1.default.join(__dirname, '..', '..', 'chat-logs'); // Directorio de chat-logs
    const bets = []; // Lista para guardar las apuestas
    fs_1.default.readdir(betsDir, (err, files) => {
        if (err) {
            console.error('Error leyendo chat-logs:', err);
            return res.status(500).send('Error interno');
        }
        // Lee y guarda el contenido de cada archivo .txt
        files.forEach((file) => {
            if (path_1.default.extname(file) === '.txt') {
                const filePath = path_1.default.join(betsDir, file);
                const content = fs_1.default.readFileSync(filePath, 'utf8');
                bets.push({ file, content }); // Añade el contenido y el nombre del archivo
            }
        });
        res.json(bets); // Devuelve la lista de apuestas como JSON
    });
};
exports.getAllBets = getAllBets;
