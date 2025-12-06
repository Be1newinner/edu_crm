import mongoose from "mongoose";
import { batchParamZodSchema, batchZodSchema } from "./batch.dto";
import z from "zod";

export interface IBatch{
      instituteId: mongoose.Types.ObjectId,
      name: string,
      maxCapacity?:number,
      startDate?:Date,
      description?:string,
      currentEnrollment?:number,
      courseId?:mongoose.Types.ObjectId,
      createdAt:Date,
      updatedAt:Date
}

export type batchInputZodType=z.infer<typeof batchZodSchema>
export type batchParamZodType=z.infer<typeof batchParamZodSchema>