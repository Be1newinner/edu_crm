import { Router } from "express";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import {
  batchParamZodSchema,
  batchQueryZodSchema,
  batchZodSchema,
} from "./batch.dto";
import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";
import IsAdminMiddleware from "../../shared/middlewares/isAdmin.middleware";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import {
  createBatch,
  deleteBatch,
  getAllBatches,
  getBatchByID,
  getStudentsByBatch,
  updateBatch,
} from "./batch.controller";

export const batchRouter:Router = Router();

/**
 * @swagger
 * tags:
 *   name: Batch
 *   description: Batch Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Batch:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Batch A"
 *         year:
 *           type: number
 *           example: 2025
 *         description:
 *           type: string
 *           example: "Batch for Computer Science students"
 *       required:
 *         - name
 *         - year
 *
 *     BatchQuery:
 *       type: object
 *       properties:
 *         page:
 *           type: number
 *           example: 1
 *         limit:
 *           type: number
 *           example: 10
 *         search:
 *           type: string
 *           example: "Batch A"
 */

/**
 * @swagger
 * /batch:
 *   get:
 *     summary: Get all batches
 *     tags: [Batch]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Pagination page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of results per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of all batches
 *       500:
 *         description: All batch fetch failed
 */
batchRouter.get(
  "/",
  requestValidateRequest({ query: batchQueryZodSchema }),
  catchAsyncMiddleware(getAllBatches, {
    message: "all batch fetch failed",
    status: 500,
  })
);

/**
 * @swagger
 * /batch:
 *   post:
 *     summary: Create a new batch
 *     tags: [Batch]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Batch'
 *     responses:
 *       201:
 *         description: Batch created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Batch creation failed
 */
batchRouter.post(
  "/",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  requestValidateRequest({ body: batchZodSchema }),
  catchAsyncMiddleware(createBatch, {
    message: "batch creation failed",
    status: 500,
  })
);

/**
 * @swagger
 * /batch/{id}:
 *   patch:
 *     summary: Update a batch
 *     tags: [Batch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Batch ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Batch'
 *     responses:
 *       200:
 *         description: Batch updated successfully
 *       404:
 *         description: Batch not found
 *       500:
 *         description: Batch update failed
 */
batchRouter.patch(
  "/:id",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  requestValidateRequest({ body: batchZodSchema, params: batchParamZodSchema }),
  catchAsyncMiddleware(updateBatch, {
    message: "batch update failed",
    status: 500,
  })
);

/**
 * @swagger
 * /batch/{id}:
 *   delete:
 *     summary: Delete a batch
 *     tags: [Batch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Batch ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Batch deleted successfully
 *       404:
 *         description: Batch not found
 *       500:
 *         description: Batch delete failed
 */
batchRouter.delete(
  "/:id",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  requestValidateRequest({ params: batchParamZodSchema }),
  catchAsyncMiddleware(deleteBatch, {
    message: "batch delete failed",
    status: 500,
  })
);

/**
 * @swagger
 * /batch/{id}:
 *   get:
 *     summary: Get a batch by ID
 *     tags: [Batch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *     responses:
 *       200:
 *         description: Batch details fetched
 *       404:
 *         description: Batch not found
 *       500:
 *         description: Batch fetch failed
 */
batchRouter.get(
  "/:id",
  requestValidateRequest({ params: batchParamZodSchema }),
  catchAsyncMiddleware(getBatchByID, {
    message: "batch fetch failed",
    status: 500,
  })
);

/**
 * @swagger
 * /batch/{id}/students:
 *   get:
 *     summary: Get all students in a batch
 *     tags: [Batch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *     responses:
 *       200:
 *         description: Students list fetched
 *       404:
 *         description: Batch not found
 *       500:
 *         description: Student fetch failed
 */
batchRouter.get(
  "/:id/students",
  requestValidateRequest({ params: batchParamZodSchema }),
  catchAsyncMiddleware(getStudentsByBatch, {
    message: "student fetch failed",
    status: 500,
  })
);
