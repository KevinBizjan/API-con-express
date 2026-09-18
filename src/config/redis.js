import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  retryStrategy: (times) => Math.min(times * 100, 2000), // Reconexión automática
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false // Falla rápido si Redis se apaga para manejar el error 503
});

redis.on('error', (err) => {
  console.error('[Redis Error]', err.message);
});

redis.on('connect', () => {
  console.log('✅ Conectado exitosamente a Redis');
});
