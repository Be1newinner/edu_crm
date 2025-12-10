import { model, Schema } from "mongoose";
import {
  GENDER,
  IStudentStoredPublic,
  STUDENT_STATUS,
  STUDENT_STATUS_ARRAY,
} from "./students.interface";

const StudentSchema = new Schema<IStudentStoredPublic>(
  {
    instituteId: {
      type: Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },

    address: { type: String },
    phone: { type: String },
    guardianName: { type: String },
    guardianPhone: { type: String },

    batchIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Batch",
      },
    ],

    individualStudy: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: STUDENT_STATUS_ARRAY,
      default: STUDENT_STATUS.PROSPECT,
      index: true,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

export const StudentModel = model<IStudentStoredPublic>(
  "Student",
  StudentSchema
);
