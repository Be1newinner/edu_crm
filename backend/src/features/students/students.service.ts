import { Model } from "mongoose";
import { IStudentStoredPublic } from "./students.interface";
import { createBaseRepository } from "../../shared/respository/base.repository";
import { StudentModel } from "./students.model";
import AppError from "../../shared/utils/AppError";

export function createStudentRepository(model: Model<IStudentStoredPublic>) {
  const baseRepo = createBaseRepository<IStudentStoredPublic>(model);
  return baseRepo
}

const studentRepo = createStudentRepository(StudentModel);

export const createStudentServices = async (
  userId: string,
  data: Partial<IStudentStoredPublic>
) => {
  if (!userId) throw new AppError("User ID is required", 400);

  const existingStudent = await StudentModel.findOne({ userId });
  if (existingStudent) throw new AppError("User already exists", 409);
// const student = await StudentModel.create(data);
  
  const newData = await studentRepo.create(data);

  return newData;
};
