import { Router } from "express";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import {  batchParamZodSchema, batchZodSchema } from "./batch.dto";
import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";
import IsAdminMiddleware from "../../shared/middlewares/isAdmin.middleware";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { createBatch, deleteBatch, getAllBatches, getBatchByID, updateBatch } from "./batch.controller";

export const batchRouter = Router()
batchRouter.get("/", catchAsyncMiddleware(getAllBatches, { message: "all batch fetch failed" }))
batchRouter.post("/", VerifyAccessTokenMiddleWare, IsAdminMiddleware,
    requestValidateRequest({ body: batchZodSchema }), catchAsyncMiddleware(createBatch, { message: "batch creation failed" }))
batchRouter.patch("/:id", VerifyAccessTokenMiddleWare, IsAdminMiddleware,
    requestValidateRequest({ body: batchZodSchema,params:batchParamZodSchema }), 
    catchAsyncMiddleware(updateBatch, { message: "batch update failed" }))
batchRouter.delete("/:id", VerifyAccessTokenMiddleWare, IsAdminMiddleware,
    requestValidateRequest({ params: batchParamZodSchema }), catchAsyncMiddleware(deleteBatch, { message: "batch delete failed" }))
batchRouter.get("/:id", catchAsyncMiddleware(getBatchByID, { message: "batch fetch failed" }))
    