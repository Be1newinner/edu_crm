import { Types } from "mongoose";
import { AttendanceModel } from "./attendance.model";
import AppError from "../../shared/utils/AppError";
import { attendanceZodType } from "./attendance.interface";

export const createSessionService = async (payload: attendanceZodType) => {
    if (!Types.ObjectId.isValid(payload.instituteId))
        throw new AppError("Invalid Institute Id", 400);
    const session = await AttendanceModel.create(payload);
    return session;
};
export const createBulkMark = async (
    id: string,
    payload: attendanceZodType
) => {
    if (!Types.ObjectId.isValid(id))
        throw new AppError("Invalid session Id", 400);
    const bulk = await AttendanceModel.insertMany(payload);
    return bulk;
};
export const fetchListSessionService = async function name() {
    const attendance = await AttendanceModel.find({});
    return attendance;
};

export const getAttendanceBYStudentID = async (studentId: string) => {
    if (!Types.ObjectId.isValid(studentId))
        throw new AppError("Invalid Student Id", 400);
    const studentAttendanceDetails = await AttendanceModel.findOne({ studentId });
    return studentAttendanceDetails;
};

export const getAttendanceBYBatchID = async (batchId: string) => {
    if (!Types.ObjectId.isValid(batchId))
        throw new AppError("Invalid batch Id", 400);
    const studentAttendanceDetails = await AttendanceModel.findOne({ batchId });
    return studentAttendanceDetails;
};
