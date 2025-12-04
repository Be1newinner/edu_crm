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

export const FetchStudentList = async (req: Request, res: Response) => {
  try {
    const {
      batchId,
      status,
      gender,
      instituteId,
      search,
      page = 1,
      limit = 20,
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

    const skip = (Number(page) - 1) * Number(limit);

    const sort: any = {};
    sort[String(sortBy)] = sortOrder === "asc" ? 1 : -1;

    const students = await StudentModel.find(filter)
      .select("-createdAt -updatedAt -individualStudy -guardianName -dateOfBirth -__v" )
      .skip(skip)
      .limit(Number(limit))
      .sort(sort);

    const total = await StudentModel.countDocuments(filter);

    return SendResponse(res, {
      status_code: 200,
      message: "Students fetched successfully",
      data: {
        total,
        page: Number(page),
        limit: Number(limit),
        students,
      },
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

export const FetchStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id)

    if (!id) {
      return SendResponse(res, {
        status_code: 400,
        message: "Student ID is required",
        data: "",
      });
    }

    const student = await StudentModel.findById(id)
      // .select("-createdAt -updatedAt");

    if (!student) {
      return SendResponse(res, {
        status_code: 404,
        message: "Student not found",
        data: "",
      });
    }

    return SendResponse(res, {
      status_code: 200,
      message: "Student fetched successfully",
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

export const UpdateStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return SendResponse(res, {
        status_code: 400,
        message: "Student ID is required",
        data: "",
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
        data: "",
      });
    }

    return SendResponse(res, {
      status_code: 200,
      message: "Student updated successfully",
      data: updatedStudent,
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


export const DeleteStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return SendResponse(res, {
        status_code: 400,
        message: "Student ID is required",
        data: "",
      });
    }

    const deletedStudent = await StudentModel.findByIdAndDelete(id);

    if (!deletedStudent) {
      return SendResponse(res, {
        status_code: 404,
        message: "Student not found",
        data: "",
      });
    }

    return SendResponse(res, {
      status_code: 200,
      message: "Student profile deleted successfully.",
      data: {
        success: true,
      },
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

export const AddBatchesToStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { batchIds } = req.body;

    if (!id) {
      return SendResponse(res, {
        status_code: 400,
        message: "Student ID is required",
        data: "",
      });
    }

    if (!batchIds || !Array.isArray(batchIds)) {
      return SendResponse(res, {
        status_code: 400,
        message: "batchIds must be an array",
        data: "",
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
        data: "",
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

  } catch (error) {
    console.error(error);
    return SendResponse(res, {
      status_code: 500,
      message: "Internal server error",
      data: "",
    });
  }
};


export const RemoveStudentFromBatch = async (req: Request, res: Response) => {
  try {
    const { id, batchId } = req.params;

    if (!id || !batchId) {
      return SendResponse(res, {
        status_code: 400,
        message: "Student ID and Batch ID are required",
        data: "",
      });
    }

    const updatedStudent = await StudentModel.findByIdAndUpdate(
      id,
      { $pull: { batchIds: batchId } },  // Remove batchId
      { new: true }
    ).select("-createdAt -updatedAt");

    if (!updatedStudent) {
      return SendResponse(res, {
        status_code: 404,
        message: "Student not found",
        data: "",
      });
    }

    return SendResponse(res, {
      status_code: 200,
      message: "Student removed from batch successfully.",
      data: {
        success: true,
      },
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