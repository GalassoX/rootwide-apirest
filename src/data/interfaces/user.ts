export interface IUser {
    id: number | 0;
    username: string;
    password: string;
    token: string;
    email: string;
    samp_id: number;
}

export interface IUserFixed {
    id: number | 0;
    username: string;
    token: string;
    email: string;
    samp_id: number;
}
