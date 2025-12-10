import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { createCourse, deleteCourse, getAllBatchByCourseId, getAllCourses, getCourseBYId, updateCourse } from "./course.controller";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { CourseParamsZodSchema, CourseQueryZodSchema, CourseZodSchema } from "./course.dto";
import IsAdminMiddleware from "../../shared/middlewares/isAdmin.middleware";
import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";
import { Router } from "express";

export const courseRouter:Router = Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management APIs
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit per page
 *     responses:
 *       200:
 *         description: Successfully fetched courses
 *       500:
 *         description: Failed to fetch courses
 */

courseRouter.get("/", requestValidateRequest({ query: CourseQueryZodSchema }), catchAsyncMiddleware(getAllCourses, {
    message: "failed to fetch cources"
}));
/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course fetched successfully
 *       404:
 *         description: Course not found
 */


courseRouter.get("/:id", requestValidateRequest({ params: CourseParamsZodSchema }),
    catchAsyncMiddleware(getCourseBYId, {
        message: "failed to fetch"
    }));

/**
 * @swagger
 * /courses/{id}/batches:
 *   get:
 *     summary: Get all batches under a specific course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Batch list fetched successfully
 *       404:
 *         description: Course not found
 */

courseRouter.get("/:id/batches", requestValidateRequest({ params: CourseParamsZodSchema }),
    catchAsyncMiddleware(getAllBatchByCourseId, {
        message: "failed to fetch batch"
    }));

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Full Stack Development"
 *               duration: "6 months"
 *               price: 9999
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to create course
 */


courseRouter.post("/", VerifyAccessTokenMiddleWare, IsAdminMiddleware, requestValidateRequest({ body: CourseZodSchema }),
    catchAsyncMiddleware(createCourse, {
        message: "failed to Create"
    }));

/**
 * @swagger
 * /courses/{id}:
 *   patch:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Updated Course Name"
 *               duration: "8 months"
 *               price: 10999
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 */

courseRouter.patch("/:id", requestValidateRequest({ params: CourseParamsZodSchema, body: CourseZodSchema }),
    catchAsyncMiddleware(updateCourse, {
        message: "failed to update"
    }));
/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
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
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */

courseRouter.delete("/:id", VerifyAccessTokenMiddleWare, IsAdminMiddleware, requestValidateRequest({ params: CourseParamsZodSchema }),
    catchAsyncMiddleware(deleteCourse, {
        message: "failed to delete"
    }));

