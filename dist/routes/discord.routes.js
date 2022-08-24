"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const discord_controller_1 = require("../controllers/discord.controller");
const router = (0, express_1.Router)();
router.get('/discordinfo/:id', discord_controller_1.getDiscordInfo);
router.post('/discord/sync', discord_controller_1.syncUserDiscord);
exports.default = router;
