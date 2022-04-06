import { RequestHandler } from "express";
import cityService, { SortField } from "../services/cityService";
import { isIpAllowed } from "../services/ipService";

export const get: RequestHandler = async (req, res, next) => {
    try {
        const { q = '', latitude, longitude, radius, sort = 'name' } = req.query as Record<string, string>
        let suggestions = []

        const allowRequest = await isIpAllowed(res.locals.clientIp)
        if (!allowRequest) {
            res.status(429).send()
        }

        const params = {
            q,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            radius: parseInt(radius, 10),
            sort: sort === SortField.DISTANCE ? SortField.DISTANCE : SortField.NAME,
        }

        // TODO validate values (empty, range, etc)
        if (params.q && params.radius > 0
            && params.latitude <= 90 && params.latitude >= -90
            && params.longitude <= 180 && params.longitude >= -180) {

            suggestions = await cityService.suggest(params)
        }

        res.json({ suggestions });

    } catch (e) {
        next(e)
    }
}
