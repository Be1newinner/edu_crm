import { Request, Response } from "express"
import { createBatchService, deleteBatchService, getAllBatchService, getBatchByIdService, getStudentsByBatchService, updateBatchService } from "./batch.service"
import { SendResponse } from "../../shared/utils/JsonResponse"

export const createBatch = async (req: Request, res: Response) => {
     const batch = await createBatchService(req.body)
     SendResponse(res, { data: batch, message: "Batch created success", status_code: 201 })

}

export const updateBatch = async (req: Request, res: Response) => {
     const { id } = req.params
     const batch = await updateBatchService(id, req.body)
     SendResponse(res, { data: batch, message: "Batch updated success", status_code: 200 })

}

export const deleteBatch = async (req: Request, res: Response) => {
     const { id } = req.params
     await deleteBatchService(id)
     SendResponse(res, { message: "Batch deleted success", status_code: 200 })

}

export const getBatchByID = async (req: Request, res: Response) => {
     const { id } = req.params
     const batch = await getBatchByIdService(id)
     SendResponse(res, { data: batch, message: "Batch fetch success", status_code: 200 })

}

export const getAllBatches = async (req: Request, res: Response) => {
     const { search } = req.query
     const searchparams = typeof search == "string" ? search : undefined
     const batch = await getAllBatchService(searchparams)
     SendResponse(res, { data: batch, message: "Batch fetch success", status_code: 200 })
}

export const getStudentsByBatch = async (req: Request, res: Response) => {
     // const { id } = req.params;
     const students = await getStudentsByBatchService();
     SendResponse(res, {
          data: students,
          message: "Students fetched successfully",
          status_code: 200
     });
};