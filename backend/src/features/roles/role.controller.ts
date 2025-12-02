import { Request, Response } from "express"
import { createRoleService } from "./role.service"
import { SendResponse } from "../../shared/utils/JsonResponse"

export const createRole = async (req: Request, res: Response) => {
    const role = await createRoleService(req.body)
    SendResponse(res, { data: role, message: "Created Role", status_code: 201 })
}