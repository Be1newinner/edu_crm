import { Types } from "mongoose";
import { CourseZodType } from "./course.interface";
import AppError from "../../shared/utils/AppError";
import { CourseModel } from "./course.model";

export const createCourseService = async (payload: CourseZodType) => {
    if (!Types.ObjectId.isValid(payload.instituteId))
        throw new AppError("Institute Id is not Valid", 400)
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
    const updatedCourse = await CourseModel.findByIdAndUpdate(id, { $set: payload }, { new: true })
    return updatedCourse
}

export const getCourseByIdService = async (id: string) => {
    if (!Types.ObjectId.isValid(id))
        throw new AppError("Course Id is not Valid", 400)
    const course = await CourseModel.findById(id).lean()
    return course
}

export const getAllCoursesService = async () => {
    const course = await CourseModel.find({})
    return course
}