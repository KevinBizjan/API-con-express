/**
 * HTTP Request Logger Middleware
 * Logs incoming HTTP requests with timestamp, method, URL, status code, and response time.
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  const { method, originalUrl } = req;

  // Intercept finish event to calculate execution duration
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // ANSI color codes for terminal highlighting
    let color = '\x1b[32m'; // Green for 2xx
    if (statusCode >= 400 && statusCode < 500) color = '\x1b[33m'; // Yellow for 4xx
    if (statusCode >= 500) color = '\x1b[31m'; // Red for 5xx
    const reset = '\x1b[0m';

    console.log(
      `[${timestamp}] ${method} ${originalUrl} ${color}${statusCode}${reset} - ${duration}ms`
    );
  });

  next();
};
