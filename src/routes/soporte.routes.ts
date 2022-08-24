import { Router } from 'express';
import { createPostSoporte, getPost, getSoporte } from '../controllers/soporte.controller';
const router = Router();

router.get('/soporte', getSoporte);
router.post('/soporte/new', createPostSoporte);
router.get('/soporte/ticket', getPost);

export default router;