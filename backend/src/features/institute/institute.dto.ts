import z from "zod";

export const instituteZodSchema=z.object({
    name:z.string().min(3).max(12),
    emailDomain:z.email("Invalid Email Format!"),
    createdAt:z.date(),
    updatedAt:z.date()
})
  
export const instituteParamsZodSchema=z.object({
   id:z.string().min(24).max(24)})
  
