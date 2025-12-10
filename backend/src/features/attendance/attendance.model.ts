import mongoose from "mongoose";
import { IAttendance } from "./attendance.interface";
const AttendanceSessionSchema = new mongoose.Schema<IAttendance>({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },        // Optional for individual students
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },    // For individual attendance
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },  // Teacher who marked
  sessionDate: { type: Date, required: true },
  sessionTime: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE', 'LEAVE'], required: true },
  remarks: String,
  createdAt: { type: Date, default: Date.now }
});

AttendanceSessionSchema.index({studentId:1,staffId:1},{unique:true})
export const AttendanceModel=mongoose.model<IAttendance>("Attendance",AttendanceSessionSchema)