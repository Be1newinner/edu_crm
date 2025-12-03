import z from "zod";

export const roleInputSchema=z.object({
    name:z.string().min(3).max(100),
    instituteId:z.string().min(24).max(24),
    permissions:z.enum(["ACADEMIC","USER"])
})
export const roleParamsSchema=z.object({
    id:z.string().min(24).max(24)
})