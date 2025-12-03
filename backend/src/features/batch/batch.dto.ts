import z from "zod"

export const batchZodSchema=z.object({
    instituteId:z.string().length(24),
    name:z.string().min(3).max(20),
    maxCapacity:z.number().int().positive(),
    description:z.string().optional(),
    currentEnrollment:z.number().int().nonnegative(),
    courseId:z.string().length(24),
    createdAt:z.coerce.date(),
    updatedAt:z.coerce.date()
})

export const batchParamZodSchema=z.object({
    id:z.string().length(24)
})