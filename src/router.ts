import { Router } from 'express';
import health from './health'
import suggestions from './suggestions';

const router = Router({ mergeParams: true })
    .use('/', health)
    .use('/suggestions', suggestions)

export default router;
