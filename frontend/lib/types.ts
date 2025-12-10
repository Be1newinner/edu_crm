export interface Institute {
  id: string
  name: string
  emailDomain?: string
  createdAt: string
  updatedAt: string
}

export interface User {
  userId: string
  name: string
  email: string
  role: "STUDENT" | "TEACHER" | "STAFF" | "ADMIN"
  instituteId: string
  createdAt: string
  updatedAt?: string
}

export interface Role {
  id: string
  name: string
  permissions: string[]
  instituteId: string
}

export interface Batch {
  id: string
  instituteId: string
  name: string
  maxCapacity: number
  startDate: string
  description?: string
  currentEnrollment: number
  courseIds: string[]
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: string
  instituteId: string
  name: string
  code: string
  durationMonths: number
  credits: number
  feeAmount: number
  description?: string
  prerequisites?: string[]
  createdAt: string
  updatedAt: string
}

export interface Student {
  id: string
  instituteId: string
  userId: string
  rollNumber: string
  name?: string
  email?: string
  dateOfBirth?: string
  gender?: "MALE" | "FEMALE" | "OTHER"
  address?: string
  phone?: string
  guardianName?: string
  guardianPhone?: string
  batchIds: string[]
  individualStudy: boolean
  status: "PROSPECT" | "ENROLLED" | "DROPPED" | "ALUMNI"
  createdAt: string
  updatedAt: string
}

export interface Staff {
  id: string
  instituteId: string
  userId: string
  name?: string
  email?: string
  employeeId: string
  department?: string
  qualification?: string
  dateOfJoining: string
  salaryGrade?: string
  createdAt: string
  updatedAt: string
}

export interface AttendanceSession {
  id: string
  instituteId: string
  batchId?: string
  studentId?: string
  courseId: string
  staffId: string
  sessionDate: string
  sessionTime: {
    start: string
    end: string
  }
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE"
  remarks?: string
  createdAt: string
}

export interface FeeTemplate {
  id: string
  instituteId: string
  name: string
  courseId?: string
  batchId?: string
  components: {
    name: string
    amount: number
    dueDate: string
  }[]
  totalAmount: number
  isActive: boolean
  createdAt: string
}

export interface StudentFee {
  id: string
  instituteId: string
  studentId: string
  studentName?: string
  feeTemplateId?: string
  invoiceNumber: string
  totalAmount: number
  paidAmount: number
  dueDate: string
  status: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE" | "CANCELLED"
  payments: Payment[]
  createdAt: string
}

export interface Payment {
  id?: string
  amount: number
  paymentDate: string
  method: "CASH" | "UPI" | "CARD" | "BANK" | "ONLINE"
  transactionId?: string
  paidBy?: string
}

export interface FileUpload {
  id: string
  instituteId: string
  fileName: string
  filePath: string
  mimeType?: string
  size?: number
  ownerType: "STUDENT" | "STAFF" | "COURSE" | "BATCH"
  ownerId: string
  tags?: string[]
  visibility: "PUBLIC" | "PRIVATE" | "ROLE_BASED"
  uploadedBy?: string
  createdAt: string
}

// Dashboard Stats
export interface DashboardStats {
  totalStudents: number
  totalStaff: number
  totalCourses: number
  totalBatches: number
  enrolledStudents: number
  prospectStudents: number
  totalFeeCollected: number
  pendingFees: number
  attendanceRate: number
  recentEnrollments: Student[]
  feesByStatus: { status: string; count: number; amount: number }[]
  enrollmentTrend: { month: string; count: number }[]
  coursePopularity: { course: string; students: number }[]
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
