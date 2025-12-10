import { Router } from "express";

import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { AttendanceZodInputSchema } from "./attendance.dto";
import {
  createBulkAttendance,
  createSession,
  fetchListSession,
  getAttendanceDetailsBYBatchID,
  getAttendanceDetailsBYStudentId,
} from "./attendance.controller";

export const attendanceRouter: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management APIs
 */

/**
 * @swagger
 * /attendance/sessions:
 *   post:
 *     summary: Create a new attendance session
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               batchId: "67333ab12eaa236abde445d2"
 *               date: "2025-01-10"
 *               subject: "Math"
 *     responses:
 *       201:
 *         description: Session created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to create session
 */




attendanceRouter.post(
  "/sessions",
  requestValidateRequest({ body: AttendanceZodInputSchema }),
  catchAsyncMiddleware(createSession, {
    message: "failed to create",
    status: 500,
  })
);
/**
 * @swagger
 * /attendance/sessions/{id}/mark:
 *   post:
 *     summary: Mark attendance for students in a session
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               students:
 *                 - studentId: "67333ab12eaa236abde445d2"
 *                   present: true
 *                 - studentId: "67333ab12eaa236abde445d3"
 *                   present: false
 *     responses:
 *       200:
 *         description: Attendance marked successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to mark attendance
 */


attendanceRouter.post(
  "/sessions/:id/mark",
  requestValidateRequest({ body: AttendanceZodInputSchema }),
  catchAsyncMiddleware(createBulkAttendance, {
    message: "failed to create",
    status: 500,
  })
);
/**
 * @swagger
 * /attendance/sessions:
 *   get:
 *     summary: Fetch list of attendance sessions
 *     tags: [Attendance]
 *     responses:
 *       200:
 *         description: Sessions fetched successfully
 *       500:
 *         description: Failed to fetch sessions
 */


attendanceRouter.get(
  "/sessions",
  catchAsyncMiddleware(fetchListSession, {
    message: "failed to fetch",
    status: 500,
  })
);
/**
 * @swagger
 * /attendance/students/{id}/attendance:
 *   get:
 *     summary: Get attendance records of a student
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student attendance fetched successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Failed to fetch attendance
 */


attendanceRouter.get(
  "/students/:id/attendance",
  catchAsyncMiddleware(getAttendanceDetailsBYStudentId, {
    message: "failed to fetch",
    status: 500,
  })
);

/**
 * @swagger
 * /attendance/batches/{id}/attendance:
 *   get:
 *     summary: Get batch-wise attendance details
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: string
 *         description: Batch ID
 *     responses:
 *       200:
 *         description: Batch attendance fetched successfully
 *       404:
 *         description: Batch not found
 *       500:
 *         description: Failed to fetch attendance
 */


attendanceRouter.get(
  "/batches/:id/attendance",
  catchAsyncMiddleware(getAttendanceDetailsBYBatchID, {
    message: "failed to fetch",
    status: 500,
  })
);
