import { Router } from "express";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { createCourse, deleteCourse, getAllBatchByCourseId, getAllCourses, getCourseBYId, updateCourse } from "./course.controller";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { CourseParamsZodSchema, CourseQueryZodSchema, CourseZodSchema } from "./course.dto";
import IsAdminMiddleware from "../../shared/middlewares/isAdmin.middleware";
import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";
export const courseRouter = Router()
courseRouter.get("/", requestValidateRequest({ query: CourseQueryZodSchema }), catchAsyncMiddleware(getAllCourses, {
    message: "failed to fetch cources"
}))
courseRouter.get("/:id", requestValidateRequest({ params: CourseParamsZodSchema }),
    catchAsyncMiddleware(getCourseBYId, {
        message: "failed to fetch"
    }))
courseRouter.get("/:id/batches", requestValidateRequest({ params: CourseParamsZodSchema }),
    catchAsyncMiddleware(getAllBatchByCourseId, {
        message: "failed to fetch batch"
    }))
courseRouter.post("/", VerifyAccessTokenMiddleWare, IsAdminMiddleware, requestValidateRequest({ body: CourseZodSchema }),
    catchAsyncMiddleware(createCourse, {
        message: "failed to Create"
    }))
courseRouter.patch("/:id", requestValidateRequest({ params: CourseParamsZodSchema, body: CourseZodSchema }),
    catchAsyncMiddleware(updateCourse, {
        message: "failed to update"
    }))
courseRouter.delete("/:id", VerifyAccessTokenMiddleWare, IsAdminMiddleware, requestValidateRequest({ params: CourseParamsZodSchema }),
    catchAsyncMiddleware(deleteCourse, {
        message: "failed to delete"
    }))



