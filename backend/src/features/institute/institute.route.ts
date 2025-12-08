import { Router } from "express";
import { createInstitute, DeleteInstitute, fetchAllInstitute, updateInstitute } from "./institute.controller";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { instituteParamsZodSchema, instituteZodSchema } from "./institute.dto";
import IsAdminMiddleware from "../../shared/middlewares/isAdmin.middleware";
import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";

export const instituteRouter: Router = Router();

/**
 * @swagger
 * /institute:
 *   get:
 *     summary: Fetch all institutes
 *     tags: [Institute]
 *     responses:
 *       200:
 *         description: List of all institutes
 *       500:
 *         description: Fetch failed
 */
instituteRouter.get(
  "/",
  catchAsyncMiddleware(fetchAllInstitute, { message: "fetch failed" })
);

/**
 * @swagger
 * /institute:
 *   post:
 *     summary: Create a new institute
 *     tags: [Institute]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Institute"
 *     responses:
 *       201:
 *         description: Institute created successfully
 *       400:
 *         description: Invalid request body
 */
instituteRouter.post(
  "/",
  requestValidateRequest({ body: instituteZodSchema }),
  catchAsyncMiddleware(createInstitute, { message: "Creation failed" })
);

/**
 * @swagger
 * /institute/{id}:
 *   delete:
 *     summary: Delete an institute
 *     tags: [Institute]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Institute deleted
 *       404:
 *         description: Institute not found
 */
instituteRouter.delete(
  "/:id",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  requestValidateRequest({ params: instituteParamsZodSchema }),
  catchAsyncMiddleware(DeleteInstitute, { message: "Delete failed" })
);

/**
 * @swagger
 * /institute:
 *   patch:
 *     summary: Update an institute
 *     tags: [Institute]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Institute"
 *     responses:
 *       200:
 *         description: Institute updated
 *       400:
 *         description: Invalid request body
 */
instituteRouter.patch(
  "/",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  requestValidateRequest({ body: instituteZodSchema }),
  catchAsyncMiddleware(updateInstitute, { message: "Updation failed" })
);
