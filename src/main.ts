import * as mongoose from "mongoose";
import { app } from './app';

const APP_PORT = process.env.APP_PORT || 3000;
const APP_HOST = process.env.APP_HOST || '0.0.0.0';

const mongodbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/task-db';

export async function connectDb() {
    await mongoose.connect(mongodbUrl);
    console.log('DB connected')

    return mongoose.connection;
}

connectDb()
    .then(() => {
        const server = app.listen(APP_PORT);

        server.on('listening', () =>
            console.log(`application started on http://${APP_HOST}:${APP_PORT}`)
        );
    })
    .catch((error) => console.log(error));

process.on('unhandledRejection', (reason, p) =>
    console.log('Unhandled Rejection', p, reason)
);

