// src/controllers/betController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Lee y devuelve las apuestas de la carpeta 'chat-logs'
export const getAllBets = (req: Request, res: Response) => {
  const betsDir = path.join(__dirname, '..', '..', 'chat-logs'); // Directorio de chat-logs
  const bets: { file: string; content: string }[] = []; // Lista para guardar las apuestas

  fs.readdir(betsDir, (err, files) => {
    if (err) {
      console.error('Error leyendo chat-logs:', err);
      return res.status(500).send('Error interno');
    }

    // Lee y guarda el contenido de cada archivo .txt
    files.forEach((file) => {
      if (path.extname(file) === '.txt') {
        const filePath = path.join(betsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        bets.push({ file, content }); // Añade el contenido y el nombre del archivo
      }
    });

    res.json(bets); // Devuelve la lista de apuestas como JSON
  });
};
