import z from "zod";
import { OWNERTYPE_ARRAY, VISIBILITY_ARRAY } from "./fileUpload.interface";

export const fileUploadZodInput = z.object({
    instituteId: z.string().min(24).max(24),
    fileName:z.string(),
    filePath:z.string(),
    mimeType:z.string().optional(),
    size:z.number().optional(),
    ownerType:z.enum(OWNERTYPE_ARRAY),
    ownerId:z.string().min(24).max(24).optional(),
    tags:z.array(z.string()),
    visibility:z.enum(VISIBILITY_ARRAY).default("PRIVATE"),
    uploadedBy:z.string().min(24).max(24).optional(),
    createdAt:z.coerce.date()
})