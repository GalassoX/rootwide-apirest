import { compare, genSalt, hash } from "bcryptjs"

export const encryptPassowrd = async (password: string) => {
    if (!password) return false;
    const salt = await genSalt(12);
    return await hash(password, salt);
}

export const verifyPassword = async (password: string, hash: string) => {
    if (!password || !hash) return false;
    return await compare(password, hash);
}