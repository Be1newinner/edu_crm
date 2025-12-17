import { Request, Response } from "express";
import { SendResponse } from "../../shared/utils/JsonResponse";
import * as AuthService from "./auth.service";
import AppError from "../../shared/utils/AppError";
import { AuthResponseValidations } from "./auth.dto";

export const registerController = async (req: Request, res: Response) => {
  const user = await AuthService.registerUser(req.body);

  SendResponse(res, {
    status_code: 201,
    message: "Registration successful",
    data: user,
  },
    // AuthResponseValidations.registration
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
    // AuthResponseValidations.login
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
