import { Router } from "express";

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phone
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Khushbu"
 *         lastName:
 *           type: string
 *           example: "Kumari"
 *         email:
 *           type: string
 *           example: "khushbu@gmail.com"
 *         phone:
 *           type: string
 *           example: "9876543210"
 *         batches:
 *           type: array
 *           items:
 *             type: string
 *           example: ["67333ab12eaa236abde445d2"]
 */

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Creating student failed
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get list of all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of students fetched successfully
 *       500:
 *         description: Failed to fetch students
 */

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student fetched successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Failed to fetch student
 */

/**
 * @swagger
 * /students/{id}:
 *   patch:
 *     summary: Update a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: string
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Failed to update student
 */

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Failed to delete student
 */

/**
 * @swagger
 * /students/{id}/batches:
 *   post:
 *     summary: Add batch(es) to a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               batches: ["67333ab12eaa236abde445d2", "67333ab12eaa236abde445f1"]
 *     responses:
 *       200:
 *         description: Batches assigned to student
 *       404:
 *         description: Student not found
 *       500:
 *         description: Add student batches failed
 */

/**
 * @swagger
 * /students/{id}/batches/{batchId}:
 *   delete:
 *     summary: Remove a batch from a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Student ID
 *       - in: path
 *         name: batchId
 *         schema:
 *           type: string
 *         required: true
 *         description: Batch ID
 *     responses:
 *       200:
 *         description: Batch removed from student
 *       404:
 *         description: Student or batch not found
 *       500:
 *         description: Failed to remove batch
 */

import * as StudentController from "./students.controller";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import {
  studentParamValidation,
  studentSchemaValidation,
} from "./students.dto";

export const StudentRouter: Router = Router();

StudentRouter.post(
  "/",
  requestValidateRequest({ body: studentSchemaValidation }),
  catchAsyncMiddleware(StudentController.createStudent, {
    message: "Creating student failed!",
    status: 500,
  })
);

StudentRouter.get(
  "/",
  catchAsyncMiddleware(StudentController.FetchStudentList, {
    message: "All student fetch failed!",
    status: 500,
  })
);

StudentRouter.get(
  "/:id",
  requestValidateRequest({ params: studentParamValidation }),
  catchAsyncMiddleware(StudentController.FetchStudentById, {
    message: "Single student fetch failed!",
    status: 500,
  })
);

StudentRouter.patch(
  "/:id",
  requestValidateRequest({
    params: studentParamValidation,
    body: studentSchemaValidation,
  }),
  catchAsyncMiddleware(StudentController.UpdateStudentById, {
    message: "Update student fetch failed!",
    status: 500,
  })
);

StudentRouter.delete(
  "/:id",
  requestValidateRequest({ params: studentParamValidation }),
  catchAsyncMiddleware(StudentController.DeleteStudentById, {
    message: "delete student fetch failed!",
    status: 500,
  })
);

StudentRouter.post(
  "/:id/batches",
  requestValidateRequest({
    params: studentParamValidation,
    body: studentSchemaValidation,
  }),
  catchAsyncMiddleware(StudentController.AddBatchesToStudent, {
    message: "Add student batches failed!",
    status: 500,
  })
);

StudentRouter.delete(
  "/:id/batches/:batchId",
  requestValidateRequest({ params: studentParamValidation }),
  catchAsyncMiddleware(StudentController.RemoveBatch, {
    message: "Delete student batches failed!",
    status: 500,
  })
);
