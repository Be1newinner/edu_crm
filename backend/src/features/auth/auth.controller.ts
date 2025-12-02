import { Request, Response } from "express";
import { SendResponse } from "../../shared/utils/JsonResponse";
import * as AuthService from "./auth.service";
import AppError from "../../shared/utils/AppError";
import { ENV_CONFIGS } from "../../shared/config/envs.config";
import { OAuthCodeZodType } from "./auth.interface";
import { AuthResponseValidations } from "./auth.dto";

export const registerController = async (req: Request, res: Response) => {
  const user = await AuthService.registerUser(req.body);

  SendResponse(res, {
    status_code: 201,
    message: "Registration successful",
    data: user,
  },
    AuthResponseValidations.registration
  );
};

export async function logoutController(req: Request, res: Response) {
  const token = req.cookies;
  console.log("1")
  if (token?.refreshToken)
    await AuthService.logoutService(token?.refreshToken);

  console.log("2")
  res.cookie("refreshToken", "", {
    maxAge: -10
  }).cookie("accessToken", "", {
    maxAge: -10
  }).status(204).end();
}

export async function verifyOtpController(req: Request, res: Response) {
  const { userId, otp, type } = req.body;

  if (!userId || !otp || !type) {
    throw new AppError("Missing required fields", 400);
  }

  const result = await AuthService.verifyOtpService(userId, otp, type);

  SendResponse(res, {
    status_code: 200,
    message: "OTP verified successfully",
    data: result,
  }
  );
}

export const loginController = async (req: Request, res: Response) => {
  const authResponse = await AuthService.loginUser(req.body);
  res.cookie("refreshToken", authResponse.tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: Number(process.env.JWT_REFRESH_EXPIRY) || 20 * 24 * 60 * 60_000
  });
  res.cookie("accessToken", authResponse.tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: Number(process.env.JWT_SHORT_EXPIRY) || 60 * 60_000
  });
  SendResponse(res, {
    status_code: 200,
    message: "Login successful",
    data: {
      ...authResponse.user,
      accessToken: authResponse.tokens.accessToken,
    },
  },
    AuthResponseValidations.login
  );
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const oldToken = req.cookies["refreshToken"];

  if (!oldToken) throw new AppError("Missing refresh token", 401);

  const tokens = await AuthService.handleRefreshToken(oldToken);

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: Number(process.env.JWT_SHORT_EXPIRY) || 60 * 60_000
  });

  SendResponse(res, {
    status_code: 200,
    message: "Token refreshed",
    data: { accessToken: tokens.accessToken },
  },
    AuthResponseValidations.refreshToken
  );
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const result = await AuthService.forgotPasswordService(req.body);
  SendResponse(res, {
    status_code: 200,
    message: "OTP sent successfully",
    data: result
  });
};

export const verifyForgotPasswordController = async (
  req: Request,
  res: Response
) => {
  const result = await AuthService.verifyForgotPasswordService(req.body);
  SendResponse(res, {
    status_code: 200,
    message: "Password reset successful",
    data: result
  });
};

export async function initiateGoogleLogin(_: Request, res: Response) {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${ENV_CONFIGS.GOOGLE_CLIENT_ID}&redirect_uri=${ENV_CONFIGS.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
}

export async function googleLoginCallback(req: Request, res: Response) {
  const query = req.query as OAuthCodeZodType;
  const cb = await AuthService.googleLoginCallbackService(query);
  const data = cb?.data;
  const refreshToken = cb?.refreshToken;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  SendResponse(res, {
    status_code: 200,
    message: "Login successful",
    data,
  });
}

export async function initiateFacebookLogin(_: Request, res: Response) {
  const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${ENV_CONFIGS.FACEBOOK_CLIENT_ID}&redirect_uri=${ENV_CONFIGS.FACEBOOK_REDIRECT_URI}&scope=email`;

  res.redirect(url);
}

export async function facebookLoginCallback(req: Request, res: Response) {
  await AuthService.facebookLoginCallbackService(req.query as OAuthCodeZodType);

  SendResponse(res, {
    status_code: 200,
    message: "Login successful",
  });
}
