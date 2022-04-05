import { Schema, model } from 'mongoose';

export interface City {
    name: string,
    long: number,
    lat: number,
    location: {
        type: 'Point',
        coordinates: [number, number]
    }
}

const pointSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const citySchema = new Schema<City>({
    name: String,
    long: Number,
    lat: Number,
    location: {
        type: pointSchema,
        index: '2dsphere',
        required: false
    }
});

const CityModel = model<City>('City', citySchema);

export default CityModel;
