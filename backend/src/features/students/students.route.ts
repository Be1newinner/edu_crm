import { Router } from "express";
import * as StudentController from "./students.controller";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import {
  studentParamValidation,
  studentSchemaValidation,
} from "./students.dto";
// import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";

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
  requestValidateRequest({ params: studentParamValidation }),
  requestValidateRequest({ body: studentSchemaValidation }),
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
  requestValidateRequest({ params: studentParamValidation }),
  requestValidateRequest({ body: studentSchemaValidation }),
  catchAsyncMiddleware(StudentController.AddBatchesToStudent, {
    message: "Add student batches failed!",
    status: 500,
  })
);
StudentRouter.delete(
  "/:id/batches/:batchId",
  requestValidateRequest({ params: studentParamValidation }),
  catchAsyncMiddleware(StudentController.RemoveStudentFromBatch, {
    message: "Delete student batches failed!",
    status: 500,
  })
);
