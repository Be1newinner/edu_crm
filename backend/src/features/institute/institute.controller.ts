import { Request, Response } from "express";
import *  as  InstituteService from "./institute.service";
import { SendResponse } from "../../shared/utils/JsonResponse";

export const createInstitute = async (req: Request, res: Response) => {
  const institute = await InstituteService.CreateInstituteService(req.body);
  SendResponse(res, {
    status_code: 201,
    message: "Institute created successfully",
    data: institute,
  },
  );
}

export const updateInstitute = async (req: Request, res: Response) => {
  const institute = await InstituteService.UpdateInstituteService(req.body);
  SendResponse(res, {
    data: institute,
    status_code: 200,
    message: "Institute Updated successfully",
  },
  );
}

export const DeleteInstitute = async (req: Request, res: Response) => {
  const { id } = req.params
  await InstituteService.DeleteInstituteService(id);
  SendResponse(res, {
    status_code: 200,
    message: "Institute deleted successfully",
  },
  );
}

export const fetchAllInstitute=async(req:Request,res:Response)=>{
  const Institutes=await InstituteService.fetchAllInstituteService()
  SendResponse(res,{
    data:Institutes,
    status_code:200,
    message:"Institute fetch successfully"
  })
}