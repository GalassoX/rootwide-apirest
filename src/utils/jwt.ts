import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { CONSTANTS } from '../data/config';
import { executePCU } from '../data/database';
import { IUserFixed } from '../data/interfaces/user';

declare module "jsonwebtoken" {
    export interface JwtPayload {
        //email: string;
        id: number;
        samp_id: number;
    }
}

interface IDataToken {
    id: number;
    samp_id: number;
}

export const generateToken = (data: IDataToken) => {
    //const payload = { id: id, samp_id: samp_id };
    return jwt.sign(data, CONSTANTS.PRIVATE_TOKEN);
}

export const verifyToken = (token: string) => {
    const decoded = jwt.verify(token, CONSTANTS.PRIVATE_TOKEN);
    return decoded;
}

/*export const getUserInHeaders = (req: Request) => {
    const token = req.headers.authorization as string;
    if (!token) return false;
    const decoded = verifyToken(token) as jwt.JwtPayload;
    if (!decoded) {
        return false;
    }
    return decoded;
}*/

export const getDataToken = (req: Request) => {
    const token = getToken(req);
    return token ? verifyToken(token) as JwtPayload : null;
}

export const getToken = (req: Request) => {
    return req.headers.authorization;
}

export const getTokenUser = async (req: Request) => {
    const token = req.headers.authorization as string;
    if (!token) return false;
    const { id } = verifyToken(token) as JwtPayload;
    const user = await executePCU<IUserFixed[]>('SELECT * FROM accounts WHERE id=?', [id]);
    return user.length > 0 ? user[0] : null;
}