import { z } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserProfile:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         avatar:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *       example:
 *         name: "John Doe"
 *         phone: "9876543210"
 *         avatar: "https://example.com/avatar.jpg"
 *         dateOfBirth: "1990-01-01"
 *         gender: "MALE"
 */

export const userParamValidation = z.object({
  id: z.string().min(24).max(24), // MongoDB ObjectId validation
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().min(10).max(15).optional(),
  instituteId: z.string(),
  role: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});
