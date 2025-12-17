import { Document, model, Schema } from "mongoose";
import { hashing } from "../auth/auth.utils";
import AppError from "../../shared/utils/AppError";
import { IUserStoredDocument } from "./user.interface";

const UserSchema = new Schema<IUserStoredDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'], required: true },
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true },
    refreshToken: {
      type: [String],
      default: [],
      validate: {
        validator: (val: string[]) => val.length <= 4,
        message: "Maximum 4 refresh tokens allowed",
      },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
);

UserSchema.pre("save", async function (next) {
  const user = this as IUserStoredDocument & Document;
  if (!user.isModified("password")) return next();
  try {
    user.password = await hashing(user.password);
    next();
  } catch (err) {
    console.error(err);
    next(new AppError("Unexpected Error!", 500));
  }
});

UserSchema.index({ email: 1 }, { unique: true });

export const UserModel = model("User", UserSchema);
