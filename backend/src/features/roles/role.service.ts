import { Types } from "mongoose"
import { roleInputZodType } from "./role.interface"
import { RoleModel } from "./role.model"
import AppError from "../../shared/utils/AppError"

export const createRoleService = async (payload: roleInputZodType) => {
   const name= await RoleModel.findOne({name:payload.name})
   if(name){
      throw new AppError("name already exist !",400)
   }
   if (!Types.ObjectId.isValid(payload.instituteId)) {
      throw new AppError("Incorrect Institute Id", 400)
   }
   let role = await RoleModel.create(payload)
   return role
}

export const updateRoleService = async (id:string,payload:roleInputZodType) => {
   if (!id) throw new AppError("id not found", 404);
   const updated = await RoleModel.findByIdAndUpdate(id, { $set: payload},{new:true})
   console.log(updated)
   return updated
}

export const deleteRoleService = async (id: string) => {
   const role = await RoleModel.findByIdAndDelete(id)
   if (!role) throw new AppError("role not found", 400);
   return role
}

export const getRoleService = async () => {
   const role = await RoleModel.find({})
   return role
}