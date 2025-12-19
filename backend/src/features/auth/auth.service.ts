import * as AuthInterface from "./auth.interface";
import { OTPValidationModel } from "./otp.model";
import { verifyHash } from "./auth.utils";
import {
  generateLoginTokens,
  decodeToken,
} from "../../shared/utils/auth.tokens";
import AppError from "../../shared/utils/AppError";
import { UsersAPI } from "../users/user.api";
import { createAuthRepository } from "./auth.repository";
import { toIdString } from "../../shared/utils/mongooseConverters";

const authRepo = createAuthRepository(OTPValidationModel);

export const registerUser = async (
  payload: AuthInterface.RegisterUserInputZodType
) => {
  const savedUser = await UsersAPI.create(payload);
  const safeUser: Omit<AuthInterface.IUserPublic, "password"> | null =
    savedUser.toObject();
  if (safeUser && "password" in safeUser) delete safeUser.password;
  return { ...safeUser, _id: toIdString(savedUser._id) };
};

export const loginUser = async (
  payload: AuthInterface.LoginUserInputZodType
) => {
  const userDoc = await UsersAPI.findByEmailWithPassword(payload.email);
  if (!userDoc) throw new AppError("Invalid email or password", 401);
  const isValid = await verifyHash(payload.password, userDoc.password);
  if (!isValid) {
    // await UsersAPI.incrementFailedLogin(String(userDoc._id));
    throw new AppError("Invalid email or password", 401);
  }
  const tokens = await generateLoginTokens({
    email: payload.email,
    uid: String(userDoc._id),
    role: userDoc.role
  });
  if (Array.isArray(userDoc.refreshToken)) {
    if (userDoc.refreshToken.length >= 4) userDoc.refreshToken.splice(-3);
    userDoc.refreshToken.push(tokens.refreshToken);
  } else {
    userDoc.refreshToken = [tokens.refreshToken];
  }
  await userDoc.save();

  // await UsersAPI.setLastLogin(String(userDoc._id));

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password: _password,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refreshToken: _refreshToken,
    _id,
    ...userWithoutPassword
  } = userDoc.toObject();
  return { tokens, user: { ...userWithoutPassword, _id: toIdString(_id) } };
};

// Refresh token handler
export const handleRefreshToken = async (oldToken: string) => {
  const decoded = await decodeToken(oldToken);
  const { uid } = decoded?.data || {};

  if (!uid) throw new AppError("Unauthorized", 403);

  const userDoc = await UsersAPI.findByRefreshToken(oldToken);
  if (!userDoc) throw new AppError("Unauthorized", 403);

  const tokens = await generateLoginTokens({
    email: userDoc.email,
    uid: String(userDoc._id),
    role: userDoc.role
  });

  userDoc.refreshToken = userDoc.refreshToken.filter(
    (e: string) => e !== oldToken
  );
  userDoc.refreshToken.push(tokens.refreshToken);
  await userDoc.save();

  return tokens;
};

export async function logoutService(refreshToken: string) {
  const { data } = await decodeToken(refreshToken);
  authRepo.findByIdAndUpdate(data.uid, {
    refreshToken: { $pull: refreshToken }
  });
}