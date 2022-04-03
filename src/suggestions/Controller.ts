import { RequestHandler } from "express";
import cityService, { SortField } from "../services/cityService";

export const get: RequestHandler = async (req, res, next) => {
    try {
        const { q = '', latitude, longitude, radius, sort = 'name' } = req.query as Record<string, string>
        let suggestions = []

        const params = {
            q,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            radius: parseInt(radius, 10),
            sort: sort === SortField.DISTANCE ? SortField.DISTANCE : SortField.NAME,
        }
        // TODO validate values (empty, range, etc)

        suggestions = await cityService.suggest(params)

        res.json({ suggestions });
    } catch (e) {
        next(e)
    }
}
