import { Types } from "mongoose"
import { feeTemplateZodInputSchema } from "./fee.dto";
import z from "zod";

export interface IFeeTemplate {
    instituteId: Types.ObjectId;
    name: string;
    courseId: Types.ObjectId;
    batchId: Types.ObjectId,
    components: {
        name: string,
        amount: number,
        dueDate: Date
    }[],
    totalAmount: number;
    isActive?: boolean;
    createdAt?: Date;
}

export type feeTemplateZodInputType=z.infer<typeof feeTemplateZodInputSchema>