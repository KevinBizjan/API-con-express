import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { requestLogger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/health.routes.js';
import infoRoutes from './routes/info.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Servir especificaciones OpenAPI (JSON y YAML)
app.get('/openapi.json', (req, res) => {
  res.sendFile(path.join(__dirname, '../openapi.json'));
});
app.get('/openapi.yaml', (req, res) => {
  res.setHeader('Content-Type', 'text/yaml');
  res.sendFile(path.join(__dirname, '../openapi.yaml'));
});

// Servir dashboard interactivo desde la carpeta public/
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de la API v1
app.use('/api/v1', healthRoutes);
app.use('/api/v1', infoRoutes);

// Alias directo para comodidad de consulta (/health e /info)
app.use('/', healthRoutes);
app.use('/', infoRoutes);

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
