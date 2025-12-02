import z from "zod"
import { instituteParamsZodSchema, instituteZodSchema } from "./institute.dto"

export interface IInstituteDocument {
    name: string,
    emailDomain: string,
    createdAt?: Date | string,
    updatedAt?: Date | string
}

export type InstituteInputZodType=z.infer<typeof instituteZodSchema>
export type InstituteDeleteZodType=z.infer<typeof instituteParamsZodSchema>