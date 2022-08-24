import { config } from 'dotenv';

config();

const NEW_PLAYER_SPAWN = {
    x: 1726.7014,
    y: -1687.1825,
    z: 13.5164,
    r: 178.1227,
    money: 1500,
    bank: 3000,
}

export const CONSTANTS = {
    PORT: process.env.PORT || 4444,
    PRIVATE_TOKEN: process.env.PRIVATE_TOKEN as string,
    DB: {
        host: process.env.DB_HOST as string,
        user: process.env.DB_USER as string,
        database: process.env.DB_DBNAME as string,
        password: process.env.DB_PASSWORD || ''
    },
    DB_GAME: {
        host: process.env.DB_GAME_HOST as string,
        user: process.env.DB_GAME_USER as string,
        database: process.env.DB_GAME_DBNAME as string,
        password: process.env.DB_GAME_PASSWORD || ''
    },
    DB_FORO: {
        host: process.env.DB_FORO_HOST as string,
        user: process.env.DB_FORO_USER as string,
        database: process.env.DB_FORO_DBNAME as string,
        password: process.env.DB_FORO_PASSWORD || ''
    },
    NEW_PLAYER_SPAWN: NEW_PLAYER_SPAWN,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN
};