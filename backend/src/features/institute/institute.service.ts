import AppError from "../../shared/utils/AppError";
import { InstituteInputZodType } from "./institute.interface";
import { InstituteModel } from "./institute.model";

export const CreateInstituteService = async (payload: InstituteInputZodType) => {
    const email = await InstituteModel.findOne({ emailDomain: payload.emailDomain })
    if (email) throw new AppError("Institute Exist", 409);
    const institute = await InstituteModel.create(payload)
    return institute
}

export const UpdateInstituteService = async (payload: InstituteInputZodType) => {
    const email = await InstituteModel.findOne({ emailDomain: payload.emailDomain })
    if (!email) throw new AppError("Institute doesn't Exist", 404);
    const updated = await InstituteModel.updateOne({ emailDomain: payload.emailDomain },{$set:payload})
    return updated
}

export const DeleteInstituteService = async (id: string) => {
    const institute = await InstituteModel.findByIdAndDelete(id)
    if (!institute) throw new AppError("institute not found", 400);
}

export const fetchAllInstituteService = async () => {
    const institute = await InstituteModel.find({})
    return institute
}