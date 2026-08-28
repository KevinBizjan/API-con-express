import { readFileSync } from 'fs';
import { join } from 'path';

let packageJson = { name: 'express-health-info-api', version: '1.0.0', description: '' };
try {
  const pkgPath = join(process.cwd(), 'package.json');
  packageJson = JSON.parse(readFileSync(pkgPath, 'utf8'));
} catch (e) {
  // Fallback if package.json read fails
}

/**
 * Controller: GET /api/v1/info
 * Retorna metadatos de la aplicación, ambiente y catálogo de rutas disponibles.
 */
export const getInfo = (req, res) => {
  const infoData = {
    application: {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description || 'API REST de práctica con Express',
      environment: process.env.NODE_ENV || 'development'
    },
    maintainer: {
      team: 'Dev Practice',
      repository: 'https://github.com/express-practice/health-info-api'
    },
    endpoints: [
      {
        path: '/api/v1/health',
        method: 'GET',
        description: 'Obtiene el estado de salud, uptime y uso de recursos del sistema.'
      },
      {
        path: '/api/v1/info',
        method: 'GET',
        description: 'Obtiene la información general de la API, versión y rutas disponibles.'
      },
      {
        path: '/api/v1/ping',
        method: 'GET',
        description: 'Verificación simple de estado (respuesta pong).'
      },
      {
        path: '/',
        method: 'GET',
        description: 'Dashboard interactivo de pruebas en el navegador.'
      }
    ],
    timestamp: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    data: infoData
  });
};
