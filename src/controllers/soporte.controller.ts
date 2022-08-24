import { Request, Response } from 'express';
import { OkPacket } from 'mysql';
import { executeGame, executePCU } from '../data/database';
import { IUserSAMP } from '../data/interfaces/samp/account';
import { IPostSoporte } from '../data/interfaces/soporte';
import { getTokenUser } from '../utils/jwt';

export const getSoporte = async (req: Request, res: Response) => {
    const user = await getTokenUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized. ' });
        return;
    }
    const samp = await executeGame<IUserSAMP[]>('SELECT * FROM accounts WHERE sqlid=?', [user.samp_id]);
    if (samp.length > 0) {
        const player = samp[0];
        let posts: any[];
        if (player.admin > 0) {
            posts = await executePCU('SELECT * FROM soporte_posts WHERE replyto=0', []);
        } else {
            posts = await executePCU('SELECT * FROM soporte_posts WHERE created_by=? AND replyto=0', [user.id]);
        }
        let users = [];
        for (const i of posts) {
            const creator = await executePCU<any[]>('SELECT * FROM accounts WHERE id=?', [i.created_by]);
            users.push(creator[0]);
        }
        res.status(200).json({ tickets: posts, users: users });
    } else {
        res.status(500).json({
            es: { error: 'Ocurrió un error, cierre y abra sesión.' },
            en: { error: 'An error occurred, please log out and back in' }
        });
    }
}

export const createPostSoporte = async (req: Request, res: Response) => {
    const user = await getTokenUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized. ' });
        return;
    }
    let { title, message, reply } = req.body;
    if (!reply) reply = 0;
    let errors: string[] = [], errorEs: string[] = [];
    if (title.length <= 1) {
        errors.push('Invalid title');
        errorEs.push('Titulo inválido');
    }
    if (message.length <= 1) {
        errors.push('Invalid message');
        errorEs.push('Mensaje inválido');
    }
    if (errors.length > 0) {
        res.json({ en: errors, es: errorEs });
        return;
    }
    let ticketid = 0;
    const count = await executePCU<any[]>('SELECT COUNT(*) from soporte_posts WHERE replyto=0', []);
    if (parseInt(reply) > 0) {
        ticketid = count[0]['COUNT(*)'] + 1;
    } else {
        ticketid = reply;
    }
    const created_at = Date.now();
    console.log(ticketid);
    const post: OkPacket = await executePCU('INSERT INTO soporte_posts (ticketid, created_by, title, message, created_at) VALUES (?, ?, ?, ?, ?)', [ticketid, user.id, title, message, created_at]);
    if (post.affectedRows > 0) {
        await executePCU('UPDATE soporte_posts SET replyto=? WHERE id=?', [reply, post.insertId]);
        const toview = await executePCU<IPostSoporte[]>('SELECT * FROM soporte_posts WHERE id=?', [post.insertId]);
        res.status(200).json(toview[0]);
    } else {
        res.status(500).json({
            es: { error: 'Ocurrió un error, cierre y abra sesión.' },
            en: { error: 'An error occurred, please log out and back in' }
        });
    }
}

export const getPost = async (req: Request, res: Response) => {
    const user = await getTokenUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized. ' });
        return;
    }
    const { tid } = req.query;
    const ticketData = await executePCU<IPostSoporte[]>('SELECT * FROM soporte_posts WHERE ticketid=?', [tid]);
    if (ticketData.length > 0) {
        const ticket = ticketData[0];
        const samp = await executeGame<IUserSAMP[]>('SELECT * FROM accounts WHERE sqlid=?', [user.samp_id]);
        if (samp.length > 0) {
            const player = samp[0];
            let authorized = false;
            if (player.admin > 0) {
                authorized = true;
            } else if (user.samp_id == ticket.created_by) {
                authorized = true;
            }
            if (authorized) {
                let users = [];
                for (const i of ticketData) {
                    const creator = await executePCU<any[]>('SELECT * FROM accounts WHERE id=?', [i.created_by]);
                    users.push(creator[0]);
                }
                ticketData.shift();
                const user = users.shift();
                res.status(200).json({ ticket: ticket, user: user, replys: { post: ticketData, users: users } });
            } else {
                res.status(401).json({ error: 'Unauthorized. ' });
            }
        } else {
            res.status(500).json({
                es: { error: 'Ocurrió un error, cierre y abra sesión.' },
                en: { error: 'An error occurred, please log out and back in' }
            });
        }
    } else {
        res.status(404).json({
            es: { error: 'Ese ticket no existe' },
            en: { error: 'This ticket not exists' }
        });
    }
}