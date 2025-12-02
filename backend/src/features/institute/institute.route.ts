import { Router } from "express";
import { createInstitute, DeleteInstitute, updateInstitute } from "./institute.controller";

export const instituteRouter = Router()
instituteRouter.post("/", createInstitute)
instituteRouter.delete("/:id", DeleteInstitute )
instituteRouter.patch("/", updateInstitute)