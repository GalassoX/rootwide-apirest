import { Request, Response } from "express";
import { executeForo, executeGame, executePCU } from "../data/database";
import { IUserSAMP } from "../data/interfaces/samp/account";
import { IUser } from "../data/interfaces/user";
import { isNumeric } from "../utils/helps";
import { getDataToken, getTokenUser } from "../utils/jwt";
//import { getUserInHeaders } from "../utils/jwt";

export const myUser = async (req: Request, res: Response) => {
    const user = req.params.name;
    /*const email = getUserInHeaders(req);
    if (!email) {
        res.status(401).json({ message: 'Unauthorized.' });
        return;
    }
    const [rows, fields] = await dbGame.execute(`SELECT * FROM accounts WHERE email=?`, [email]);*/
    //const rows = await dbGame.execute(`SELECT * FROM accounts WHERE name=?`, [req.params.name]) as unknown[] as IUserSAMP[][];
    let rows: any[];
    if (isNumeric(user)) {
        rows = await executeGame<IUserSAMP[]>(`SELECT * FROM accounts WHERE sqlid=?`, [parseInt(user)]);
    }
    else {
        rows = await executeGame<IUserSAMP[]>(`SELECT * FROM accounts WHERE name=?`, [user]);
    }
    rows.length > 0 ?
        res.status(200).json(rows[0]) :
        res.status(403).json({ error: 'User not found' })
};

export const getPanelUser = async (req: Request, res: Response) => {
    const user = req.params.name;
    /*const email = getUserInHeaders(req);
    if (!email) {
        res.status(401).json({ message: 'Unauthorized.' });
        return;
    }
    const [rows, fields] = await dbGame.execute(`SELECT * FROM accounts WHERE email=?`, [email]);*/
    //const rows = await dbGame.execute(`SELECT * FROM accounts WHERE name=?`, [req.params.name]) as unknown[] as IUserSAMP[][];
    let rows: any[];
    if (isNumeric(user)) {
        rows = await executePCU<IUser[]>(`SELECT * FROM accounts WHERE id=?`, [parseInt(user)]);
    }
    else {
        rows = await executePCU<IUser[]>(`SELECT * FROM accounts WHERE username=?`, [user]);
    }
    rows.length > 0 ?
        res.status(200).json(rows[0]) :
        res.status(403).json({ error: 'User not found' });
};

export const getPanelUserByDiscord = async (req: Request, res: Response) => {
    const id = req.params.id;
    const rows = await executePCU<IUser[]>(`SELECT * FROM accounts WHERE discord=?`, [id]);
    if (rows.length > 0) {
        const rowsGame = await executeGame<IUserSAMP[]>(`SELECT * FROM accounts WHERE sqlid=?`, [rows[0].samp_id]);
        res.status(200).json({
            pcu: rows[0],
            samp: rowsGame[0]
        })
        return;
    }
    res.status(403).json({ error: 'User not found' });
};


export const updateUserServices = async (req: Request, res: Response) => {
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
            const { admin } = samp[0];
            let foroLevel = 1;
            if (admin > 0 && admin < 6) {
                foroLevel = 6;
            } else if (admin == 6) {
                foroLevel = 3;
            } else if (admin > 6 && admin <= 9) {
                foroLevel = 4;
            }
            //await executeForo('UPDATE users SET usergroup=? WHERE ??', [foroLevel]);
        } else {
            res.status(404).json({
                en: { error: 'There is nothing to update...' },
                es: { error: 'No hay nada que actualizar...' }
            });
        }
    }
}