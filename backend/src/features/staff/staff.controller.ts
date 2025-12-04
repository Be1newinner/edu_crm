import { Request, Response } from "express"
import { createStaffService, deleteStaffService, getAllStaffService, getStaffByIdService, updateStaffService } from "./staff.service"
import { SendResponse } from "../../shared/utils/JsonResponse"

export const createStaff=async(req:Request,res:Response)=>{
 const staff=await createStaffService(req.body)
 SendResponse(res,{data:staff,message:"staff Created success !",status_code:201})
}
export const updateStaff=async(req:Request,res:Response)=>{
 const {id}=req.params
 const staff=await updateStaffService(id,req.body)
 SendResponse(res,{data:staff,message:"staff Updated success !",status_code:200})
}

export const deleteStaff=async(req:Request,res:Response)=>{
 const staff=await deleteStaffService(req.body)
 SendResponse(res,{data:staff,message:"staff deleted success !",status_code:200})
}
export const getStaffById=async(req:Request,res:Response)=>{
 const {id}=req.params
 const staff=await getStaffByIdService(id)
 SendResponse(res,{data:staff,message:"fetch staff details !",status_code:200})
}
export const getAllStaff=async(req:Request,res:Response)=>{
 const staff=await getAllStaffService()
 SendResponse(res,{data:staff,message:"All staff fetched success !",status_code:200})
}