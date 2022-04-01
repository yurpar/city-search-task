import { app } from './app';

const APP_PORT = process.env.APP_PORT || 3000;
const APP_HOST = process.env.APP_HOST || '0.0.0.0';

const server = app.listen(APP_PORT);

process.on('unhandledRejection', (reason, p) =>
    console.log('Unhandled Rejection', p, reason)
);

server.on('listening', () =>
    console.log(`application started on http://${APP_HOST}:${APP_PORT}`)
);
