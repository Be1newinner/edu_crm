import z from "zod";
export const feeTemplateZodInputSchema = z.object({
    instituteId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid institute Id"),
    name: z.string().min(3).max(50),
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course Id"),
    batchId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid batch Id"),
    components: z.array(
        z.object({
            name: z.string().min(1, "is required"),
            amount: z.number(),
            dueDate: z.coerce.date()
        })),
    totalAmount: z.number().int().nonnegative(),
    isActive: z.boolean().optional(),
    createdAt: z.coerce.date().optional()
})