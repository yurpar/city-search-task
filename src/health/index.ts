import { Router } from 'express';
import * as HealthController from './Controller'

const router = Router({ mergeParams: true })

router.route('/', )
    .get(HealthController.get)

export default router;
