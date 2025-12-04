import { Router } from "express";
import * as StudentController from "./students.controller";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
// import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";

export const StudentRouter: Router = Router();

StudentRouter.post(
  "/",
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
  catchAsyncMiddleware(StudentController.FetchStudentById, {
    message: "Single student fetch failed!",
    status: 500,
  })
);

StudentRouter.patch(
  "/:id",
  catchAsyncMiddleware(StudentController.UpdateStudentById, {
    message: "Update student fetch failed!",
    status: 500,
  })
);
StudentRouter.delete(
  "/:id",
  catchAsyncMiddleware(StudentController.DeleteStudentById, {
    message: "delete student fetch failed!",
    status: 500,
  })
);

StudentRouter.post(
  "/:id/batches",
  catchAsyncMiddleware(StudentController.AddBatchesToStudent, {
    message: "Add student batches failed!",
    status: 500,
  })
);
StudentRouter.delete(
  "/:id/batches/:batchId",
  catchAsyncMiddleware(StudentController.RemoveStudentFromBatch, {
    message: "Delete student batches failed!",
    status: 500,
  })
);

