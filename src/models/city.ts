import { Schema, model } from 'mongoose';

interface City {
    name:  string,
    long:  number,
    lat:   number,
    location?: {
        type: 'Point',
        coordinates: number[]
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
    name:  String,
    long:  Number,
    lat:   Number,
    location: {
    type: pointSchema,
        required: true
    }
});

const CityModel = model<City>('City', citySchema);

export default CityModel;
