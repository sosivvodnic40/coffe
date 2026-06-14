import { createApp } from './app.js';
import { config } from './config.js';
import { closeDb, getDb } from './db/database.js';

const app = createApp();

getDb();

const server = app.listen(config.port, () => {
  console.log(`Cappuccino API running on http://localhost:${config.port}`);
});

function shutdown() {
  server.close(() => {
    closeDb();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
