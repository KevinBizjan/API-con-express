import { redis } from '../config/redis.js';

// Clave en Redis que almacena el cupo
const STOCK_KEY = 'evento:cupo:1';

// 0. Resetear el cupo inicial a 1
export const resetCupo = async (req, res) => {
  try {
    await redis.set(STOCK_KEY, 1);
    const stock = await redis.get(STOCK_KEY);
    return res.json({ mensaje: 'Stock inicializado a 1', stock: Number(stock) });
  } catch (error) {
    return res.status(503).json({ error: 'Redis no disponible' });
  }
};

// 1. ENDPOINT VULNERABLE: Anti-patrón Read-Modify-Write desprotegido
export const reservarVulnerable = async (req, res) => {
  try {
    // PASO 1: Lectura
    const stockActual = await redis.get(STOCK_KEY);
    let stock = parseInt(stockActual, 10);

    if (isNaN(stock) || stock <= 0) {
      return res.status(409).json({ error: 'Agotado: No hay cupos disponibles' });
    }

    // SIMULACIÓN DE LATENCIA / TIEMPO DE CÓMPUTO (Ventana de carrera)
    // Durante estos 150ms entra la segunda petición concurrente
    await new Promise((resolve) => setTimeout(resolve, 150));

    // PASO 2: Escritura desfasada
    stock = stock - 1;
    await redis.set(STOCK_KEY, stock);

    return res.status(200).json({
      mensaje: '¡Reserva exitosa (Vulnerable)!',
      stockRestante: stock
    });
  } catch (error) {
    return res.status(503).json({ error: 'Redis no disponible' });
  }
};

// 2. ENDPOINT PROTEGIDO: Operación Atómica de Redis (DECR)
export const reservarSeguro = async (req, res) => {
  try {
    // DECR decrementa el valor en Redis en un único ciclo de CPU atómico en memoria.
    // Ningún otro proceso puede intercalarse entre la lectura y la escritura.
    const nuevoStock = await redis.decr(STOCK_KEY);

    // Si el valor queda en 0, se asignó el último cupo con éxito.
    // Si queda en < 0, significa que ya no había cupo disponible.
    if (nuevoStock < 0) {
      // Revertir el valor sobrante para no dejar números negativos
      await redis.incr(STOCK_KEY);
      return res.status(409).json({
        error: 'Conflicto: El cupo ya fue reservado por otra transacción'
      });
    }

    return res.status(200).json({
      mensaje: '¡Reserva confirmada con éxito (Protegida)!',
      stockRestante: nuevoStock
    });
  } catch (error) {
    return res.status(503).json({ error: 'Servicio degradado (Redis detenido o inaccesible)' });
  }
};
