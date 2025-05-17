import api from "./api";

// Use export type to properly indicate this is a type-only export
export type Employee = {
  empId: number;
  userId: number;
  schoolId: number;
  empNo: string;
  designation: string;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  email: string | null;
  mobileNo: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export interface EmployeeResponse {
  message: string;
  status: string;
  code: number;
  total_records: number;
  page: number;
  pageSize: number;
  data: Employee[];
}

const EmployeeService = {
  getEmployees: async (userId: string | number, schoolId: string | number) => {
    const response = await api.get<EmployeeResponse>("/employee/list", {
      params: {
        user_id: userId,
        school_id: schoolId,
      },
    });
    return response.data;
  },
};

export default EmployeeService;
