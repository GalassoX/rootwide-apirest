import axios from "axios";
import { Request, Response } from "express";
import { OkPacket } from "mysql";
import { CONSTANTS } from "../data/config";
import { executePCU } from "../data/database";

import { getTokenUser } from "../utils/jwt";

export const getDiscordInfo = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await axios.get(`https://discord.com/api/v9/users/${id}`, {
            headers: {
                Authorization: `Bot ${CONSTANTS.DISCORD_TOKEN}`
            }
        });
        res.status(200).json(user.data);
    } catch (error) {
        res.status(202).json({ error: 'No se pudo obtener la información desde discord' });
    }
};

export const syncUserDiscord = async (req: Request, res: Response) => {
    const { discordid } = req.body;
    if (!discordid) {
        res.status(400).json({ error: 'ID de discord invalida.' });
        return;
    }

    const user = await getTokenUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized. ' });
        return;
    }

    const result = await executePCU<OkPacket>('UPDATE accounts SET discord=? WHERE id=?', [discordid, user.id]);

    if (result.affectedRows > 0) {
        if (result.affectedRows > 0) {
            const guildid = '963874088483430452';
            const roleid = '963918915245867059';
            axios.put(`https://discord.com/api/v9/guilds/${guildid}/members/${discordid}/roles/` + roleid, {}, {
                headers: {
                    Authorization: `Bot ${CONSTANTS.DISCORD_TOKEN}`
                }
            }).catch((error) => console.log(error));
            res.status(200).json({ message: 'Cuenta actualizada' });
        } else {
            res.status(404).json({ error: 'Cuenta no encontrada' });
        }
    } else {
        res.status(500).json({ error: 'A ocurrido un error, intentalo más tarde.' });
    }
}