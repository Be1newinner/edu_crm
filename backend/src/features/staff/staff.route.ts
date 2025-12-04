import { Router } from "express";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { createStaff, deleteStaff, getAllStaff, getStaffById, updateStaff } from "./staff.controller";
import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";
import IsAdminMiddleware from "../../shared/middlewares/isAdmin.middleware";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { staffParamsZod, staffZodSchema } from "./staff.dto";
export const staffRouter = Router();

staffRouter.get(
  "/",
  catchAsyncMiddleware(getAllStaff, { message: "fetch All staff failed", status: 500 })
);
staffRouter.get(
  "/:id",
  requestValidateRequest({ params: staffParamsZod }),
  catchAsyncMiddleware(getStaffById, { message: "fetch to failed staff", status: 500 })
);
staffRouter.post(
  "/",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  requestValidateRequest({ body: staffZodSchema }),
  catchAsyncMiddleware(createStaff, { message: "failed to create staff", status: 500 })
);
staffRouter.patch(
  "/:id",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  requestValidateRequest({ params: staffParamsZod, body: staffZodSchema }),
  catchAsyncMiddleware(updateStaff, { message: "failed to update staff", status: 500 })
);
staffRouter.delete(
  "/:id",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  requestValidateRequest({ params: staffParamsZod }),
  catchAsyncMiddleware(deleteStaff, { message: "failed to delete staff", status: 500 })
);
