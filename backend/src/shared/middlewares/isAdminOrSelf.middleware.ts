import { ROLE } from "../../features/users/user.interface";
import AppError from "../../shared/utils/AppError";
import { NextFunction, Request, Response } from "express";

export default function IsSelfOrAdminMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const user = req.user;
  const userIdParam = req.params.id;

  if (!user) throw new AppError("Unauthorized: User not found in request", 401);

  const isAdmin = user.role === ROLE.ADMIN;
  const isSelf = user.uid === userIdParam;

  if (!isAdmin && !isSelf) {
    throw new AppError(
      "Access denied: You must be an admin or the owner of this resource.",
      401
    );
  }

  next();
}
