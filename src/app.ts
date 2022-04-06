import { Application } from 'express';
import * as express from 'express';
import * as requestIp from 'request-ip';

import router from "./router";

export const app: Application = express();

app.use((req, res, next) => {
    res.locals.clientIp = requestIp.getClientIp(req);
    next();
})

app.use(router)

app.use((_req, res) => {
    res.status(404);
    res.send('Route not found')
})
