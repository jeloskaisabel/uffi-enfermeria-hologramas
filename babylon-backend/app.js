import express from 'express';
import fs from 'fs/promises';
import 'dotenv/config';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

app.use(express.static('./public'));
app.use(express.static('./public/dist'));
app.use('/models', express.static(path.join(__dirname, 'public', 'models')));  // Servir directorio de modelos estáticos

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});

app.get('/files', async (req, res) => {
    try {
        const modelsDir = path.join(__dirname, 'public', 'models');
        console.log('Leyendo directorio:', modelsDir); // Depuración

        const dirs = await fs.readdir(modelsDir);
        const data = {};
        for (const dir of dirs) {
            console.log('Leyendo subdirectorio:', dir); // Depuración

            const files = await fs.readdir(path.join(modelsDir, dir));
            const fileData = {};
            for (const file of files) {
                console.log('Archivo encontrado:', file); // Depuración

                const fileName = file.split('.').slice(0, -1).join('.');
                fileData[fileName] = { modelURL: `models/${encodeURIComponent(dir)}/${encodeURIComponent(file)}` };
            }
            data[dir] = fileData;
        }
        console.log('Datos finales:', data); // Depuración

        res.status(200).json(data);
    } catch (error) {
        console.error('Error al leer los archivos:', error); // Depuración
        res.status(500).send('Error al leer los archivos');
    }
});

app.listen(port, () => {
    console.log('Servidor corriendo en:', port);
});
