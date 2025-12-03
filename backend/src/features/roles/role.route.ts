import { Router } from "express";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { roleInputSchema, roleParamsSchema } from "./role.dto";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { createRole, deleteRole, getRole, updateRole } from "./role.controller";
export const roleRouter = Router()
roleRouter.post("/",
    requestValidateRequest({ body: roleInputSchema }),
    catchAsyncMiddleware(createRole, {
        message: "Role creation failed!",
        status: 500,
    }))
roleRouter.patch("/role/:id",
    requestValidateRequest({ body: roleInputSchema,params: roleParamsSchema  }),
    catchAsyncMiddleware(updateRole, {
        message: "Role Updation failed!",
        status: 500,
    }))
roleRouter.delete("/:id",
    requestValidateRequest({ params: roleParamsSchema }),
    catchAsyncMiddleware(deleteRole, {
        message: "Role Delete failed!",
        status: 500,
    }))
roleRouter.get("/",
    catchAsyncMiddleware(getRole, {
        message: "role fetch failed!",
        status: 500,
    }))