import { Types } from "mongoose"
import AppError from "../../shared/utils/AppError"
import { staffZodQueryType, staffZodType } from "./staff.interface"
import { StaffModel } from "./staff.model"

export const createStaffService = async (payload: staffZodType) => {
    if (!Types.ObjectId.isValid(payload.instituteId))
        throw new AppError("Institute Id doesn't exist", 400)
    if (!Types.ObjectId.isValid(payload.userId))
        throw new AppError("User Id doesn't exist", 400)
    const existUserId = await StaffModel.findOne({ userId: payload.userId });
    if (existUserId) {
        throw new AppError("User Id already exists", 409);
    }
    const existEmployeeId = await StaffModel.findOne({
        employeeId: payload.employeeId,
        userId: payload.userId
    });
    if (existEmployeeId) {
        throw new AppError("Employee Id already exists for this user", 409);
    }
    const staff = await StaffModel.create(payload)
    return staff
}
export const updateStaffService = async (id: string, payload: staffZodType) => {
    if (!Types.ObjectId.isValid(id))
        throw new AppError("staff Id is not valid", 400)
    if (!payload || Object.keys(payload).length === 0) {
        throw new AppError("No update data provided", 400);
    }
    const staff = await StaffModel.findByIdAndUpdate(id, { $set: payload }, { new: true })
    if (!staff) throw new AppError("Staff not found", 404)
    return staff
}

export const deleteStaffService = async (id: string) => {
    if (!Types.ObjectId.isValid(id))
        throw new AppError("staff Id is not valid", 400)
    const staff = await StaffModel.findByIdAndDelete(id)
    if (!staff) throw new AppError("Staff not found", 404)
}
export const getAllStaffService = async (department?: staffZodQueryType) => {
    const filter: { department?: staffZodQueryType } = {};
    if (department) filter.department = department
    const staff = await StaffModel.find(filter).select("_id userId name employeeId department").lean()
    return staff
}
export const getStaffByIdService = async (id: string) => {
    if (!Types.ObjectId.isValid(id))
        throw new AppError("Staff Id doesn't exist", 400)
    const staff = await StaffModel.findById(id)
    if (!staff) throw new AppError("Staff not found", 404)
    return staff
}