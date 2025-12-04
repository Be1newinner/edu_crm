import z from "zod";

export const CourseZodSchema =z.object({
  instituteId:z.string().length(24),
  name:z.string().min(3,"Min 3 character is required").max(50, "Max 50 character is required"),
  code:z.string().min(1,"code is required"),
  durationMonths: z.number().positive(),
  credits:z.number().positive(),
  feeAmount: z.number().int().nonnegative(),
  description: z.string().optional(),
  prerequisites:z.array(z.string()).default([]),
  createdAt:z.coerce.date().optional(),
  updatedAt:z.coerce.date().optional()
});

export const CourseParamsZodSchema=z.object({
  id:z.string().regex(/^[0-9a-f]{24}$/,"Invalid object Id")
})