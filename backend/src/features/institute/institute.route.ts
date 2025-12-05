import { Router } from "express";
import { createInstitute, DeleteInstitute, fetchAllInstitute, updateInstitute } from "./institute.controller";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { instituteParamsZodSchema, instituteZodSchema } from "./institute.dto";
import IsAdminMiddleware from "../../shared/middlewares/isAdmin.middleware";
import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";

export const instituteRouter = Router()
instituteRouter.get("/", catchAsyncMiddleware(fetchAllInstitute, {
        message: "fetch failed"
    }))
instituteRouter.post("/",
    requestValidateRequest({ body: instituteZodSchema }), catchAsyncMiddleware(createInstitute, {
        message: "Creation failed"
    }))
instituteRouter.delete("/:id",
    VerifyAccessTokenMiddleWare,
    IsAdminMiddleware,
    requestValidateRequest({ params: instituteParamsZodSchema }), catchAsyncMiddleware(DeleteInstitute, {
        message: "Delete failed"
    }))
instituteRouter.patch("/",
    VerifyAccessTokenMiddleWare,
    IsAdminMiddleware,
    requestValidateRequest({ body: instituteZodSchema }), catchAsyncMiddleware(updateInstitute, {
        message: "Updation failed"
    }))