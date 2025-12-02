import { Types } from "mongoose"
import { roleInputZodType } from "./role.interface"
import { RoleModel } from "./role.model"
import AppError from "../../shared/utils/AppError"

export const createRoleService=async(payload:roleInputZodType)=>{
   if(!Types.ObjectId.isValid(payload.instituteId)){
      throw new AppError("Incorrect Institute Id",400)
   }
   const role=await RoleModel.create(payload)
   return role
}