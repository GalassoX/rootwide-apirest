import { Router } from 'express';
import { myUser, getPanelUser, getPanelUserByDiscord, updateUserServices } from '../controllers/user.controller';
const router = Router();

/*router.get('/pcu/user/:user', getPanelUser);

router.get('/samp/user/:name', myUser);*/

router.get('/user/discord/:id', getPanelUserByDiscord);

//router.get('/user/update', updateUserServices);



//router.get('/user/samp/:id', myUser);

export default router;