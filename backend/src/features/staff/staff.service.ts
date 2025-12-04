import { Types } from "mongoose"
import AppError from "../../shared/utils/AppError"
import { staffZodType } from "./staff.interface"
import { StaffModel } from "./staff.model"

export const createStaffService = async (payload: staffZodType) => {
    if (!Types.ObjectId.isValid(payload.instituteId) && !Types.ObjectId.isValid(payload.userId))
        throw new AppError("Id doesn't exist", 400)
    const staff = await StaffModel.create(payload)
    return staff
}
export const updateStaffService = async (id: string, payload: staffZodType) => {
    if (!Types.ObjectId.isValid(id))
        throw new AppError("Id is not valid", 400)
    const staff = await StaffModel.findByIdAndUpdate(id, { $set: payload }, { new: true })
    return staff
}
export const deleteStaffService = async (id: string) => {
    if (!Types.ObjectId.isValid(id))
        throw new AppError("Id doesn't exist", 400)
    const staff = await StaffModel.findByIdAndDelete(id)
    return staff
}
export const getAllStaffService = async () => {
    const staff = await StaffModel.find({})
    return staff
}
export const getStaffByIdService = async (id: string) => {
    if (!Types.ObjectId.isValid(id))
        throw new AppError("Id doesn't exist", 400)
    const staff = await StaffModel.findById(id)
    return staff
}