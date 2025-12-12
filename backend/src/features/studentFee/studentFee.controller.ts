import { Request, Response } from "express";
import { createStudentFeeService, deleteStudentFeeService, fetchStudentFeeService } from "./studentFee.service";
import { SendResponse } from "../../shared/utils/JsonResponse";

export async function createStudentFee(req:Request,res:Response){
   const studentFee=await createStudentFeeService(req.body)
    SendResponse(res,{
        data:studentFee,
        message:"created student fee!",
        status_code:201,
    })
}
export async function fetchStudentFee(req:Request,res:Response){
   const studentFee=await fetchStudentFeeService(req.body)
    SendResponse(res,{
        data:studentFee,
        message:"fetch student fee!",
        status_code:200,
    })
}
export async function updateStudentFee(req:Request,res:Response){
   const studentFee=await fetchStudentFeeService(req.body)
    SendResponse(res,{
        data:studentFee,
        message:"update student fee!",
        status_code:200,
    })
}
export async function deleteStudentFee(req:Request,res:Response){
   await deleteStudentFeeService(req.params.id)
    SendResponse(res,{
        message:"deleted student fee!",
        status_code:200,
    })
}

