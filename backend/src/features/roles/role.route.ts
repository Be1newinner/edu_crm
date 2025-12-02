import { Router } from "express";
import IsAdminMiddleware from "../../shared/middlewares/isAdmin.middleware";
import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { roleInputSchema } from "./role.dto";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { createRole } from "./role.controller";
export const roleRouter = Router()
roleRouter.post("/", 
    VerifyAccessTokenMiddleWare,
    IsAdminMiddleware,
    requestValidateRequest({ body: roleInputSchema }),
    catchAsyncMiddleware(createRole, {
        message: "Role creation failed!",
        status: 500,
    }))