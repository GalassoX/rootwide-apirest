import { Request, Response } from "express";
import { executeGame, executePCU } from "../data/database";
import { IUserSAMP } from "../data/interfaces/samp/account";
import { characterNameValid } from "../utils/checkouts";
import { CONSTANTS } from "../data/config";
import { OkPacket } from "mysql";
import { generateToken, getDataToken, getTokenUser } from "../utils/jwt";

export const createPJSamp = async (req: Request, res: Response) => {
    const user = await getTokenUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized. ' });
        return;
    }

    const { character_first, character_last, age, gender } = req.body;
    let errorsEn = [], errorsEs = [];
    if (!characterNameValid(character_first)) {
        errorsEn.push('Invalid firstname');
        errorsEs.push('Nombre inválido.');
    }
    if (!characterNameValid(character_last)) {
        errorsEn.push('Invalid lastname');
        errorsEs.push('Apellido inválido.');
    }
    const numAge = parseInt(age)
    if (age.length == 0 || numAge < 16 || numAge > 80) {
        errorsEn.push('Invalid age');
        errorsEs.push('Edad inválida.');
    }
    const numGender = parseInt(gender)
    if (gender.length == 0 || numGender < 0 || numGender > 1) {
        errorsEn.push('Invalid gender');
        errorsEs.push('Género invalido.');
    }

    const characterName = character_first + '_' + character_last;
    const usersGame = await executeGame<IUserSAMP[]>(`SELECT * FROM accounts WHERE name=?`, [characterName]);

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
    } else {
        let skin = 26;
        if (gender == 1) {
            skin = 56;
        }
        const rows: OkPacket = await executeGame(`INSERT INTO accounts (name, account_state, spawn_x, spawn_y, spawn_z, spawn_r, money, bank, age, gender, in_jail, rent, skin) VALUES (?, 4, ?, ?, ?, ?, ?, ?, ?, ?, -1, -1, ?)`,
            [characterName, CONSTANTS.NEW_PLAYER_SPAWN.x, CONSTANTS.NEW_PLAYER_SPAWN.y, CONSTANTS.NEW_PLAYER_SPAWN.z, CONSTANTS.NEW_PLAYER_SPAWN.r,
                CONSTANTS.NEW_PLAYER_SPAWN.money, CONSTANTS.NEW_PLAYER_SPAWN.bank, age, gender, skin]);
        if (rows.affectedRows > 0) {
            const user = await getTokenUser(req);
            if (user) {
                const token = generateToken({ id: user.id, samp_id: rows.insertId });
                console.log(user.id);
                console.log(rows.insertId);
                await executePCU('UPDATE accounts SET token=?,samp_id=? WHERE id=?', [token, rows.insertId, user.id]);
                res.status(201).json({ token: token });
                return;
            }
        }
        res.status(500).json({
            es: { error: 'Ocurrió un error, intentalo más tarde.' },
            en: { error: 'An error occurred, please try again later.' }
        });
    }
}

export const getPJSamp = async (req: Request, res: Response) => {
    const user = await getTokenUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized. ' });
    } else {
        const data = getDataToken(req);
        if (!data) {
            res.status(500).json({ error: 'An internal error ocurred.' });
            return;
        }
        const samp = await executeGame<IUserSAMP[]>('SELECT * FROM accounts WHERE sqlid=?', [data.samp_id]);
        if (samp.length > 0) {
            res.status(200).json(samp[0]);
        } else {
            res.status(404).json({
                en: { error: 'This SA:MP account not exists.' },
                es: { error: 'Esa cuenta de SA:MP no existe.' }
            });
        }
    }
}

export const getPJSampVehicles = async (req: Request, res: Response) => {
    const user = await getTokenUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized. ' });
    } else {
        const data = getDataToken(req);
        if (!data) {
            res.status(500).json({ error: 'An internal error ocurred.' });
            return;
        }
        const samp = await executeGame<IUserSAMP[]>('SELECT * FROM vehicles WHERE ownerid=?', [data.samp_id]);
        res.status(200).json(samp.length > 0 ?
            samp[0] : {
                en: { error: 'No have vehicles' },
                es: { error: 'No tienes vehículos' }
            });
    }
}