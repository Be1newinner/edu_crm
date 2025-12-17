import { Types } from "mongoose";

export enum ROLE {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  STAFF = "STAFF",
  ADMIN="ADMIN"
}

export const ROLE_ARRAY = ["STUDENT", "TEACHER", "STAFF","ADMIN"]

export interface IUserStoredDocument {
    name?: string;
    email: string;
    password?: string;
    role?: ROLE;
    refreshToken?:string,
    instituteId?:Types.ObjectId;
    createdAt?:Date|string;
    updatedAt?:Date|string;
}

