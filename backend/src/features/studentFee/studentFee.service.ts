import { studentFeeZodType } from "./studentFee.dto";
import { StudentFeeModel } from "./studentFee.model"

export const createStudentFeeService=async(payload:studentFeeZodType)=>{
   const studentFee=await StudentFeeModel.create(payload)
   return studentFee;
}
export const deleteStudentFeeService=async(id:string)=>{
   const studentFee=await StudentFeeModel.findByIdAndDelete(id)
   return studentFee;
}
export const updateStudentFeeService=async(payload:studentFeeZodType)=>{
   const studentFee=await StudentFeeModel.updateOne(payload)
   return studentFee;
}
export const fetchStudentFeeService=async(payload:studentFeeZodType)=>{
   const studentFee=await StudentFeeModel.find(payload)
   return studentFee;
}