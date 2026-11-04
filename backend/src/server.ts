import { createApp } from './app.js';
import { ENV } from './config/env.js';

const app = createApp();

const server = app.listen(ENV.PORT, () => {
  console.log(`[ONE Backend API] running on http://localhost:${ENV.PORT} in ${ENV.NODE_ENV} mode`);
});

const handleShutdown = () => {
  console.log('[ONE Backend API] Gracefully shutting down...');
  server.close(() => {
    console.log('[ONE Backend API] HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);

