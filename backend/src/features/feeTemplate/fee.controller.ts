import { Request, Response } from "express"
import { createFeeTemplateService } from "./fee.service"
import { SendResponse } from "../../shared/utils/JsonResponse"

export const createFeeTemplate=async(req:Request,res:Response)=>{
    const feeTemplate=await createFeeTemplateService(req.body)
    SendResponse(res,{data:feeTemplate,message:"created Fee template !",status_code:201})
}