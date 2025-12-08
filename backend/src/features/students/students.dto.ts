import z from "zod";
import { GENDER_ARRAY, STUDENT_STATUS_ARRAY } from "./students.interface";

export const studentParamValidation = z.object({
  id: z.string(),
  //   id: z.string().min(24).max(24), // MongoDB ObjectId validation
});

export const studentSchemaValidation = z.object({
  instituteId: z.string(),
  userId: z.string(),
  rollNumber: z.string(),
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
