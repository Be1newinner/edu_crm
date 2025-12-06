import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  department: String,
  qualification: String,
  dateOfJoining: { type: Date, required: true },
  salaryGrade: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
StaffSchema.index({employeeId:1,userId:1},{unique:true})
export const StaffModel=mongoose.model("Staff",StaffSchema)