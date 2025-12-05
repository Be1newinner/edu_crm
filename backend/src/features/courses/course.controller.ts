import { Request, Response } from "express";
import { createCourseService, getAllCoursesService, getCourseByIdService, updateCourseService } from "./course.service";
import { SendResponse } from "../../shared/utils/JsonResponse";
import { deleteBatchService } from "../batch/batch.service";

export const createCourse = async (req: Request, res: Response) => {
    const course = await createCourseService(req.body)
    SendResponse(res, { data: course, message: "created course success", status_code: 201 })
}

export const updateCourse = async (req: Request, res: Response) => {
    const { id } = req.params
    const updateCourse = await updateCourseService(id, req.body)
    SendResponse(res, { data: updateCourse, message: "Updated course success", status_code: 200 })
}

export const deleteCourse = async (req: Request, res: Response) => {
    const { id } = req.params
    await deleteBatchService(id)
    SendResponse(res, { message: "Deleted course success", status_code: 200 })
}

export const getCourseBYId = async (req: Request, res: Response) => {
    const { id } = req.params
    const course = await getCourseByIdService(id)
    SendResponse(res, { data: course, message: "fetch course success", status_code: 200 })
}

export const getAllCourses = async (req: Request, res: Response) => {
    const course = await getAllCoursesService()
    SendResponse(res, { data: course, message: "fetch All courses success", status_code: 200 })
}
