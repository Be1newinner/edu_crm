import z from "zod";

 const STATUS = [
    "PRESENT",
    "ABSENT",
    "LATE",
    "LEAVE"
]
export const AttendanceZodInputSchema = z.object({
    instituteId: z.string().regex(/^[0-9a-f]{24}$/, "Invalid Institute Id"),
    batchId: z.string().regex(/^[0-9a-f]{24}$/, "Invalid Batch Id").optional(),
    studentId: z.string().regex(/^[0-9a-f]{24}$/, "Invalid User Id"),
    courseId: z.string().regex(/^[0-9a-f]{24}$/, "Invalid Course Id"),
    staffId: z.string().regex(/^[0-9a-f]{24}$/, "Invalid staff Id"),
    sessionDate: z.coerce.date(),
    sessionTime: {
        start: z.coerce.date(),
        end: z.coerce.date()
    },
    status: z.enum(STATUS),
    remarks: z.string().min(1,"remarks is required"),
    createdAt: z.coerce.date()
})
