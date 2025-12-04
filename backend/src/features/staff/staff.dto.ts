import z from "zod";

export const staffZodSchema = z.object({
    instituteId: z.string().regex(/^[0-9a-f]{24}$/, "Invalid Institute  ID"),
    userId: z.string().regex(/^[0-9a-f]{24}$/, "Invalid User ID"),
    employeeId: z.string().min(3,"Min 3 character employee Id").max(20,"Max 20 character is required employee Id"),
    department:z.string(),
    qualification: z.string(),
    dateOfJoining: z.coerce.date(),
    salaryGrade:z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional()
})

export const staffParamsZod=z.object({
    id:z.string().regex(/^[0-9a-f]{24}$/, "Invalid Staff ID"),
})