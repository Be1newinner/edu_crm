import mongoose from "mongoose";
import z from "zod";
import { roleInputSchema, roleParamsSchema } from "./role.dto";

export enum IPermission{
    USER="USER",
    ACADEMIC="ACADEMIC"
}
export interface IRole{
    name?:string,
    permissions?:IPermission[],
    instituteId?:mongoose.Types.ObjectId
}

export type roleInputZodType=z.infer<typeof roleInputSchema>
export type roleParamsZodType=z.infer<typeof roleParamsSchema>
