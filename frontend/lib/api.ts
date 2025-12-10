import type {
  Institute,
  User,
  Batch,
  Course,
  Student,
  Staff,
  AttendanceSession,
  FeeTemplate,
  StudentFee,
  DashboardStats,
  ApiResponse,
  Payment, 
} from "./types"
import {
  mockInstitute,
  mockUsers,
  mockBatches,
  mockCourses,
  mockStudents,
  mockStaff,
  mockAttendanceSessions,
  mockFeeTemplates,
  mockStudentFees,
  mockDashboardStats,
} from "./mock-data"

const IS_TESTING = process.env.NEXT_PUBLIC_IS_TESTING === "true"
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Generic fetch wrapper
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  if (IS_TESTING) {
    await delay(300) 
  }

  try {
    if (!IS_TESTING) {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data, success: true }
    }

    return { data: undefined, success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    }
  }
}

// Dashboard API
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  if (IS_TESTING) {
    await delay(300)
    return { data: mockDashboardStats, success: true }
  }
  return apiFetch<DashboardStats>("/dashboard/stats")
}

// Institute API
export async function getInstitute(): Promise<ApiResponse<Institute>> {
  if (IS_TESTING) {
    await delay(200)
    return { data: mockInstitute, success: true }
  }
  return apiFetch<Institute>("/institute")
}

export async function updateInstitute(data: Partial<Institute>): Promise<ApiResponse<Institute>> {
  if (IS_TESTING) {
    await delay(300)
    return { data: { ...mockInstitute, ...data }, success: true }
  }
  return apiFetch<Institute>("/institute", {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

// Users API
export async function getUsers(params?: { role?: string; search?: string }): Promise<ApiResponse<User[]>> {
  if (IS_TESTING) {
    await delay(300)
    let users = [...mockUsers]
    if (params?.role) {
      users = users.filter((u) => u.role === params.role)
    }
    if (params?.search) {
      const search = params.search.toLowerCase()
      users = users.filter((u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search))
    }
    return { data: users, success: true }
  }
  const query = new URLSearchParams(params as Record<string, string>).toString()
  return apiFetch<User[]>(`/users?${query}`)
}

export async function createUser(data: Partial<User>): Promise<ApiResponse<User>> {
  if (IS_TESTING) {
    await delay(300)
    const newUser: User = {
      userId: `user${Date.now()}`,
      name: data.name || "",
      email: data.email || "",
      role: data.role || "STUDENT",
      instituteId: "inst123",
      createdAt: new Date().toISOString(),
    }
    return { data: newUser, success: true }
  }
  return apiFetch<User>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Batches API
export async function getBatches(params?: { search?: string }): Promise<ApiResponse<Batch[]>> {
  if (IS_TESTING) {
    await delay(300)
    let batches = [...mockBatches]
    if (params?.search) {
      const search = params.search.toLowerCase()
      batches = batches.filter((b) => b.name.toLowerCase().includes(search))
    }
    return { data: batches, success: true }
  }
  const query = params ? new URLSearchParams(params as Record<string, string>).toString() : ""
  return apiFetch<Batch[]>(`/batches?${query}`)
}

export async function getBatch(id: string): Promise<ApiResponse<Batch>> {
  if (IS_TESTING) {
    await delay(200)
    const batch = mockBatches.find((b) => b.id === id)
    return batch ? { data: batch, success: true } : { error: "Batch not found", success: false }
  }
  return apiFetch<Batch>(`/batches/${id}`)
}

export async function createBatch(data: Partial<Batch>): Promise<ApiResponse<Batch>> {
  if (IS_TESTING) {
    await delay(300)
    const newBatch: Batch = {
      id: `batch${Date.now()}`,
      instituteId: "inst123",
      name: data.name || "",
      maxCapacity: data.maxCapacity || 30,
      startDate: data.startDate || new Date().toISOString(),
      description: data.description,
      currentEnrollment: 0,
      courseIds: data.courseIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return { data: newBatch, success: true }
  }
  return apiFetch<Batch>("/batches", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateBatch(id: string, data: Partial<Batch>): Promise<ApiResponse<Batch>> {
  if (IS_TESTING) {
    await delay(300)
    const batch = mockBatches.find((b) => b.id === id)
    if (!batch) return { error: "Batch not found", success: false }
    return { data: { ...batch, ...data }, success: true }
  }
  return apiFetch<Batch>(`/batches/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteBatch(id: string): Promise<ApiResponse<{ success: boolean }>> {
  if (IS_TESTING) {
    await delay(300)
    return { data: { success: true }, success: true }
  }
  return apiFetch(`/batches/${id}`, { method: "DELETE" })
}

// Courses API
export async function getCourses(params?: { code?: string; search?: string }): Promise<ApiResponse<Course[]>> {
  if (IS_TESTING) {
    await delay(300)
    let courses = [...mockCourses]
    if (params?.code) {
      courses = courses.filter((c) => c.code === params.code)
    }
    if (params?.search) {
      const search = params.search.toLowerCase()
      courses = courses.filter((c) => c.name.toLowerCase().includes(search) || c.code.toLowerCase().includes(search))
    }
    return { data: courses, success: true }
  }
  const query = params ? new URLSearchParams(params as Record<string, string>).toString() : ""
  return apiFetch<Course[]>(`/courses?${query}`)
}

export async function getCourse(id: string): Promise<ApiResponse<Course>> {
  if (IS_TESTING) {
    await delay(200)
    const course = mockCourses.find((c) => c.id === id)
    return course ? { data: course, success: true } : { error: "Course not found", success: false }
  }
  return apiFetch<Course>(`/courses/${id}`)
}

export async function createCourse(data: Partial<Course>): Promise<ApiResponse<Course>> {
  if (IS_TESTING) {
    await delay(300)
    const newCourse: Course = {
      id: `course${Date.now()}`,
      instituteId: "inst123",
      name: data.name || "",
      code: data.code || "",
      durationMonths: data.durationMonths || 6,
      credits: data.credits || 20,
      feeAmount: data.feeAmount || 0,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return { data: newCourse, success: true }
  }
  return apiFetch<Course>("/courses", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateCourse(id: string, data: Partial<Course>): Promise<ApiResponse<Course>> {
  if (IS_TESTING) {
    await delay(300)
    const course = mockCourses.find((c) => c.id === id)
    if (!course) return { error: "Course not found", success: false }
    return { data: { ...course, ...data }, success: true }
  }
  return apiFetch<Course>(`/courses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteCourse(id: string): Promise<ApiResponse<{ success: boolean }>> {
  if (IS_TESTING) {
    await delay(300)
    return { data: { success: true }, success: true }
  }
  return apiFetch(`/courses/${id}`, { method: "DELETE" })
}

// Students API
export async function getStudents(params?: { batchId?: string; status?: string; search?: string }): Promise<
  ApiResponse<Student[]>
> {
  if (IS_TESTING) {
    await delay(300)
    let students = [...mockStudents]
    if (params?.batchId) {
      students = students.filter((s) => s.batchIds.includes(params.batchId!))
    }
    if (params?.status) {
      students = students.filter((s) => s.status === params.status)
    }
    if (params?.search) {
      const search = params.search.toLowerCase()
      students = students.filter(
        (s) =>
          s.name?.toLowerCase().includes(search) ||
          s.email?.toLowerCase().includes(search) ||
          s.rollNumber.toLowerCase().includes(search),
      )
    }
    return { data: students, success: true }
  }
  const query = params ? new URLSearchParams(params as Record<string, string>).toString() : ""
  return apiFetch<Student[]>(`/students?${query}`)
}

export async function getStudent(id: string): Promise<ApiResponse<Student>> {
  if (IS_TESTING) {
    await delay(200)
    const student = mockStudents.find((s) => s.id === id)
    return student ? { data: student, success: true } : { error: "Student not found", success: false }
  }
  return apiFetch<Student>(`/students/${id}`)
}

export async function createStudent(data: Partial<Student>): Promise<ApiResponse<Student>> {
  if (IS_TESTING) {
    await delay(300)
    const newStudent: Student = {
      id: `stu${Date.now()}`,
      instituteId: "inst123",
      userId: data.userId || `user${Date.now()}`,
      rollNumber: data.rollNumber || `STU${Date.now()}`,
      name: data.name,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phone: data.phone,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      batchIds: data.batchIds || [],
      individualStudy: data.individualStudy ?? true,
      status: data.status || "PROSPECT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return { data: newStudent, success: true }
  }
  return apiFetch<Student>("/students", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateStudent(id: string, data: Partial<Student>): Promise<ApiResponse<Student>> {
  if (IS_TESTING) {
    await delay(300)
    const student = mockStudents.find((s) => s.id === id)
    if (!student) return { error: "Student not found", success: false }
    return { data: { ...student, ...data }, success: true }
  }
  return apiFetch<Student>(`/students/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteStudent(id: string): Promise<ApiResponse<{ success: boolean }>> {
  if (IS_TESTING) {
    await delay(300)
    return { data: { success: true }, success: true }
  }
  return apiFetch(`/students/${id}`, { method: "DELETE" })
}

// Staff API
export async function getStaffList(params?: { department?: string; search?: string }): Promise<ApiResponse<Staff[]>> {
  if (IS_TESTING) {
    await delay(300)
    let staff = [...mockStaff]
    if (params?.department) {
      staff = staff.filter((s) => s.department === params.department)
    }
    if (params?.search) {
      const search = params.search.toLowerCase()
      staff = staff.filter(
        (s) =>
          s.name?.toLowerCase().includes(search) ||
          s.email?.toLowerCase().includes(search) ||
          s.employeeId.toLowerCase().includes(search),
      )
    }
    return { data: staff, success: true }
  }
  const query = params ? new URLSearchParams(params as Record<string, string>).toString() : ""
  return apiFetch<Staff[]>(`/staff?${query}`)
}

export async function getStaff(id: string): Promise<ApiResponse<Staff>> {
  if (IS_TESTING) {
    await delay(200)
    const staff = mockStaff.find((s) => s.id === id)
    return staff ? { data: staff, success: true } : { error: "Staff not found", success: false }
  }
  return apiFetch<Staff>(`/staff/${id}`)
}

export async function createStaff(data: Partial<Staff>): Promise<ApiResponse<Staff>> {
  if (IS_TESTING) {
    await delay(300)
    const newStaff: Staff = {
      id: `staff${Date.now()}`,
      instituteId: "inst123",
      userId: data.userId || `user${Date.now()}`,
      employeeId: data.employeeId || `EMP${Date.now()}`,
      name: data.name,
      email: data.email,
      department: data.department,
      qualification: data.qualification,
      dateOfJoining: data.dateOfJoining || new Date().toISOString(),
      salaryGrade: data.salaryGrade,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return { data: newStaff, success: true }
  }
  return apiFetch<Staff>("/staff", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateStaff(id: string, data: Partial<Staff>): Promise<ApiResponse<Staff>> {
  if (IS_TESTING) {
    await delay(300)
    const staff = mockStaff.find((s) => s.id === id)
    if (!staff) return { error: "Staff not found", success: false }
    return { data: { ...staff, ...data }, success: true }
  }
  return apiFetch<Staff>(`/staff/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteStaff(id: string): Promise<ApiResponse<{ success: boolean }>> {
  if (IS_TESTING) {
    await delay(300)
    return { data: { success: true }, success: true }
  }
  return apiFetch(`/staff/${id}`, { method: "DELETE" })
}

// Attendance API
export async function getAttendanceSessions(params?: { date?: string; batchId?: string }): Promise<
  ApiResponse<AttendanceSession[]>
> {
  if (IS_TESTING) {
    await delay(300)
    let sessions = [...mockAttendanceSessions]
    if (params?.batchId) {
      sessions = sessions.filter((s) => s.batchId === params.batchId)
    }
    return { data: sessions, success: true }
  }
  const query = params ? new URLSearchParams(params as Record<string, string>).toString() : ""
  return apiFetch<AttendanceSession[]>(`/attendance/sessions?${query}`)
}

export async function createAttendanceSession(
  data: Partial<AttendanceSession>,
): Promise<ApiResponse<AttendanceSession>> {
  if (IS_TESTING) {
    await delay(300)
    const newSession: AttendanceSession = {
      id: `att${Date.now()}`,
      instituteId: "inst123",
      batchId: data.batchId,
      studentId: data.studentId,
      courseId: data.courseId || "",
      staffId: data.staffId || "",
      sessionDate: data.sessionDate || new Date().toISOString(),
      sessionTime: data.sessionTime || { start: "", end: "" },
      status: data.status || "PRESENT",
      remarks: data.remarks,
      createdAt: new Date().toISOString(),
    }
    return { data: newSession, success: true }
  }
  return apiFetch<AttendanceSession>("/attendance/sessions", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Fee Templates API
export async function getFeeTemplates(): Promise<ApiResponse<FeeTemplate[]>> {
  if (IS_TESTING) {
    await delay(300)
    return { data: mockFeeTemplates, success: true }
  }
  return apiFetch<FeeTemplate[]>("/fee-templates")
}

export async function createFeeTemplate(data: Partial<FeeTemplate>): Promise<ApiResponse<FeeTemplate>> {
  if (IS_TESTING) {
    await delay(300)
    const newTemplate: FeeTemplate = {
      id: `ft${Date.now()}`,
      instituteId: "inst123",
      name: data.name || "",
      courseId: data.courseId,
      batchId: data.batchId,
      components: data.components || [],
      totalAmount: data.totalAmount || 0,
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString(),
    }
    return { data: newTemplate, success: true }
  }
  return apiFetch<FeeTemplate>("/fee-templates", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Student Fees API
export async function getStudentFees(params?: { studentId?: string; status?: string }): Promise<
  ApiResponse<StudentFee[]>
> {
  if (IS_TESTING) {
    await delay(300)
    let fees = [...mockStudentFees]
    if (params?.studentId) {
      fees = fees.filter((f) => f.studentId === params.studentId)
    }
    if (params?.status) {
      fees = fees.filter((f) => f.status === params.status)
    }
    return { data: fees, success: true }
  }
  const query = params ? new URLSearchParams(params as Record<string, string>).toString() : ""
  return apiFetch<StudentFee[]>(`/student-fees?${query}`)
}

export async function createStudentFeeInvoice(
  studentId: string,
  data: { feeTemplateId: string; dueDate: string },
): Promise<ApiResponse<StudentFee>> {
  if (IS_TESTING) {
    await delay(300)
    const template = mockFeeTemplates.find((t) => t.id === data.feeTemplateId)
    const student = mockStudents.find((s) => s.id === studentId)
    const newFee: StudentFee = {
      id: `sf${Date.now()}`,
      instituteId: "inst123",
      studentId,
      studentName: student?.name,
      feeTemplateId: data.feeTemplateId,
      invoiceNumber: `INV${Date.now()}`,
      totalAmount: template?.totalAmount || 0,
      paidAmount: 0,
      dueDate: data.dueDate,
      status: "PENDING",
      payments: [],
      createdAt: new Date().toISOString(),
    }
    return { data: newFee, success: true }
  }
  return apiFetch<StudentFee>(`/students/${studentId}/fee-invoice`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function recordPayment(invoiceId: string, payment: Omit<Payment, "id">): Promise<ApiResponse<StudentFee>> {
  if (IS_TESTING) {
    await delay(300)
    const fee = mockStudentFees.find((f) => f.id === invoiceId)
    if (!fee) return { error: "Invoice not found", success: false }
    const newPaidAmount = fee.paidAmount + payment.amount
    const newStatus = newPaidAmount >= fee.totalAmount ? "PAID" : "PARTIAL"
    return {
      data: {
        ...fee,
        paidAmount: newPaidAmount,
        status: newStatus,
        payments: [...fee.payments, { ...payment, id: `pay${Date.now()}` }],
      },
      success: true,
    }
  }
  return apiFetch<StudentFee>(`/invoices/${invoiceId}/payments`, {
    method: "POST",
    body: JSON.stringify(payment),
  })
}

export const api = {
  dashboard: {
    getStats: getDashboardStats,
  },
  institute: {
    get: getInstitute,
    update: updateInstitute,
  },
  users: {
    getAll: getUsers,
    create: createUser,
  },
  batches: {
    getAll: getBatches,
    getById: getBatch,
    create: createBatch,
    update: updateBatch,
    delete: deleteBatch,
  },
  courses: {
    getAll: getCourses,
    getById: getCourse,
    create: createCourse,
    update: updateCourse,
    delete: deleteCourse,
  },
  students: {
    getAll: getStudents,
    getById: getStudent,
    create: createStudent,
    update: updateStudent,
    delete: deleteStudent,
  },
  staff: {
    getAll: getStaffList,
    getById: getStaff,
    create: createStaff,
    update: updateStaff,
    delete: deleteStaff,
  },
  attendance: {
    getSessions: getAttendanceSessions,
    createSession: createAttendanceSession,
  },
  fees: {
    structures: {
      getAll: getFeeTemplates,
      create: createFeeTemplate,
    },
    records: {
      getAll: getStudentFees,
      createInvoice: createStudentFeeInvoice,
    },
    payments: {
      getAll: async () => {
        if (IS_TESTING) {
          await delay(300)
          const payments: Payment[] = mockStudentFees.flatMap((fee) => fee.payments)
          return { data: payments, success: true }
        }
        return apiFetch<Payment[]>("/payments")
      },
      record: recordPayment,
    },
  },
  uploads: {
    getAll: async () => {
      if (IS_TESTING) {
        await delay(300)
        const mockUploads = [
          {
            id: "doc1",
            instituteId: "inst123",
            originalName: "Student_ID_Proof.pdf",
            storedPath: "/uploads/doc1.pdf",
            mimeType: "application/pdf",
            size: 245000,
            category: "id_proof" as const,
            uploadedBy: "user1",
            uploadedAt: new Date("2024-01-15"),
          },
          {
            id: "doc2",
            instituteId: "inst123",
            originalName: "Graduation_Certificate.pdf",
            storedPath: "/uploads/doc2.pdf",
            mimeType: "application/pdf",
            size: 512000,
            category: "certificate" as const,
            uploadedBy: "user1",
            uploadedAt: new Date("2024-01-10"),
          },
          {
            id: "doc3",
            instituteId: "inst123",
            originalName: "Profile_Photo.jpg",
            storedPath: "/uploads/doc3.jpg",
            mimeType: "image/jpeg",
            size: 125000,
            category: "photo" as const,
            uploadedBy: "user2",
            uploadedAt: new Date("2024-02-01"),
          },
          {
            id: "doc4",
            instituteId: "inst123",
            originalName: "Exam_Results_2024.xlsx",
            storedPath: "/uploads/doc4.xlsx",
            mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 89000,
            category: "result" as const,
            uploadedBy: "user3",
            uploadedAt: new Date("2024-02-15"),
          },
          {
            id: "doc5",
            instituteId: "inst123",
            originalName: "Admission_Form.pdf",
            storedPath: "/uploads/doc5.pdf",
            mimeType: "application/pdf",
            size: 156000,
            category: "other" as const,
            uploadedBy: "user1",
            uploadedAt: new Date("2024-01-20"),
          },
        ]
        return { data: mockUploads, success: true }
      }
      return apiFetch("/uploads")
    },
    upload: async (file: File, category: string) => {
      if (IS_TESTING) {
        await delay(500)
        return {
          data: {
            id: `doc${Date.now()}`,
            instituteId: "inst123",
            originalName: file.name,
            storedPath: `/uploads/${Date.now()}-${file.name}`,
            mimeType: file.type,
            size: file.size,
            category,
            uploadedBy: "user1",
            uploadedAt: new Date(),
          },
          success: true,
        }
      }
      const formData = new FormData()
      formData.append("file", file)
      formData.append("category", category)
      return apiFetch("/uploads", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set content-type for FormData
      })
    },
    delete: async (id: string) => {
      if (IS_TESTING) {
        await delay(300)
        return { data: { success: true }, success: true }
      }
      return apiFetch(`/uploads/${id}`, { method: "DELETE" })
    },
  },
  settings: {
    get: async () => {
      if (IS_TESTING) {
        await delay(300)
        return {
          data: {
            id: "settings1",
            instituteId: "inst123",
            name: "Excellence Academy",
            code: "EXAC2024",
            email: "info@excellenceacademy.edu",
            phone: "+91 9876543210",
            website: "https://excellenceacademy.edu",
            address: "123 Education Street, Knowledge Park, New Delhi - 110001",
            logo: "/placeholder.svg?height=200&width=200",
            academicYear: "2024-25",
            timezone: "Asia/Kolkata",
            dateFormat: "DD/MM/YYYY",
            currency: "INR",
          },
          success: true,
        }
      }
      return apiFetch("/settings")
    },
    update: async (data: Record<string, unknown>) => {
      if (IS_TESTING) {
        await delay(300)
        return { data: { ...data }, success: true }
      }
      return apiFetch("/settings", {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },
  },
}
