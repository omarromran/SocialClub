const { randomUUID } = require('crypto');

function requestLogger(req, res, next) {
  const requestId = randomUUID().slice(0, 8);
  const startedAt = Date.now();
  req.requestId = requestId;

  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    const level = res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO';
    console.log(`[${level}] ${new Date().toISOString()} [${requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
}

function errorLogger(error, req, res, next) {
  const statusCode = error.statusCode || (error instanceof require('multer').MulterError ? 400 : 500);
  const requestId = req.requestId || 'unknown';
  console.error(`[ERROR] ${new Date().toISOString()} [${requestId}] ${req.method} ${req.originalUrl} ${statusCode}`);
  console.error(error.stack || error.message || error);
  next(error);
}

module.exports = { requestLogger, errorLogger };
