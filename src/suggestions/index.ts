import { Router } from 'express';
import * as SuggestionsController from './Controller'

const router = Router({ mergeParams: true })

router.route('/', )
    .get(SuggestionsController.get)

export default router;
