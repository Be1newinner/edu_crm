// | Method | Endpoint | Description | Role |
// |--------|----------|-------------|------|
// | `POST` | `/students` | Create profile | ADMIN, STAFF |
// | `GET` | `/students` | List `?batchId=xxx` | ALL |
// | `GET` | `/students/:id` | Details | ALL |
// | `PATCH` | `/students/:id` | Update | ADMIN, STAFF |
// | `DELETE` | `/students/:id` | Delete | ADMIN |
// | `POST` | `/students/:id/batches` | Add batches | ADMIN, STAFF |
// | `DELETE` | `/students/:id/batches/:batchId` | Remove batch | ADMIN |

import { Router } from "express";
import * as StudentController from "./students.controller";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
// import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";

export const StudentRouter: Router = Router();

StudentRouter.post(
  "/",
  catchAsyncMiddleware(StudentController.createStudent, {
    message: "Creating Student failed!",
    status: 500,
  })
);
StudentRouter.get(
  "/",
  catchAsyncMiddleware(StudentController.FetchStudentList, {
    message: "Student Fetch failed!",
    status: 500,
  })
);
