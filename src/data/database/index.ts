//import mysql from 'mysql2/promise';
import { createPool, Pool } from 'mysql';
import { CONSTANTS } from '../config';

let database: Pool;
let dbGame: Pool;
let dbForo: Pool;
//export let dbGame: mysql.Connection;

export const connectDB = async () => {
    /*database = mysql.createConnection({
        host: CONSTANTS.DB.host,
        user: CONSTANTS.DB.user,
        database: CONSTANTS.DB.database,
        password; CONSTANTS.DB.password
    })*/
    try {
        /*database = await mysql.createConnection(CONSTANTS.DB);
        dbGame = await mysql.createConnection(CONSTANTS.DB_GAME);*/
        const dbInfo = CONSTANTS.DB;
        database = createPool({
            host: dbInfo.host,
            user: dbInfo.user,
            password: dbInfo.password,
            database: dbInfo.database,
            connectionLimit: 4
        });

        const dbGameInfo = CONSTANTS.DB_GAME;
        dbGame = createPool({
            host: dbGameInfo.host,
            user: dbGameInfo.user,
            password: dbGameInfo.password,
            database: dbGameInfo.database,
            connectionLimit: 4
        });

        const dbForoInfo = CONSTANTS.DB_FORO;
        dbForo = createPool({
            host: dbForoInfo.host,
            user: dbForoInfo.user,
            password: dbForoInfo.password,
            database: dbForoInfo.database,
            connectionLimit: 4
        });

        if (!database) {
            throw `Could not connect to database ${CONSTANTS.DB.database}`;
        } else console.log(`Connected to ${CONSTANTS.DB.database}`);

        if (!dbGame) {
            throw `Could not connect to database ${CONSTANTS.DB_GAME.database}`;
        } else console.log(`Connected to ${CONSTANTS.DB_GAME.database}`);

        if (!dbForo) {
            throw `Could not connect to database ${dbForoInfo.database}`;
        } else console.log(`Connected to ${dbForoInfo.database}`);
    } catch (e) {
        console.error(e);
        throw new Error('MySQL: Failed to initialized pool');
    }
};

export const executePCU = <T>(query: string, params: string[] | Object): Promise<T> => {
    try {
        if (!database) throw new Error('Pool PCU not created.');

        return new Promise<T>((resolve, reject) => {
            database.query(query, params, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    } catch (error) {
        console.error('[MySQL Error]: ', error);
        throw new Error('Failed to execute database query');
    }
};

export const executeGame = <T>(query: string, params: string[] | Object): Promise<T> => {
    try {
        if (!dbGame) throw new Error('Pool Game not created.');

        return new Promise<T>((resolve, reject) => {
            dbGame.query(query, params, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    } catch (error) {
        console.error('[MySQL Error]: ', error);
        throw new Error('Failed to execute dbGame query');
    }
};

export const executeForo = <T>(query: string, params: string[] | Object): Promise<T> => {
    try {
        if (!dbForo) throw new Error('Pool Foro not created.');

        return new Promise<T>((resolve, reject) => {
            dbForo.query(query, params, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    } catch (error) {
        console.error('[MySQL Error]: ', error);
        throw new Error('Failed to execute dbForo query');
    }
}