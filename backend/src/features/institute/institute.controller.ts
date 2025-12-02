import { Request, Response } from "express";
import *  as  InstituteService from "./institute.service";
import { SendResponse } from "../../shared/utils/JsonResponse";
import AppError from "../../shared/utils/AppError";

export const createInstitute = async (req: Request, res: Response) => {
  const institute = await InstituteService.CreateInstituteService(req.body);
  if (!institute) {
    throw new AppError("All fields are required")
  }
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
    status_code: 200,
    message: "Institute Updated successfully",
    data: institute,
  },
  );
}

export const DeleteInstitute = async (req: Request, res: Response) => {
  const { id } = req.params
  const institute = await InstituteService.DeleteInstituteService(id);
  SendResponse(res, {
    status_code: 200,
    message: "Institute deleted successfully",
    data: institute,
  },
  );
}