import { z } from "zod";
import { z_max, z_max_num, z_min, z_min_num } from "../../shared/zodError";
import { GENDER } from "../users/user.interface";

// Raw Zod Schemas

const email = z
  .email("Invalid Email Format!")
  .max(...z_max(30));

const password = z
  .string()
  .min(...z_min(6))
  .max(...z_max(12));

const phone = z
  .string()
  .min(...z_min_num(10))
  .max(...z_max_num(13))
  .optional();

const jwtRegex = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;

const JwtAccessToken = z
  .string()
  .regex(jwtRegex, "Invalid JWT format");

const isoDateString = z.date();
const optionalDateString = isoDateString.nullable()

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const userStatus = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);
const statusEnum = z.enum(["success", "error"]);
const statusCode = z.number().int().min(100).max(599);

const optionalMeta = z.undefined().optional();

// Zod Request Schemas

const loginUserZodSchema = z.object({ email, password });

const resetPasswordZodSchema = z.object({ email, password });

const forgotPasswordZodSchema = z.object({
  email,
});

const OAuthCodeZodSchema = z.object({
  code: z.string(),
});

const verifyForgotPasswordZodSchema = z.object({
  email,
  otp: z.string().length(6),
  newPassword: password,
});

const registerUserZodSchema = z.object({
  email,
  password,
  name: z
    .string()
    .min(...z_min(3))
    .max(...z_max(12)),
  instituteId:z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid InstitueID"),
  createdAt:z.coerce.date().optional(),
  updatedAt:z.coerce.date().optional(),
  refreshToken:z.string().optional()
});


// RESPONSE SCHEMAS

const userData = z
  .object({
    _id: objectId,
    failedLoginAttempts: z.number().int().min(0),
    lockoutUntil: optionalDateString,
    status: userStatus,
    lastLoginAt: optionalDateString.optional(),
    accessToken: JwtAccessToken.optional(),
  })
  .strip()

const baseResponse = {
  status_code: statusCode,
  message: z.string(),
  status: statusEnum,
  application_code: statusCode,
};

const login = z.object({
  data: userData,
  meta: optionalMeta,
}).extend(baseResponse).strip()

const registration = z
  .object({
    data: userData,
    meta: optionalMeta,
  }).extend(baseResponse).strip();

const refreshToken = z.object({
  data: z.object({
    accessToken: JwtAccessToken,
  }),
  meta: optionalMeta,
}).extend(baseResponse).strip();


const AuthValidations = {
  registerUserZodSchema,
  loginUserZodSchema,
  resetPasswordZodSchema,
  forgotPasswordZodSchema,
  verifyForgotPasswordZodSchema,
  OAuthCodeZodSchema
};

const AuthResponseValidations = {
  login,
  registration,
  refreshToken
}

export default AuthValidations;

export { AuthResponseValidations }