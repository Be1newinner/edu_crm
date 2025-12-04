import { Request, Response } from "express";
import { SendResponse } from "../../shared/utils/JsonResponse";
import { StudentModel } from "./students.model";

export const createStudent = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userId = data.userId;

    if (!userId) {
      return SendResponse(res, {
        status_code: 400,
        message: "User ID is required",
        data: "",
      });
    }
    const existingStudent = await StudentModel.findOne({ userId });

    if (existingStudent) {
      return SendResponse(res, {
        status_code: 409,
        message: "User already exists",
        data: existingStudent,
      });
    }

    const student = await StudentModel.create(data);

    return SendResponse(res, {
      status_code: 201,
      message: "Student created successfully!",
      data: student,
    });
  } catch (error) {
    console.error(error);
    return SendResponse(res, {
      status_code: 500,
      message: "Internal server error",
      data: "",
    });
  }
};
