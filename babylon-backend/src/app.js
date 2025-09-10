import express from 'express';
import 'dotenv/config';
import path from "path";
import { fileURLToPath } from "url";
import { configCors } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(configCors());

app.use(express.static(path.join(__dirname, '..', 'public', 'dist')));
app.use('/models', express.static(path.join(__dirname, '..', 'public', 'models')));

app.use('/api', apiRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
