import * as mongoose from "mongoose";
import { app } from './app';
import CityModel from "./models/city";

const APP_PORT = process.env.APP_PORT || 3000;
const APP_HOST = process.env.APP_HOST || '0.0.0.0';

const mongodbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/task-db';

export async function connectDb() {
    await mongoose.connect(mongodbUrl);
    console.log('DB connected')

    const [someCity] = await CityModel.find().limit(1)
    // trying to construct  GeoJSON Point
    if (!someCity.location) {
        await CityModel.updateMany({},
            {
                $unset: {
                    location: '',
                    latitude: '',
                }
            }
        )
        // TODO doesnt work - it sets latitude value to literal string '$lat', not the value of field $lat
        await CityModel.updateMany({},
            {
                $set: {
                    latitude: '$lat',
                    // location: null,
                    'location.coordinates': [-79.4, 43.7],
                    // 'location.coordinates': ['$long', '$lat'],
                    'location.type': 'Point',
                }
            },
            { strict: false }
        )
        await CityModel.ensureIndexes({ "location": "2dsphere" })
    }

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

