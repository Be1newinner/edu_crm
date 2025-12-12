import { Router } from "express";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { studentFeeZodSchema } from "./studentFee.dto";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { createStudentFee, deleteStudentFee, fetchStudentFee, updateStudentFee } from "./studentFee.controller";

export const StudentFeeRouter = Router();

StudentFeeRouter.post(
  "/",
  requestValidateRequest({ body: studentFeeZodSchema }),
  catchAsyncMiddleware(createStudentFee,{
    message:"creation failed",
    status:500
  })
);
StudentFeeRouter.get(
  "/",
  catchAsyncMiddleware(fetchStudentFee,{
    message:"fetch failed",
    status:500
  })
);
StudentFeeRouter.delete(
  "/",
  catchAsyncMiddleware(deleteStudentFee,{
    message:"delete failed",
    status:500
  })
);
StudentFeeRouter.patch(
  "/",
  catchAsyncMiddleware(updateStudentFee,{
    message:"update failed",
    status:500
  })
);
