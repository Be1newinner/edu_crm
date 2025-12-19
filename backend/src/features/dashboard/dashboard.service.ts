import { AttendanceModel } from "../attendance/attendance.model";
import { BatchModel } from "../batch/batch.model";
import { CourseModel } from "../courses/course.model";
import { FeeTemplateModel } from "../feeTemplate/fee.model";
import { StaffModel } from "../staff/staff.model";
import { StudentFeeModel } from "../studentFee/studentFee.model";
import { StudentModel } from "../students/students.model";

export const getDashboardStatsService = async () => {
  const totalStudents = await StudentModel.countDocuments();
  const totalStaff = await StaffModel.countDocuments();
  const totalCourses = await CourseModel.countDocuments();
  const totalBatches = await BatchModel.countDocuments();
  const enrolledStudents = await StudentModel.countDocuments({
    status: "ENROLLED",
  });
  const prospectStudents = await StudentModel.countDocuments({
    status: "PROSPECT",
  });
  const totalFeeCollected = await StudentFeeModel.find({
    status: "PAID",
  }).lean();
  const countTotalFee = totalFeeCollected.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0
  );
  const pendingFees = await StudentFeeModel.find({ status: "PENDING" }).lean();
  const totalPendingAmount = pendingFees.reduce(
    (acc, fee) => acc + fee.totalAmount,
    0
  );
  const recentEnrollments = await StudentModel.find({
    status: "ENROLLED",
  }).sort({ createdAt: -1 });
  const attendanceRate = await AttendanceModel.countDocuments();

  const feesByStatus = await FeeTemplateModel.find({status:""});
  // const allstatus = feesByStatus.reduce((acc, curr) => {
  //   const status = curr.status;
  //   if (!acc[status]) {
  //     acc[status] = { status, count: 0, amount: 0 };
  //   }
  //    acc[status].count += 1;
  //   acc[status].amount += curr.amount || curr.totalAmount || 0;
  //   return acc
  // }, {});
  const enrollmentTrend = await StudentModel.find({});
  const coursePopularity = await StudentModel.find({});
  return {
    totalStudents,
    totalStaff,
    totalCourses,
    totalBatches,
    enrolledStudents,
    prospectStudents,
    totalFeeCollected: countTotalFee,
    pendingFees: totalPendingAmount,
    attendanceRate,
    recentEnrollments,
    feesByStatus,
    enrollmentTrend,
    coursePopularity,
  };
};

