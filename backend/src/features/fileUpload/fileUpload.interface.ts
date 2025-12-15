import { Types } from "mongoose"

export enum OWNERTYPE {
    STUDENT = "STUDENT",
    STAFF = "STAFF",
    COURSE = "COURSE",
    BATCH = "BATCH"
}

export enum VISIBILITY {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    ROLE_BASED = "ROLE_BASED"
}

export const OWNERTYPE_ARRAY = [
    "STUDENT",
    "STAFF",
    "COURSE",
    "BATCH"
]
export const VISIBILITY_ARRAY=["PUBLIC","PRIVATE","ROLE_BASED"]

export interface IFIleUpload {
    instituteId: Types.ObjectId
    fileName: string
    filePath: string,
    mimeType: string,
    size: number,
    ownerType: OWNERTYPE,
    ownerId: Types.ObjectId,
    tags: string[],
    visibility: VISIBILITY
    uploadedBy?: Types.ObjectId,
    createdAt: Date | string
}