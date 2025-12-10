import { Request, Response } from "express";
import { SendResponse } from "../../shared/utils/JsonResponse";
import {
  AddBatchesToStudentService,
  createStudentServices,
  deletedStudentBYIdService,
  FetchStudentByIdService,
  RemoveBatchService,
  studentFetchServices,
  updatedStudentBYIdService,
} from "./students.service";

export const createStudent = async (req: Request, res: Response) => {
  const data = req.body;
  const userId=data.userId;
  const instituteId=data.instituteId;
  const student = await createStudentServices(userId,instituteId,data);
  return SendResponse(res, {
    status_code: 201,
    message: "Student created successfully!",
    data: student,
  });
};

export const FetchStudentList = async (req: Request, res: Response) => {
  const students = await studentFetchServices();
  return SendResponse(res, {
    status_code: 200,
    message: "Students fetched successfully",
    data: students,
  });
};

export const FetchStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const student = await FetchStudentByIdService(id);
  return SendResponse(res, {
    status_code: 200,
    message: "Student fetched successfully",
    data: student,
  });
};

export const UpdateStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedStudent = await updatedStudentBYIdService(id, req.body);
  return SendResponse(res, {
    status_code: 200,
    message: "Student updated successfully",
    data: updatedStudent,
  });
};

export const DeleteStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deletedStudentBYIdService(id);
  return SendResponse(res, {
    status_code: 200,
    message: "Student profile deleted successfully.",
  });
};

export const AddBatchesToStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { batchIds } = req.body;
  const updatedStudent = await AddBatchesToStudentService(id, batchIds);
  return SendResponse(res, {
    status_code: 200,
    message: "Batches added successfully",
    data: {
      id: updatedStudent._id,
      batchIds: updatedStudent.batchIds,
    },
  });
};

export const RemoveBatch = async (req: Request, res: Response) => {
  const { id, batchId } = req.params;
  await RemoveBatchService(id, batchId);
  return SendResponse(res, {
    status_code: 200,
    message: "Student removed from batch successfully.",
  });
};

