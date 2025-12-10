import z from "zod";
import { GENDER_ARRAY, STUDENT_STATUS_ARRAY } from "./students.interface";

export const studentParamValidation = z.object({
    id: z.string().min(24).max(24)
});

export const studentSchemaValidation = z.object({
  instituteId: z.string().min(24).max(24),
  userId: z.string().min(24).max(24),
  rollNumber: z.string().min(24).max(24),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(GENDER_ARRAY),
  address: z.string().min(10).max(200),
  phone: z.number().min(10).max(10),
  guardianName: z.string().optional(),
  guardianPhone: z.number().min(10).max(10).optional(),
  batchIds: z.array(z.string()),
  individualStudy: z.boolean(),
  status: z.enum(STUDENT_STATUS_ARRAY),
});
