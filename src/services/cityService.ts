import CityModel from '../models/city'

export enum SortField {
    NAME = 'name',
    DISTANCE = 'distance',
}

interface SuggestParams {
    q: string;
    latitude: number;
    longitude: number;
    radius: number; // km
    sort: SortField;
}

const projection = { _id: 0, name: 1, lat: 1, long: 1, country: 1 }

const suggest = async (params: SuggestParams) => {
    const { q, longitude, latitude, radius } = params
    if (!q) return []

    const filter = {
        name: { '$regex': `^${params.q}`, '$options': 'i' },
        location: {
            '$nearSphere': {
                '$geometry': {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                '$maxDistance': radius * 1000
            }
        }
    }

    let query = CityModel
        .find(filter, projection);

    // default is 'distance' sort
    if (params.sort === SortField.NAME) {
        query.sort(SortField.NAME)
    }

    return query;
}

export default {
    suggest,
}
