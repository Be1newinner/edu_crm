import { Model, Types } from "mongoose";
import { createBaseRepository } from "../../shared/respository/base.repository";
import { Document } from "mongoose";
import { IUserStoredDocument } from "./user.interface";

export function createUserRepository(model: Model<IUserStoredDocument>) {
  const baseRepo = createBaseRepository<IUserStoredDocument>(model);

  const findByEmail = (email: string): Promise<IUserStoredDocument | null> => {
    return model.findOne({ email }).lean<IUserStoredDocument>();
  };

  const findVerifiedUsers = (): Promise<IUserStoredDocument[]> => {
    return model.find({ isVerified: true }).lean<IUserStoredDocument[]>().exec();
  };

  const findByIdWithPassword = (
    uid: string
  ): Promise<(IUserStoredDocument & Document) | null> => {
    return model.findById(uid).select("+password").exec();
  };

  const findByEmailWithPassword = (
    email: string
  ): Promise<(IUserStoredDocument & Document) | null> => {
    return model.findOne({ email }).select("+password");
  };

  const updateById = async (
    id: string,
    data: Partial<IUserStoredDocument>
  ): Promise<IUserStoredDocument | null> => {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user id");
    }

    return model
      .findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .lean<IUserStoredDocument>()  };

  return {
    ...baseRepo,
    findByEmail,
    findVerifiedUsers,
    findByIdWithPassword,
    findByEmailWithPassword,
    updateById,
  };
}
