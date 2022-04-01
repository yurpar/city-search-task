import { Application } from 'express';
import * as express from 'express';
import router from "./router";

export const app: Application = express();

app.use(router)

app.use((_req, res) => {
    res.status(404);
    res.send('Route not found')
})
