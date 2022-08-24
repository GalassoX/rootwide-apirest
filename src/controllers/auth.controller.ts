import { Request, Response } from "express";
import { OkPacket } from "mysql";
import { executePCU } from "../data/database";
import { IUser } from "../data/interfaces/user";
import { usernameValid, emailValid } from "../utils/checkouts";
import { encryptPassowrd, verifyPassword } from "../utils/crypt";
import { generateToken } from "../utils/jwt";

export const createUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    let errors = [];
    let errorsEs = [];
    if (!usernameValid(username)) {
        errors.push('Invalid username.');
        errorsEs.push('Nombre de usuario inválido.');
    }
    if (!emailValid(email)) {
        errors.push('Invalid email.');
        errorsEs.push('Email inválido.');
    }
    if (!password || password.length <= 4) {
        errors.push('Invalid password.');
        errorsEs.push('Contraseña inválida.');
    }

    //const characterName = character_first + '_' + character_last;
    const usersPCU = await executePCU<IUser[]>(`SELECT * FROM accounts WHERE username=? OR email=?`, [username, email]);
    //const usersGame = await executeGame<IUserSAMP[]>(`SELECT * FROM accounts WHERE name=?`, [characterName]);

    if (usersPCU.length > 0) {
        if (usersPCU[0].username == username) {
            errors.push('This user is already registered.');
            errorsEs.push('Ese nombre de usuario ya esta ocupado.');
        }
        if (usersPCU[0].email == email) {
            errors.push('This email is already registered.');
            errorsEs.push('Ese email ya esta ocupado.');
        }
    }
    const hash = await encryptPassowrd(password);
    if (!hash) {
        errors.push('Invalid password.');
        errorsEs.push('Contraseña invalida.');
    }
    if (errors.length > 0) {
        res.status(403).json({
            en: { errors: errors },
            es: { errors: errorsEs }
        });
    } else {
        const rowsPCU: OkPacket = await executePCU(`INSERT INTO accounts (username, password, email, samp_id) VALUES (?, ?, ?, 0)`,
            [username, hash, email]);

        if (rowsPCU.affectedRows > 0) {
            const token = generateToken({
                id: rowsPCU.insertId,
                samp_id: 0
            });
            await executePCU('UPDATE accounts SET token=? WHERE id=?', [token, rowsPCU.insertId]);
            res.status(201).json({ token: token });
            return;
        }
        res.status(500).json({
            es: { error: 'Ocurrió un error, intentalo más tarde.' },
            en: { error: 'An error occurred, please try again later.' }
        });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { userOrEmail, password } = req.body;

    const usersPCU = await executePCU<IUser[]>(`SELECT * FROM accounts WHERE username=? OR email=?`, [userOrEmail, userOrEmail]);

    if (usersPCU.length > 0) {
        const user = usersPCU[0];
        const isValid = await verifyPassword(password, user.password);
        if (isValid) {
            const token = generateToken({
                id: user.id,
                samp_id: user.samp_id
            });
            res.status(200).json({ token: token });
            return;
        }
    }
    res.status(400).json({
        en: { error: 'Username or email invalid.' },
        es: { error: 'Las credenciales de ingreso no son correctos.' }
    });
}