import mongoose from "mongoose";
import { ICourse } from "./course.interface";

const CourseSchema = new mongoose.Schema<ICourse>({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  durationMonths: {type:Number},
  credits: {type:Number},
  feeAmount: {type:Number},
  description: {type:String},
  prerequisites: [{type:String}],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CourseSchema.index({code:1},{unique:true})
export const CourseModel=mongoose.model<ICourse>("Course",CourseSchema)