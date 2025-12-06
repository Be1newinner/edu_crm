import { Request, Response } from "express";
import { createCourseService, deleteCourseService, getAllCoursesService, getCourseByIdService, updateCourseService } from "./course.service";
import { SendResponse } from "../../shared/utils/JsonResponse";

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
    await deleteCourseService(id)
    SendResponse(res, { message: "Deleted course success", status_code: 200 })
}

export const getCourseBYId = async (req: Request, res: Response) => {
    const { id } = req.params
    const course = await getCourseByIdService(id)
    SendResponse(res, { data: course, message: "fetch course success", status_code: 200 })
}

export const getAllCourses = async (req: Request, res: Response) => {
    const {code}=req.query
    const codeparams=typeof code ==="string"?code:undefined
    const course = await getAllCoursesService(codeparams)
    SendResponse(res, { data: course, message: "fetch All courses success", status_code: 200 })
}
