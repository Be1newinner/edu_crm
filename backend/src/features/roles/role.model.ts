import mongoose from "mongoose";
import { IRole } from "./role.interface";

const RoleSchema = new mongoose.Schema<IRole>({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: String }], // ["users:read", "academic:create"]
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true }
});
RoleSchema.index({name:1},{unique:true})
export const RoleModel=mongoose.model("Role",RoleSchema)