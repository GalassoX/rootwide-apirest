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
exports.getPJSampVehicles = exports.getPJSamp = exports.createPJSamp = void 0;
const database_1 = require("../data/database");
const checkouts_1 = require("../utils/checkouts");
const config_1 = require("../data/config");
const jwt_1 = require("../utils/jwt");
const createPJSamp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, jwt_1.getTokenUser)(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized. ' });
        return;
    }
    const { character_first, character_last, age, gender } = req.body;
    let errorsEn = [], errorsEs = [];
    if (!(0, checkouts_1.characterNameValid)(character_first)) {
        errorsEn.push('Invalid firstname');
        errorsEs.push('Nombre inválido.');
    }
    if (!(0, checkouts_1.characterNameValid)(character_last)) {
        errorsEn.push('Invalid lastname');
        errorsEs.push('Apellido inválido.');
    }
    const numAge = parseInt(age);
    if (age.length == 0 || numAge < 16 || numAge > 80) {
        errorsEn.push('Invalid age');
        errorsEs.push('Edad inválida.');
    }
    const numGender = parseInt(gender);
    if (gender.length == 0 || numGender < 0 || numGender > 1) {
        errorsEn.push('Invalid gender');
        errorsEs.push('Género invalido.');
    }
    const characterName = character_first + '_' + character_last;
    const usersGame = yield (0, database_1.executeGame)(`SELECT * FROM accounts WHERE name=?`, [characterName]);
    if (usersGame.length > 0) {
        if (usersGame[0].name === characterName) {
            errorsEn.push('This SA:MP occupied');
            errorsEs.push('Ese personaje ya existe.');
        }
    }
    if (errorsEs.length > 0) {
        res.status(403).json({
            en: { errors: errorsEn },
            es: { errors: errorsEs }
        });
    }
    else {
        let skin = 26;
        if (gender == 1) {
            skin = 56;
        }
        const rows = yield (0, database_1.executeGame)(`INSERT INTO accounts (name, account_state, spawn_x, spawn_y, spawn_z, spawn_r, money, bank, age, gender, in_jail, rent, skin) VALUES (?, 4, ?, ?, ?, ?, ?, ?, ?, ?, -1, -1, ?)`, [characterName, config_1.CONSTANTS.NEW_PLAYER_SPAWN.x, config_1.CONSTANTS.NEW_PLAYER_SPAWN.y, config_1.CONSTANTS.NEW_PLAYER_SPAWN.z, config_1.CONSTANTS.NEW_PLAYER_SPAWN.r,
            config_1.CONSTANTS.NEW_PLAYER_SPAWN.money, config_1.CONSTANTS.NEW_PLAYER_SPAWN.bank, age, gender, skin]);
        if (rows.affectedRows > 0) {
            const user = yield (0, jwt_1.getTokenUser)(req);
            if (user) {
                const token = (0, jwt_1.generateToken)({ id: user.id, samp_id: rows.insertId });
                console.log(user.id);
                console.log(rows.insertId);
                yield (0, database_1.executePCU)('UPDATE accounts SET token=?,samp_id=? WHERE id=?', [token, rows.insertId, user.id]);
                res.status(201).json({ token: token });
                return;
            }
        }
        res.status(500).json({
            es: { error: 'Ocurrió un error, intentalo más tarde.' },
            en: { error: 'An error occurred, please try again later.' }
        });
    }
});
exports.createPJSamp = createPJSamp;
const getPJSamp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            res.status(200).json(samp[0]);
        }
        else {
            res.status(404).json({
                en: { error: 'This SA:MP account not exists.' },
                es: { error: 'Esa cuenta de SA:MP no existe.' }
            });
        }
    }
});
exports.getPJSamp = getPJSamp;
const getPJSampVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const samp = yield (0, database_1.executeGame)('SELECT * FROM vehicles WHERE ownerid=?', [data.samp_id]);
        res.status(200).json(samp.length > 0 ?
            samp[0] : {
            en: { error: 'No have vehicles' },
            es: { error: 'No tienes vehículos' }
        });
    }
});
exports.getPJSampVehicles = getPJSampVehicles;
