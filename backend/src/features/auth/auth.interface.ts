// auth.ts
import { z } from "zod";
import AuthValidations from "./auth.dto";
import { ROLE } from "../users/user.interface";
import { Types } from "mongoose";


// Auth-only enums (login provider, role) and auth response types

export enum LOGIN_PROVIDER {
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  EMAIL = "EMAIL",
}

// Public user view for auth responses (no sensitive fields)
export interface IUserPublic {
  // from user base
  name?: string;
  email: string;
  instituteId?:Types.ObjectId;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  // roles attached for authorization
  role?: ROLE;
}

// Authentication response payload
export interface ILoginResponse extends IUserPublic {
  accessToken: string;
  _id?: string;
}

// Zod request types (auth API contracts)
export type ForgotPasswordInputZodType = z.infer<
  typeof AuthValidations.forgotPasswordZodSchema
>;
export type VerifyForgotPasswordInputZodType = z.infer<
  typeof AuthValidations.verifyForgotPasswordZodSchema
>;
export type RegisterUserInputZodType = z.infer<
  typeof AuthValidations.registerUserZodSchema
>;
export type LoginUserInputZodType = z.infer<
  typeof AuthValidations.loginUserZodSchema
>;
export type ResetPasswordInputZodType = z.infer<
  typeof AuthValidations.resetPasswordZodSchema
>;
export type OAuthCodeZodType = z.infer<
  typeof AuthValidations.OAuthCodeZodSchema
>;
