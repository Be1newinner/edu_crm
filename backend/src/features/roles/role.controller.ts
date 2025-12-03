import { Request, Response } from "express"
import { createRoleService, deleteRoleService, getRoleService, updateRoleService } from "./role.service"
import { SendResponse } from "../../shared/utils/JsonResponse"

export const createRole = async (req: Request, res: Response) => {
    const role = await createRoleService(req.body)
    SendResponse(res, { data: role, message: "Created Role", status_code: 201 })
}

export const updateRole = async (req: Request, res: Response) => {
    const {id}=req.params;
    const role = await updateRoleService(id,req.body)
    SendResponse(res, { data: role, message: "Updated Role", status_code: 200 })
}

export const deleteRole = async (req: Request, res: Response) => {
    const role = await deleteRoleService(req.params.id)
    SendResponse(res, { data: role, message: "Deleted Role", status_code: 200 })
}

export const getRole = async (req: Request, res: Response) => {
    const role = await getRoleService()
    SendResponse(res, { data: role, message: "Fetch Role", status_code: 200 })
}