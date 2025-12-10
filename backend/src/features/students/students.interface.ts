import { Types } from "mongoose";

export enum STUDENT_STATUS {
  PROSPECT = "PROSPECT",
  ENROLLED = "ENROLLED",
  DROPPED = "DROPPED",
  ALUMNI = "ALUMNI",
}

export const STUDENT_STATUS_ARRAY = [
  STUDENT_STATUS.PROSPECT,
  STUDENT_STATUS.ENROLLED,
  STUDENT_STATUS.DROPPED,
  STUDENT_STATUS.ALUMNI,
] as const ;
export enum GENDER {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
}

export const GENDER_ARRAY = ["MALE", "FEMALE", "OTHER"] as const;

export interface IStudentBase {
  instituteId: Types.ObjectId;
  userId: Types.ObjectId;
  rollNumber: string;

  dateOfBirth?: Date | string | null;
  gender?: GENDER;

  address?: string;
  phone?: string;
  guardianName?: string;
  guardianPhone?: string;

  batchIds?: string[];
  individualStudy?: boolean;

  status?: STUDENT_STATUS;
}

export interface IStudentStoredPublic extends IStudentBase {
  _id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
