import { Router } from 'express';
import { createPJSamp, getPJSamp, getPJSampVehicles } from '../controllers/samp.controller';
const router = Router();

router.post('/samp/new', createPJSamp);
router.get('/samp', getPJSamp);
router.get('/samp/vehicles', getPJSampVehicles);

//router.get('/user/samp/:id', myUser);

export default router;