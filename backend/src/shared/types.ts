import "express";
import { ROLE } from "../features/users/user.interface";

declare module "express" {
    export interface Request {
        user?: User;
    }
}

export interface User {
    email: string;
    role: ROLE;
    uid: string;
}
