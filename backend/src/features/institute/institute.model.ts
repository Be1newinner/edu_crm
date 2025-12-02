import  { model } from "mongoose";
import { Schema } from "mongoose";
import { IInstituteDocument } from "./institute.interface";

const InstituteSchema = new Schema<IInstituteDocument>({
  name: { type: String, required: true },
  emailDomain: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

InstituteSchema.index({emailDomain:1},{unique:true})
export const InstituteModel=model("Institute",InstituteSchema)
