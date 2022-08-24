"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncUserDiscord = exports.getDiscordInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../data/config");
const database_1 = require("../data/database");
const jwt_1 = require("../utils/jwt");
const getDiscordInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield axios_1.default.get(`https://discord.com/api/v9/users/${id}`, {
            headers: {
                Authorization: `Bot ${config_1.CONSTANTS.DISCORD_TOKEN}`
            }
        });
        res.status(200).json(user.data);
    }
    catch (error) {
        res.status(202).json({ error: 'No se pudo obtener la información desde discord' });
    }
});
exports.getDiscordInfo = getDiscordInfo;
const syncUserDiscord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { discordid } = req.body;
    if (!discordid) {
        res.status(400).json({ error: 'ID de discord invalida.' });
        return;
    }
    const user = yield (0, jwt_1.getTokenUser)(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized. ' });
        return;
    }
    const result = yield (0, database_1.executePCU)('UPDATE accounts SET discord=? WHERE id=?', [discordid, user.id]);
    if (result.affectedRows > 0) {
        if (result.affectedRows > 0) {
            const guildid = '963874088483430452';
            const roleid = '963918915245867059';
            axios_1.default.put(`https://discord.com/api/v9/guilds/${guildid}/members/${discordid}/roles/` + roleid, {}, {
                headers: {
                    Authorization: `Bot ${config_1.CONSTANTS.DISCORD_TOKEN}`
                }
            }).catch((error) => console.log(error));
            res.status(200).json({ message: 'Cuenta actualizada' });
        }
        else {
            res.status(404).json({ error: 'Cuenta no encontrada' });
        }
    }
    else {
        res.status(500).json({ error: 'A ocurrido un error, intentalo más tarde.' });
    }
});
exports.syncUserDiscord = syncUserDiscord;
