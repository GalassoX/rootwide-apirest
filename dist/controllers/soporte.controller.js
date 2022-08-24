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
exports.getPost = exports.createPostSoporte = exports.getSoporte = void 0;
const database_1 = require("../data/database");
const jwt_1 = require("../utils/jwt");
const getSoporte = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, jwt_1.getTokenUser)(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized. ' });
        return;
    }
    const samp = yield (0, database_1.executeGame)('SELECT * FROM accounts WHERE sqlid=?', [user.samp_id]);
    if (samp.length > 0) {
        const player = samp[0];
        let posts;
        if (player.admin > 0) {
            posts = yield (0, database_1.executePCU)('SELECT * FROM soporte_posts WHERE replyto=0', []);
        }
        else {
            posts = yield (0, database_1.executePCU)('SELECT * FROM soporte_posts WHERE created_by=? AND replyto=0', [user.id]);
        }
        let users = [];
        for (const i of posts) {
            const creator = yield (0, database_1.executePCU)('SELECT * FROM accounts WHERE id=?', [i.created_by]);
            users.push(creator[0]);
        }
        res.status(200).json({ tickets: posts, users: users });
    }
    else {
        res.status(500).json({
            es: { error: 'Ocurrió un error, cierre y abra sesión.' },
            en: { error: 'An error occurred, please log out and back in' }
        });
    }
});
exports.getSoporte = getSoporte;
const createPostSoporte = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, jwt_1.getTokenUser)(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized. ' });
        return;
    }
    let { title, message, reply } = req.body;
    if (!reply)
        reply = 0;
    let errors = [], errorEs = [];
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
    //const ticketid = count[0]['COUNT(*)'];
    let ticketid = 0;
    const count = yield (0, database_1.executePCU)('SELECT COUNT(*) from soporte_posts WHERE replyto=0', []);
    if (parseInt(reply) > 0) {
        ticketid = count[0]['COUNT(*)'] + 1;
    }
    else {
        ticketid = reply;
    }
    const created_at = Date.now();
    console.log(ticketid);
    const post = yield (0, database_1.executePCU)('INSERT INTO soporte_posts (ticketid, created_by, title, message, created_at) VALUES (?, ?, ?, ?, ?)', [ticketid, user.id, title, message, created_at]);
    if (post.affectedRows > 0) {
        yield (0, database_1.executePCU)('UPDATE soporte_posts SET replyto=? WHERE id=?', [reply, post.insertId]);
        const toview = yield (0, database_1.executePCU)('SELECT * FROM soporte_posts WHERE id=?', [post.insertId]);
        res.status(200).json(toview[0]);
    }
    else {
        res.status(500).json({
            es: { error: 'Ocurrió un error, cierre y abra sesión.' },
            en: { error: 'An error occurred, please log out and back in' }
        });
    }
});
exports.createPostSoporte = createPostSoporte;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, jwt_1.getTokenUser)(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized. ' });
        return;
    }
    const { tid } = req.query;
    //const ticketData = await executePCU<IPostSoporte[]>('SELECT * FROM soporte_posts WHERE id=? OR pid=?', [post, post]);
    const ticketData = yield (0, database_1.executePCU)('SELECT * FROM soporte_posts WHERE ticketid=?', [tid]);
    if (ticketData.length > 0) {
        const ticket = ticketData[0];
        const samp = yield (0, database_1.executeGame)('SELECT * FROM accounts WHERE sqlid=?', [user.samp_id]);
        if (samp.length > 0) {
            const player = samp[0];
            let authorized = false;
            if (player.admin > 0) {
                authorized = true;
            }
            else if (user.samp_id == ticket.created_by) {
                authorized = true;
            }
            if (authorized) {
                let users = [];
                for (const i of ticketData) {
                    const creator = yield (0, database_1.executePCU)('SELECT * FROM accounts WHERE id=?', [i.created_by]);
                    users.push(creator[0]);
                }
                ticketData.shift();
                const user = users.shift();
                res.status(200).json({ ticket: ticket, user: user, replys: { post: ticketData, users: users } });
            }
            else {
                res.status(401).json({ error: 'Unauthorized. ' });
            }
        }
        else {
            res.status(500).json({
                es: { error: 'Ocurrió un error, cierre y abra sesión.' },
                en: { error: 'An error occurred, please log out and back in' }
            });
        }
    }
    else {
        res.status(404).json({
            es: { error: 'Ese ticket no existe' },
            en: { error: 'This ticket not exists' }
        });
    }
});
exports.getPost = getPost;
