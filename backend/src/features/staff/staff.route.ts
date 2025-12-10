import { Router } from "express";

import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { createStaff, deleteStaff, getAllStaff, getStaffById, updateStaff } from "./staff.controller";
import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";
import IsAdminMiddleware from "../../shared/middlewares/isAdmin.middleware";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { staffParamsZod, staffQueryZod, staffZodSchema } from "./staff.dto";

export const staffRouter:Router = Router();

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff management APIs
 */

/**
 * @swagger
 * /staff:
 *   get:
 *     summary: Get all staff members
 *     tags: [Staff]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All staff fetched successfully
 *       500:
 *         description: Failed to fetch staff
 */

staffRouter.get(
  "/",
  requestValidateRequest({ query: staffQueryZod }),
  catchAsyncMiddleware(getAllStaff, { message: "fetch All staff failed", status: 500 })
);

/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     summary: Get staff by ID
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *     responses:
 *       200:
 *         description: Staff fetched successfully
 *       404:
 *         description: Staff not found
 */

staffRouter.get(
  "/:id",
  requestValidateRequest({ params: staffParamsZod }),
  catchAsyncMiddleware(getStaffById, { message: "fetch to failed staff", status: 500 })
);

/**
 * @swagger
 * /staff:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "John Doe"
 *               email: "john@example.com"
 *               phone: "9876543210"
 *               role: "teacher"
 *               joiningDate: "2024-01-01"
 *     responses:
 *       201:
 *         description: Staff created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to create staff
 */

staffRouter.post(
  "/",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  requestValidateRequest({ body: staffZodSchema }),
  catchAsyncMiddleware(createStaff, { message: "failed to create staff", status: 500 })
);

/**
 * @swagger
 * /staff/{id}:
 *   patch:
 *     summary: Update staff details
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Updated Staff Name"
 *               phone: "9876543211"
 *     responses:
 *       200:
 *         description: Staff updated successfully
 *       404:
 *         description: Staff not found
 */
staffRouter.patch(
  "/:id",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  requestValidateRequest({ params: staffParamsZod, body: staffZodSchema }),
  catchAsyncMiddleware(updateStaff, { message: "failed to update staff", status: 500 })
);
/**
 * @swagger
 * /staff/{id}:
 *   delete:
 *     summary: Delete staff by ID
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *     responses:
 *       200:
 *         description: Staff deleted successfully
 *       404:
 *         description: Staff not found
 */
staffRouter.delete(
  "/:id",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  requestValidateRequest({ params: staffParamsZod }),
  catchAsyncMiddleware(deleteStaff, { message: "failed to delete staff", status: 500 })
);
