import mongoose from "mongoose";
import { IBatch } from "./batch.interface";

const BatchSchema = new mongoose.Schema<IBatch>({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  name: { type: String, required: true },
  maxCapacity: {type:Number},
  startDate: {type:Date},
  description: {type:String},
  currentEnrollment: { type: Number, default: 0 },
  courseId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const BatchModel=mongoose.model("Batch",BatchSchema)
