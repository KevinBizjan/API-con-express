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
    // Consulta el valor actual del cupo guardado bajo la clave 'evento:cupo:1' en Redis.
    const stockActual = await redis.get(STOCK_KEY); // Devuelve el valor como string o null si no existe
    let stock = parseInt(stockActual, 10); // parseo a entero en base 10

    // Valida si el stock es un número válido y mayor a 0
    if (isNaN(stock) || stock <= 0) {
      return res.status(409).json({ error: 'Agotado: No hay cupos disponibles' });
    }

    // SIMULACIÓN DE LATENCIA
    // Simula un delay de 150ms que representa el tiempo que tomaria cualquier operación intermedia
    // Durante esta ventana de tiempo, otro proceso podría leer el mismo valor y causar una condición de carrera.
    await new Promise((resolve) => setTimeout(resolve, 150));

    // PASO 2: Escritura desfasada
    // Escribe el nuevo valor del cupo en Redis
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
    // Lee y resta el cupo en una sola operación atómica (sin ventana de carrera)
    const nuevoStock = await redis.decr(STOCK_KEY); // Devuelve el valor ya decrementado

    // Si queda negativo, ya no había cupo disponible
    if (nuevoStock < 0) {
      // Revertir el decr sobrante para no dejar el contador en negativo
      await redis.incr(STOCK_KEY);
      return res.status(409).json({
        error: 'Conflicto: El cupo ya fue reservado por otra transacción'
      });
    }

    // nuevoStock >= 0: el cupo quedó reservado con éxito
    return res.status(200).json({
      mensaje: '¡Reserva confirmada con éxito (Protegida)!',
      stockRestante: nuevoStock
    });
  } catch (error) {
    return res.status(503).json({ error: 'Servicio degradado (Redis detenido o inaccesible)' });
  }
};








/*
Por qué DECR e INCR resuelven el problema: a diferencia del endpoint vulnerable, que separa la lectura y la escritura 
en dos operaciones independientes (GET + SET) dejando una ventana de tiempo en el medio, DECR realiza la lectura y el 
decremento como una sola operación atómica dentro de Redis. Redis procesa los comandos de a uno (es single-threaded), 
por lo que ninguna otra petición puede intercalarse entre el momento en que se lee el valor y el momento en que se 
escribe: eso elimina por completo la condición de carrera. Como DECR resta sin verificar de antemano si hay stock disponible,
el valor puede quedar en negativo cuando el cupo ya se agotó; en ese caso se usa INCR para revertir esa resta de más y 
devolver el contador a su estado real, evitando que quede "roto" con números negativos para futuras peticiones.
*/