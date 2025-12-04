import { Types } from "mongoose";
import { CourseZodSchema } from "./course.dto";
import z from "zod";

export interface ICourse{
  instituteId:Types.ObjectId;
  name:string;
  code:string;
  durationMonths:number;
  credits: number;
  feeAmount: number;
  description:string;
  prerequisites: string[];
  createdAt: Date;
  updatedAt:Date;
}
export type CourseZodType=z.infer<typeof CourseZodSchema>