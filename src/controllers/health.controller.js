import os from 'os';

/**
 * Utility to format seconds into readable HH:MM:SS
 */
const formatUptime = (seconds) => {
  const pad = (s) => (s < 10 ? '0' : '') + s;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${pad(hours)}h ${pad(minutes)}m ${pad(secs)}s`;
};

/**
 * Controller: GET /api/v1/health
 * Retorna estado detallado del servidor y métricas de rendimiento.
 */
export const getHealth = (req, res) => {
  const memoryUsage = process.memoryUsage();
  const uptimeSeconds = process.uptime();

  const healthInfo = {
    status: 'OK',
    service: 'Express Practice API',
    uptime: formatUptime(uptimeSeconds),
    uptimeSeconds: Math.floor(uptimeSeconds),
    timestamp: new Date().toISOString(),
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      cpuCores: os.cpus().length,
      freeMemoryMB: Math.round(os.freemem() / (1024 * 1024)),
      totalMemoryMB: Math.round(os.totalmem() / (1024 * 1024))
    },
    processMemory: {
      rssMB: (memoryUsage.rss / (1024 * 1024)).toFixed(2),
      heapTotalMB: (memoryUsage.heapTotal / (1024 * 1024)).toFixed(2),
      heapUsedMB: (memoryUsage.heapUsed / (1024 * 1024)).toFixed(2)
    }
  };

  res.status(200).json({
    success: true,
    data: healthInfo
  });
};

/**
 * Controller: GET /api/v1/ping
 * Verificación rápida de conectividad y latencia.
 */
export const getPing = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'pong',
    timestamp: new Date().toISOString()
  });
};
