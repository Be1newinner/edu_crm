import { Request, Response } from "express";
import {
  createBulkMark,
  createSessionService,
  fetchListSessionService,
  getAttendanceBYBatchID,
  getAttendanceBYStudentID,
} from "./attendance.service";
import { SendResponse } from "../../shared/utils/JsonResponse";

export const createSession = async (req: Request, res: Response) => {
  const session = await createSessionService(req.body);
  SendResponse(res, {
    data: session,
    status_code: 201,
    message: "Created Attendance successfully!",
  });
};

export const createBulkAttendance=async(req:Request,res:Response)=>{
  const {id}=req.params
 const bulkAttendance=await createBulkMark(id,req.body)
 SendResponse(res, {
    data: bulkAttendance,
    status_code: 201,
    message: "Created Bulk Attendance successfully!",
  });
}

export const fetchListSession = async (req: Request, res: Response) => {
  const sessions = await fetchListSessionService();
  SendResponse(res, {
    data: sessions,
    status_code: 200,
    message: "fetch Attendance successfully!",
  });
};

export const getAttendanceDetailsBYBatchID = async (
  req: Request,
  res: Response
) => {
  const { batchId } = req.params;
  const batchAttendance = await getAttendanceBYBatchID(batchId);
  SendResponse(res, {
    data: batchAttendance,
    status_code: 200,
    message: "fetch Attendance successfully!",
  });
};
export const getAttendanceDetailsBYStudentId = async (
  req: Request,
  res: Response
) => {
  const { studentId } = req.params;
  const studentAttendance = await getAttendanceBYStudentID(studentId);
  SendResponse(res, {
    data: studentAttendance,
    status_code: 200,
    message: "fetch Attendance successfully!",
  });
};
