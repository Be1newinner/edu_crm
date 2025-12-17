import { Router } from "express";
import * as UsersController from "./user.controller";
import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";
import IsAdminOrSelfMiddleware from "../../shared/middlewares/isAdminOrSelf.middleware";
import IsAdminMiddleware from "../../shared/middlewares/isAdmin.middleware";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import {
  userParamValidation,
  updateUserProfileSchema,
} from "./user.dto";

export const UsersRouter: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 */
UsersRouter.get(
  "/me",
  VerifyAccessTokenMiddleWare,
  catchAsyncMiddleware(UsersController.getProfile, {
    message: "Profile fetch failed!",
    status: 500,
  })
);

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserProfile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
UsersRouter.patch(
  "/profile",
  VerifyAccessTokenMiddleWare,
  requestValidateRequest({ body: updateUserProfileSchema }),
  catchAsyncMiddleware(UsersController.updateProfile, {
    message: "Profile update failed!",
    status: 500,
  })
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
UsersRouter.get(
  "/",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  catchAsyncMiddleware(UsersController.getAllUsers, {
    message: "Users fetch failed!",
    status: 500,
  })
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (Admin or Self)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
UsersRouter.get(
  "/:id",
  VerifyAccessTokenMiddleWare,
  IsAdminOrSelfMiddleware,
  requestValidateRequest({ params: userParamValidation }),
  catchAsyncMiddleware(UsersController.getUserById, {
    message: "User fetch failed!",
    status: 500,
  })
);
