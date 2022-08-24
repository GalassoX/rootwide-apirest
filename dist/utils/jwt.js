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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenUser = exports.getToken = exports.getDataToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../data/config");
const database_1 = require("../data/database");
const generateToken = (data) => {
    //const payload = { id: id, samp_id: samp_id };
    return jsonwebtoken_1.default.sign(data, config_1.CONSTANTS.PRIVATE_TOKEN);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.CONSTANTS.PRIVATE_TOKEN);
    return decoded;
};
exports.verifyToken = verifyToken;
/*export const getUserInHeaders = (req: Request) => {
    const token = req.headers.authorization as string;
    if (!token) return false;
    const decoded = verifyToken(token) as jwt.JwtPayload;
    if (!decoded) {
        return false;
    }
    return decoded;
}*/
const getDataToken = (req) => {
    const token = (0, exports.getToken)(req);
    return token ? (0, exports.verifyToken)(token) : null;
};
exports.getDataToken = getDataToken;
const getToken = (req) => {
    return req.headers.authorization;
};
exports.getToken = getToken;
const getTokenUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token)
        return false;
    const { id } = (0, exports.verifyToken)(token);
    const user = yield (0, database_1.executePCU)('SELECT * FROM accounts WHERE id=?', [id]);
    return user.length > 0 ? user[0] : null;
});
exports.getTokenUser = getTokenUser;
