import { Model, Document, Types } from "mongoose";
import { UserModel } from "./user.model";
import { createUserRepository } from "./user.repository";
import { IUserStoredDocument } from "./user.interface";

const userRepo = createUserRepository(
  UserModel as unknown as Model<IUserStoredDocument>
);

export type CreateUserInput = Partial<IUserStoredDocument> & {
  name: string;
  email: string;
  password?: string;
  instituteId:Types.ObjectId;
  role?: string;
};

export const UsersAPI = {
  create: (data: CreateUserInput) => userRepo.create(data),
  findById: (id: string) => userRepo.findById(id),
  updateById: (id: string, data: Partial<IUserStoredDocument>) =>
    userRepo.updateById(id, data),
  softDeleteById: (id: string) =>
    userRepo.updateById(id, { status: "DELETED", deletedAt: new Date() }),

  findByEmail: (email: string): Promise<IUserStoredDocument | null> =>
    userRepo.findByEmail(email),

  findVerifiedUsers: (): Promise<IUserStoredDocument[]> =>
    userRepo.findVerifiedUsers(),

  findByIdWithPassword: (
    uid: string
  ): Promise<(IUserStoredDocument & Document) | null> =>
    userRepo.findByIdWithPassword(uid),

  findByEmailWithPassword: (
    email: string
  ): Promise<(IUserStoredDocument & Document) | null> =>
    userRepo.findByEmailWithPassword(email),

  findByRefreshToken: (token: string) =>
    (UserModel as unknown as Model<IUserStoredDocument>)
      .findOne({ refreshToken: token }, { email: 1, roles: 1, refreshToken: 1 })
      .exec(),

  revokeRefreshToken: (token: string) => {
    UserModel.findOneAndUpdate({ refreshToken: token }, {
      $unset: {
        refreshToken: token
      }
    })
  }
}