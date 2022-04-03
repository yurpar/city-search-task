import CityModel from '../models/city'

export enum SortField {
    NAME = 'name',
    DISTANCE = 'distance',
}

interface SuggestParams {
    q: string;
    latitude: number;
    longitude: number;
    radius: number;
    sort: SortField;
}

const projection = { _id: 0, name: 1, lat: 1, long: 1 }

const suggest = async (params: SuggestParams) => {
    const { q } = params
    if(!q) return []

    const filter = {
        name: { $regex: `^${params.q}`, $options: 'i' },
    }
    const sortParams = {
        name: (params.sort === SortField.NAME) ? 1 : 0,
        distance: (params.sort === SortField.DISTANCE) ? -1 : 0,
    }

    return CityModel
        .find(filter, projection)
        .sort(sortParams)
}

export default {
    suggest,
}
