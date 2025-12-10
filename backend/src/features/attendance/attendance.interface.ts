import { Types } from "mongoose"
import { AttendanceZodInputSchema } from "./attendance.dto"
import z from "zod"

export enum STATUS {
    PRESENT = "PRESENT",
    ABSENT = "ABSENT",
    LATE = "LATE",
    LEAVE="LEAVE"
}

export interface IAttendance{
     instituteId:Types.ObjectId,
      batchId?: Types.ObjectId,      
      studentId: Types.ObjectId,   
      courseId?:Types.ObjectId,
      staffId:Types.ObjectId,  
      sessionDate: Date|string,
      sessionTime: {
        start:Date|string,
        end: Date|string
      },
      status:STATUS,
      remarks: string,
      createdAt:Date|string
}

export type attendanceZodType=z.infer<typeof AttendanceZodInputSchema>