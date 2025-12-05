import { Router } from "express";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { createCourse, deleteCourse, getAllCourses, getCourseBYId, updateCourse } from "./course.controller";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { CourseParamsZodSchema, CourseZodSchema } from "./course.dto";
import IsAdminMiddleware from "../../shared/middlewares/isAdmin.middleware";
import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";
// | `GET` | `/courses` | List `?code=RN101` | ALL |
// | `GET` | `/courses/:id` | Details | ALL |
// | `GET` | `/courses/:id/batches` | Batches for a course | ALL |
export const courseRouter=Router()
courseRouter.get("/",getAllCourses)
courseRouter.get("/:id",requestValidateRequest({params:CourseParamsZodSchema}),
catchAsyncMiddleware(getCourseBYId,{
    message:"failed to fetch"
}))
courseRouter.post("/",VerifyAccessTokenMiddleWare,IsAdminMiddleware,requestValidateRequest({body:CourseZodSchema}),
catchAsyncMiddleware(createCourse,{
    message:"failed to Create"
}))
courseRouter.patch("/:id",requestValidateRequest({params:CourseParamsZodSchema,body:CourseZodSchema}),
catchAsyncMiddleware(updateCourse,{
    message:"failed to update"
}))
courseRouter.delete("/:id",VerifyAccessTokenMiddleWare,IsAdminMiddleware,requestValidateRequest({params:CourseParamsZodSchema}),
catchAsyncMiddleware(deleteCourse,{
    message:"failed to delete"
}))



