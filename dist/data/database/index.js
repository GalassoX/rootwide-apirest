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
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeForo = exports.executeGame = exports.executePCU = exports.connectDB = void 0;
//import mysql from 'mysql2/promise';
const mysql_1 = require("mysql");
const config_1 = require("../config");
let database;
let dbGame;
let dbForo;
//export let dbGame: mysql.Connection;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    /*database = mysql.createConnection({
        host: CONSTANTS.DB.host,
        user: CONSTANTS.DB.user,
        database: CONSTANTS.DB.database,
        password; CONSTANTS.DB.password
    })*/
    try {
        /*database = await mysql.createConnection(CONSTANTS.DB);
        dbGame = await mysql.createConnection(CONSTANTS.DB_GAME);*/
        const dbInfo = config_1.CONSTANTS.DB;
        database = (0, mysql_1.createPool)({
            host: dbInfo.host,
            user: dbInfo.user,
            password: dbInfo.password,
            database: dbInfo.database,
            connectionLimit: 4
        });
        const dbGameInfo = config_1.CONSTANTS.DB_GAME;
        dbGame = (0, mysql_1.createPool)({
            host: dbGameInfo.host,
            user: dbGameInfo.user,
            password: dbGameInfo.password,
            database: dbGameInfo.database,
            connectionLimit: 4
        });
        const dbForoInfo = config_1.CONSTANTS.DB_FORO;
        dbForo = (0, mysql_1.createPool)({
            host: dbForoInfo.host,
            user: dbForoInfo.user,
            password: dbForoInfo.password,
            database: dbForoInfo.database,
            connectionLimit: 4
        });
        if (!database) {
            throw `Could not connect to database ${config_1.CONSTANTS.DB.database}`;
        }
        else
            console.log(`Connected to ${config_1.CONSTANTS.DB.database}`);
        if (!dbGame) {
            throw `Could not connect to database ${config_1.CONSTANTS.DB_GAME.database}`;
        }
        else
            console.log(`Connected to ${config_1.CONSTANTS.DB_GAME.database}`);
        if (!dbForo) {
            throw `Could not connect to database ${dbForoInfo.database}`;
        }
        else
            console.log(`Connected to ${dbForoInfo.database}`);
    }
    catch (e) {
        console.error(e);
        throw new Error('MySQL: Failed to initialized pool');
    }
});
exports.connectDB = connectDB;
const executePCU = (query, params) => {
    try {
        if (!database)
            throw new Error('Pool PCU not created.');
        return new Promise((resolve, reject) => {
            database.query(query, params, (error, results) => {
                if (error)
                    reject(error);
                else
                    resolve(results);
            });
        });
    }
    catch (error) {
        console.error('[MySQL Error]: ', error);
        throw new Error('Failed to execute database query');
    }
};
exports.executePCU = executePCU;
const executeGame = (query, params) => {
    try {
        if (!dbGame)
            throw new Error('Pool Game not created.');
        return new Promise((resolve, reject) => {
            dbGame.query(query, params, (error, results) => {
                if (error)
                    reject(error);
                else
                    resolve(results);
            });
        });
    }
    catch (error) {
        console.error('[MySQL Error]: ', error);
        throw new Error('Failed to execute dbGame query');
    }
};
exports.executeGame = executeGame;
const executeForo = (query, params) => {
    try {
        if (!dbForo)
            throw new Error('Pool Foro not created.');
        return new Promise((resolve, reject) => {
            dbForo.query(query, params, (error, results) => {
                if (error)
                    reject(error);
                else
                    resolve(results);
            });
        });
    }
    catch (error) {
        console.error('[MySQL Error]: ', error);
        throw new Error('Failed to execute dbForo query');
    }
};
exports.executeForo = executeForo;
