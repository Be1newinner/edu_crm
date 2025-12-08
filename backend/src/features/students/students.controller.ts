import { Request, Response } from "express";
import { SendResponse } from "../../shared/utils/JsonResponse";
import { StudentModel } from "./students.model";
import { createStudentServices } from "./students.service";

export const createStudent = async (req: Request, res: Response) => {
  const data = req.body;
  const userId = data.userId;

  const student = await createStudentServices(userId, data);
  // if (!userId) {
  //     return SendResponse(res, {
  //       status_code: 400,
  //       message: "User ID is required",
  //     });
  //   }
  //   const existingStudent = await StudentModel.findOne({ userId });

  //   if (existingStudent) {
  //     return SendResponse(res, {
  //       status_code: 409,
  //       message: "User already exists",
  //       data: existingStudent,
  //     });
  //   }
  // const student = await StudentModel.create(data);

  return SendResponse(res, {
    status_code: 201,
    message: "Student created successfully!",
    data: student,
  });
};

export const FetchStudentList = async (req: Request, res: Response) => {
  const {
    batchId,
    status,
    gender,
    instituteId,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const filter: any = {};

  if (batchId) filter.batchIds = batchId;
  if (status) filter.status = status;
  if (gender) filter.gender = gender;
  if (instituteId) filter.instituteId = instituteId;

  if (search) {
    filter.$or = [
      { rollNumber: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const sort: any = {};
  sort[String(sortBy)] = sortOrder === "asc" ? 1 : -1;

  const students = await StudentModel.find(filter)
    .select(
      "-createdAt -updatedAt -individualStudy -guardianName -dateOfBirth -__v"
    )
    .sort(sort);

  return SendResponse(res, {
    status_code: 200,
    message: "Students fetched successfully",
    data: {
      students,
    },
  });
};

export const FetchStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);

  if (!id) {
    return SendResponse(res, {
      status_code: 400,
      message: "Student ID is required",
    });
  }

  const student = await StudentModel.findById(id);
  // .select("-createdAt -updatedAt");

  if (!student) {
    return SendResponse(res, {
      status_code: 404,
      message: "Student not found",
    });
  }

  return SendResponse(res, {
    status_code: 200,
    message: "Student fetched successfully",
    data: student,
  });
};

export const UpdateStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    return SendResponse(res, {
      status_code: 400,
      message: "Student ID is required",
    });
  }

  const updatedStudent = await StudentModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  ).select("-createdAt -updatedAt");

  if (!updatedStudent) {
    return SendResponse(res, {
      status_code: 404,
      message: "Student not found",
    });
  }

  return SendResponse(res, {
    status_code: 200,
    message: "Student updated successfully",
    data: updatedStudent,
  });
};

export const DeleteStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return SendResponse(res, {
      status_code: 400,
      message: "Student ID is required",
    });
  }

  const deletedStudent = await StudentModel.findByIdAndDelete(id);

  if (!deletedStudent) {
    return SendResponse(res, {
      status_code: 404,
      message: "Student not found",
    });
  }

  return SendResponse(res, {
    status_code: 200,
    message: "Student profile deleted successfully.",
  });
};

export const AddBatchesToStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { batchIds } = req.body;

  if (!id) {
    return SendResponse(res, {
      status_code: 400,
      message: "Student ID is required",
    });
  }

  if (!batchIds || !Array.isArray(batchIds)) {
    return SendResponse(res, {
      status_code: 400,
      message: "batchIds must be an array",
    });
  }

  const updatedStudent = await StudentModel.findByIdAndUpdate(
    id,
    { $addToSet: { batchIds: { $each: batchIds } } },
    {
      new: true,
      runValidators: true,
    }
  ).select("-createdAt -updatedAt");

  if (!updatedStudent) {
    return SendResponse(res, {
      status_code: 404,
      message: "Student not found",
    });
  }

  return SendResponse(res, {
    status_code: 200,
    message: "Batches added successfully",
    data: {
      id: updatedStudent._id,
      batchIds: updatedStudent.batchIds,
    },
  });
};

export const RemoveStudentFromBatch = async (req: Request, res: Response) => {
  const { id, batchId } = req.params;

  if (!id || !batchId) {
    return SendResponse(res, {
      status_code: 400,
      message: "Student ID and Batch ID are required",
    });
  }

  const updatedStudent = await StudentModel.findByIdAndUpdate(
    id,
    { $pull: { batchIds: batchId } },
    { new: true }
  ).select("-createdAt -updatedAt");

  if (!updatedStudent) {
    return SendResponse(res, {
      status_code: 404,
      message: "Student not found",
    });
  }

  return SendResponse(res, {
    status_code: 200,
    message: "Student removed from batch successfully.",
  });
};
