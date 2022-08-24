import { Router } from 'express';
import { createUser, loginUser } from '../controllers/auth.controller';
const router = Router();

router.post('/signup', createUser);
router.post('/login', loginUser);

//router.get('/user/samp/:id', myUser);

export default router;