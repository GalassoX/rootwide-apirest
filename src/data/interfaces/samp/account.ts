import { IPlayerPos } from "../shared";

export interface IUserSAMP {
    sqlid: number | 0;
    username: string;
    token: string;
    email: string;

    samp_id: number;
    name: string;
    password: string;
    account_state: number;
    spawn: IPlayerPos;
    hours_playing: number;
    deaths: number;
    kills: number;
    phone: number;
    house: number;
    car: number;
    faction: number;
    rank: number;
    girlfriend: string;
    fight: number;
    warns: number;
    city: number;
    pockets: number[];
    health: number;
    armour: number;
    tired: number;
    money: number;
    bank: number;
    jail: number;
    admin: number;
    world: number;
    interior: number;
    skin: number;
    drugs: number;
    mats: number;
    can: number;
    ganzuas: number;
}