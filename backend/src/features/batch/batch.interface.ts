import mongoose from "mongoose";
import { batchParamZodSchema, batchZodSchema } from "./batch.dto";
import z from "zod";

export type courseId=mongoose.Types.ObjectId
export interface IBatch{
      instituteId: mongoose.Types.ObjectId,
      name: string,
      maxCapacity?:number,
      startDate?:Date,
      description?:string,
      currentEnrollment?:number,
      courseIds?:courseId[],
      createdAt:Date,
      updatedAt:Date
}

export type batchInputZodType=z.infer<typeof batchZodSchema>
export type batchParamZodType=z.infer<typeof batchParamZodSchema>