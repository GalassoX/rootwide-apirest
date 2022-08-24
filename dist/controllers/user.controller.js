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
exports.updateUserServices = exports.getPanelUserByDiscord = exports.getPanelUser = exports.myUser = void 0;
const database_1 = require("../data/database");
const helps_1 = require("../utils/helps");
const jwt_1 = require("../utils/jwt");
//import { getUserInHeaders } from "../utils/jwt";
const myUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.params.name;
    /*const email = getUserInHeaders(req);
    if (!email) {
        res.status(401).json({ message: 'Unauthorized.' });
        return;
    }
    const [rows, fields] = await dbGame.execute(`SELECT * FROM accounts WHERE email=?`, [email]);*/
    //const rows = await dbGame.execute(`SELECT * FROM accounts WHERE name=?`, [req.params.name]) as unknown[] as IUserSAMP[][];
    let rows;
    if ((0, helps_1.isNumeric)(user)) {
        rows = yield (0, database_1.executeGame)(`SELECT * FROM accounts WHERE sqlid=?`, [parseInt(user)]);
    }
    else {
        rows = yield (0, database_1.executeGame)(`SELECT * FROM accounts WHERE name=?`, [user]);
    }
    rows.length > 0 ?
        res.status(200).json(rows[0]) :
        res.status(403).json({ error: 'User not found' });
});
exports.myUser = myUser;
const getPanelUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.params.name;
    /*const email = getUserInHeaders(req);
    if (!email) {
        res.status(401).json({ message: 'Unauthorized.' });
        return;
    }
    const [rows, fields] = await dbGame.execute(`SELECT * FROM accounts WHERE email=?`, [email]);*/
    //const rows = await dbGame.execute(`SELECT * FROM accounts WHERE name=?`, [req.params.name]) as unknown[] as IUserSAMP[][];
    let rows;
    if ((0, helps_1.isNumeric)(user)) {
        rows = yield (0, database_1.executePCU)(`SELECT * FROM accounts WHERE id=?`, [parseInt(user)]);
    }
    else {
        rows = yield (0, database_1.executePCU)(`SELECT * FROM accounts WHERE username=?`, [user]);
    }
    rows.length > 0 ?
        res.status(200).json(rows[0]) :
        res.status(403).json({ error: 'User not found' });
});
exports.getPanelUser = getPanelUser;
const getPanelUserByDiscord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const rows = yield (0, database_1.executePCU)(`SELECT * FROM accounts WHERE discord=?`, [id]);
    if (rows.length > 0) {
        const rowsGame = yield (0, database_1.executeGame)(`SELECT * FROM accounts WHERE sqlid=?`, [rows[0].samp_id]);
        res.status(200).json({
            pcu: rows[0],
            samp: rowsGame[0]
        });
        return;
    }
    res.status(403).json({ error: 'User not found' });
});
exports.getPanelUserByDiscord = getPanelUserByDiscord;
const updateUserServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, jwt_1.getTokenUser)(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized. ' });
    }
    else {
        const data = (0, jwt_1.getDataToken)(req);
        if (!data) {
            res.status(500).json({ error: 'An internal error ocurred.' });
            return;
        }
        const samp = yield (0, database_1.executeGame)('SELECT * FROM accounts WHERE sqlid=?', [data.samp_id]);
        if (samp.length > 0) {
            const { admin } = samp[0];
            let foroLevel = 1;
            if (admin > 0 && admin < 6) {
                foroLevel = 6;
            }
            else if (admin == 6) {
                foroLevel = 3;
            }
            else if (admin > 6 && admin <= 9) {
                foroLevel = 4;
            }
            //await executeForo('UPDATE users SET usergroup=? WHERE ??', [foroLevel]);
        }
        else {
            res.status(404).json({
                en: { error: 'There is nothing to update...' },
                es: { error: 'No hay nada que actualizar...' }
            });
        }
    }
});
exports.updateUserServices = updateUserServices;
