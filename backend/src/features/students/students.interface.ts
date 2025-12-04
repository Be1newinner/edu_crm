
import { GENDER } from "../users/user.interface";

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
];

// Base student input (main core fields)
export interface IStudentBase {
  instituteId: string;
  userId: string;
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
