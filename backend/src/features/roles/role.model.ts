import mongoose from "mongoose";
import { IPermission, IRole } from "./role.interface";

const RoleSchema = new mongoose.Schema<IRole>({
  name: { type: String, required: true, unique: true },
  permissions:{ type: String, enum: Object.values(IPermission) }, // ["users:read", "academic:create"]
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true }
});
RoleSchema.index({name:1},{unique:true})
export const RoleModel=mongoose.model("Role",RoleSchema)