import { Router } from "express";
import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";
import IsAdminMiddleware from "../../shared/middlewares/isAdmin.middleware";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { feeTemplateZodInputSchema } from "./fee.dto";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { createFeeTemplate } from "./fee.controller";

export const FeeTemplateRouter = Router();

FeeTemplateRouter.post(
  "/",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  requestValidateRequest({ body: feeTemplateZodInputSchema }),
  catchAsyncMiddleware(createFeeTemplate,{
    message:"failed to create",
    status:500
  })
);