import { Router } from 'express';
import {
    getDiscordInfo,
    syncUserDiscord
} from '../controllers/discord.controller';

const router = Router();

router.get('/discordinfo/:id', getDiscordInfo);

router.post('/discord/sync', syncUserDiscord);

export default router;