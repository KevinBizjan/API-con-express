import dotenv from 'dotenv';
import app from './app.js';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Servidor API iniciado con éxito`);
  console.log(`📡 Modo: ${NODE_ENV}`);
  console.log(`🌐 Dashboard web:            http://localhost:${PORT}`);
  console.log(`📖 Scalar API Reference UI: http://localhost:${PORT}/docs`);
  console.log(`💚 Healthcheck:               http://localhost:${PORT}/api/v1/health`);
  console.log(`ℹ️  Info API:                  http://localhost:${PORT}/api/v1/info`);
  console.log(`==================================================\n`);
});
