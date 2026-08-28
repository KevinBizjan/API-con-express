/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `La ruta '${req.originalUrl}' con método '${req.method}' no existe en esta API.`,
      suggestion: 'Revisa /api/v1/info para ver los endpoints disponibles.'
    },
    timestamp: new Date().toISOString()
  });
};

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]:', err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Ocurrió un error interno en el servidor.'
    },
    timestamp: new Date().toISOString()
  });
};
