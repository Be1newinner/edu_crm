import { Types } from "mongoose";
import { CourseZodType } from "./course.interface";
import AppError from "../../shared/utils/AppError";
import { CourseModel } from "./course.model";

export const createCourseService = async (payload: CourseZodType) => {
    if (!Types.ObjectId.isValid(payload.instituteId))
        throw new AppError("Institute Id is not Valid", 400)
    const existCode = await CourseModel.findOne({ code: payload.code })
    if (!existCode) new AppError("code should be unique", 409)
    const course = new CourseModel(payload)
    await course.save()
    return course
}

export const deleteCourseService = async (id: string) => {
    if (!Types.ObjectId.isValid(id))
        throw new AppError("Course Id is not Valid", 400)
    const deletedCourse = await CourseModel.findByIdAndDelete(id)
    if (!deletedCourse) throw new AppError("course not found", 404);
}

export const updateCourseService = async (id: string, payload: CourseZodType) => {
    if (!Types.ObjectId.isValid(id))
        throw new AppError("Course Id is not Valid", 400)
    if (!payload || Object.keys(payload).length === 0) {
        throw new AppError("No update data provided", 400);
    }
    const updatedCourse = await CourseModel.findByIdAndUpdate(id, { $set: payload }, { new: true,runValidators:true })
    if (!updatedCourse)
        throw new AppError("Course not found", 404)
    return updatedCourse
}

export const getCourseByIdService = async (id: string) => {
    if (!Types.ObjectId.isValid(id))
        throw new AppError("Course Id is not Valid", 400)
    const course = await CourseModel.findById(id).select("-createdAt -updatedAt").lean()
    if (!course)
        throw new AppError("Course not found", 404)
    return course
}

export const getAllCoursesService = async (code?: string) => {
    const filter: Record<string, string> = {}
    if (code !== undefined) {
        filter.code = code
    }
    const course = await CourseModel.find(filter).select("-createdAt -updatedAt -instituteId ").lean()
    return course
}
