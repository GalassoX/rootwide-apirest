"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANTS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const NEW_PLAYER_SPAWN = {
    x: 1726.7014,
    y: -1687.1825,
    z: 13.5164,
    r: 178.1227,
    money: 1500,
    bank: 3000,
};
exports.CONSTANTS = {
    PORT: process.env.PORT || 4444,
    PRIVATE_TOKEN: process.env.PRIVATE_TOKEN,
    DB: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DBNAME,
        password: process.env.DB_PASSWORD || ''
    },
    DB_GAME: {
        host: process.env.DB_GAME_HOST,
        user: process.env.DB_GAME_USER,
        database: process.env.DB_GAME_DBNAME,
        password: process.env.DB_GAME_PASSWORD || ''
    },
    DB_FORO: {
        host: process.env.DB_FORO_HOST,
        user: process.env.DB_FORO_USER,
        database: process.env.DB_FORO_DBNAME,
        password: process.env.DB_FORO_PASSWORD || ''
    },
    NEW_PLAYER_SPAWN: NEW_PLAYER_SPAWN,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN
};
