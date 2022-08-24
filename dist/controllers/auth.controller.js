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
exports.loginUser = exports.createUser = void 0;
const database_1 = require("../data/database");
const checkouts_1 = require("../utils/checkouts");
const crypt_1 = require("../utils/crypt");
const jwt_1 = require("../utils/jwt");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    let errors = [];
    let errorsEs = [];
    if (!(0, checkouts_1.usernameValid)(username)) {
        errors.push('Invalid username.');
        errorsEs.push('Nombre de usuario inválido.');
    }
    if (!(0, checkouts_1.emailValid)(email)) {
        errors.push('Invalid email.');
        errorsEs.push('Email inválido.');
    }
    if (!password || password.length <= 4) {
        errors.push('Invalid password.');
        errorsEs.push('Contraseña inválida.');
    }
    //const characterName = character_first + '_' + character_last;
    const usersPCU = yield (0, database_1.executePCU)(`SELECT * FROM accounts WHERE username=? OR email=?`, [username, email]);
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
    const hash = yield (0, crypt_1.encryptPassowrd)(password);
    if (!hash) {
        errors.push('Invalid password.');
        errorsEs.push('Contraseña invalida.');
    }
    if (errors.length > 0) {
        res.status(403).json({
            en: { errors: errors },
            es: { errors: errorsEs }
        });
    }
    else {
        const rowsPCU = yield (0, database_1.executePCU)(`INSERT INTO accounts (username, password, email, samp_id) VALUES (?, ?, ?, 0)`, [username, hash, email]);
        if (rowsPCU.affectedRows > 0) {
            const token = (0, jwt_1.generateToken)({
                id: rowsPCU.insertId,
                samp_id: 0
            });
            yield (0, database_1.executePCU)('UPDATE accounts SET token=? WHERE id=?', [token, rowsPCU.insertId]);
            res.status(201).json({ token: token });
            return;
        }
        res.status(500).json({
            es: { error: 'Ocurrió un error, intentalo más tarde.' },
            en: { error: 'An error occurred, please try again later.' }
        });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userOrEmail, password } = req.body;
    const usersPCU = yield (0, database_1.executePCU)(`SELECT * FROM accounts WHERE username=? OR email=?`, [userOrEmail, userOrEmail]);
    if (usersPCU.length > 0) {
        const user = usersPCU[0];
        const isValid = yield (0, crypt_1.verifyPassword)(password, user.password);
        if (isValid) {
            const token = (0, jwt_1.generateToken)({
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
});
exports.loginUser = loginUser;
