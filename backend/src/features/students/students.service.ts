import { Model, Types } from "mongoose";
import { IStudentStoredPublic } from "./students.interface";
import { createBaseRepository } from "../../shared/respository/base.repository";
import { StudentModel } from "./students.model";
import AppError from "../../shared/utils/AppError";

export function createStudentRepository(model: Model<IStudentStoredPublic>) {
  const baseRepo = createBaseRepository<IStudentStoredPublic>(model);
  return baseRepo;
}

const studentRepo = createStudentRepository(StudentModel);

export const createStudentServices = async (
  userId:string,
  instituteId:string,
  data: Partial<IStudentStoredPublic>
) => {
  if (
    !Types.ObjectId.isValid(userId) &&
    !Types.ObjectId.isValid(instituteId)
  )
    throw new AppError("User ID and Institute Id is required ", 400);
  const existingStudent = await StudentModel.findOne({ userId:data.userId });
  if (existingStudent) throw new AppError("User already exists", 409);
  const newData = await studentRepo.create(data);
  return newData;
};

export const studentFetchServices = async () => {
  const filter: Record<string, unknown> = {};

  // if (batchId) filter.batchIds = batchId;
  // if (status) filter.status = status;
  // if (gender) filter.gender = gender;
  // if (instituteId) filter.instituteId = instituteId;

  // if (search) {
  //   filter.$or = [
  //     { rollNumber: { $regex: search, $options: "i" } },
  //     { phone: { $regex: search, $options: "i" } },
  //   ];
  // }

  // const sort: Record<string, unknown> = {};
  // sort[String(sortBy)] = sortOrder === "asc" ? 1 : -1;

  const students = await StudentModel.find(filter).select(
    "-createdAt -updatedAt -individualStudy -guardianName -dateOfBirth -__v"
  );
  // .sort(sort);
  return students;
};

export const FetchStudentByIdService = async (id: string) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError("Student ID is required", 400);
  const student = await StudentModel.findById(id).select(
    "-createdAt -updatedAt"
  );
  if (!student) {
    throw new AppError("Student not found", 404);
  }
  return student;
};

export const updatedStudentBYIdService = async (
  id: string,
  data: Partial<IStudentStoredPublic>
) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError("Student ID is required", 400);
  const updatedStudent = await StudentModel.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  ).select("-createdAt -updatedAt");
  if (!updatedStudent) throw new AppError("student not found", 400);
  return updatedStudent;
};

export const deletedStudentBYIdService = async (id: string) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError("Student ID is required", 400);
  const deletedStudent = await StudentModel.findByIdAndDelete(id);
  if (!deletedStudent) throw new AppError("Student not found", 404);
};

export const RemoveBatchService = async (
  id: string,
  batchId: string
) => {
  if (!Types.ObjectId.isValid(id) && !Types.ObjectId.isValid(batchId))
    throw new AppError("Student ID and Batch ID are required", 400);
  const updatedStudent = await StudentModel.findByIdAndUpdate(
    id,
    { $pull: { batchIds: batchId } },
    { new: true }
  ).select("-createdAt -updatedAt");
  if (!updatedStudent) throw new AppError("student not found", 400);
};

export const AddBatchesToStudentService = async (
  id: string,
  batchIds: string
) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError("Student ID is required", 400);
  if (!Types.ObjectId.isValid(batchIds) && !Array.isArray(batchIds))
    throw new AppError("batchIds must be an array", 400);
  const updatedStudent = await StudentModel.findByIdAndUpdate(
    id,
    { $addToSet: { batchIds: { $each: [batchIds] } } },
    {
      new: true,
      runValidators: true,
    }
  ).select("-createdAt -updatedAt");

  if (!updatedStudent) throw new AppError("student not found", 400);
  return updatedStudent;
};
