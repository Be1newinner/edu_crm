import { Router } from "express";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { AttendanceZodInputSchema} from "./attendance.dto";
import { createBulkAttendance, createSession, fetchListSession, getAttendanceDetailsBYBatchID, getAttendanceDetailsBYStudentId } from "./attendance.controller";
export const attendanceRouter: Router = Router()

attendanceRouter.post(
  "/sessions",
  requestValidateRequest({body:AttendanceZodInputSchema }),
  catchAsyncMiddleware(createSession, {
    message: "failed to create",
    status: 500,
  })
);
attendanceRouter.post(
  "/sessions/:id/mark",
  requestValidateRequest({body:AttendanceZodInputSchema }),
  catchAsyncMiddleware(createBulkAttendance, {
    message: "failed to create",
    status: 500,
  })
);
attendanceRouter.get(
  "/sessions",
  catchAsyncMiddleware(fetchListSession, {
    message: "failed to fetch",
    status: 500,
  })
);
attendanceRouter.get(
  "/students/:id/attendance",
  catchAsyncMiddleware(getAttendanceDetailsBYStudentId, {
    message: "failed to fetch",
    status: 500,
  })
);
attendanceRouter.get(
  "/batches/:id/attendance",
  catchAsyncMiddleware(getAttendanceDetailsBYBatchID, {
    message: "failed to fetch",
    status: 500,
  })
);
