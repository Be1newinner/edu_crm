import { Request, Response } from "express";
import { SendResponse } from "../../shared/utils/JsonResponse";
import * as UserService from "./user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserService.getAllUsersService();

  SendResponse(res, {
    status_code: 200,
    message: "Users fetched successfully!",
    data: users,
  });
};

export const getAllUsersController = getAllUsers;

export const getAllRolesController = async (_req: Request, res: Response) => {
  const roles = await UserService.getAllRolesService();
  SendResponse(res, {
    message: "All user roles fetched successfully",
    status_code: 200,
    data: roles,
  });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserService.getUserByIdService(id);

  SendResponse(res, {
    message: "User profile fetched successfully",
    status_code: 200,
    data: user,
  });
};

export const getUserByIdController = getUserById;

export const getProfile = async (req: Request, res: Response) => {
  const me = await UserService.getUserByIdService(req.user!.uid);

  SendResponse(res, {
    message: "Your profile data",
    status_code: 200,
    data: me,
  });
};

export const getMeController = getProfile;

export const updateUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedUser = await UserService.updateUserByIdService(id, updateData);

  SendResponse(res, {
    message: "User updated successfully",
    status_code: 200,
    data: updatedUser,
  });
};

export const deleteUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  await UserService.deleteUserByIdService(id);

  SendResponse(res, {
    message: "User deleted successfully",
    status_code: 200,
  });
};


export const updateProfile = async (req: Request, res: Response) => {
  const updateData = req.body;

  const updatedUser = await UserService.updateOwnProfileService(
    req.user!.uid,
    updateData
  );

  SendResponse(res, {
    status_code: 200,
    message: "Profile updated successfully",
    data: updatedUser,
  });
};

export const updateOwnProfileController = updateProfile;

