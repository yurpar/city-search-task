import CityModel from '../models/city'
import { PipelineStage } from "mongoose";

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

const suggest = async (params: SuggestParams) => {
    const { q, longitude, latitude, radius } = params
    if (!q) return []

    const pipelines: PipelineStage[] = [{
        $geoNear: {
            near: { type: 'Point', coordinates: [longitude, latitude] },
            distanceField: 'distance',
            query: {
                name: { '$regex': `^${params.q}`, '$options': 'i' }
            },
            maxDistance: radius * 1000,
            spherical: true
        }
    }]

    // default is 'distance' sort
    if (params.sort === SortField.NAME) {
        pipelines.push({ $sort: { name: 1 } })
    }

    pipelines.push({
        $project: {
            name: { $concat: ['$name', ', ', '$admin', ', ', '$country'] },
            latitude: { $arrayElemAt: ['$location.coordinates', 0] },
            longitude: { $arrayElemAt: ['$location.coordinates', 1] },
            distance: { '$round': [{ $divide: ['$distance', 1000] }, 1] },
            _id: 0
        }
    })

    let query = CityModel.aggregate(pipelines)

    return query;
}

export default {
    suggest,
}
