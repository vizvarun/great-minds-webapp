import api from "./api";
import AuthService from "./auth";

export interface Employee {
  id: number;
  empNo: string;
  firstName: string;
  lastName: string;
  designation: string;
  mobileNo: string;
  email?: string;
  address?: string;
  joiningDate?: string;
  middleName?: string;
  userId?: number;
  schoolId?: number;
}

// Updated getEmployees function to support pagination
export const getEmployees = async (page = 0, pageSize = 10): Promise<any> => {
  try {
    // Get user_id and school_id from auth service
    const user_id = AuthService.getUserId() || 14; // Fallback to 14 if not available
    const school_id = AuthService.getSchoolId() || 4; // Fallback to 4 if not available

    // Add page and pageSize parameters to the API request
    const response = await api.get(
      `/employee/list?user_id=${user_id}&school_id=${school_id}&page=${
        page + 1
      }&pageSize=${pageSize}`
    );

    return response.data; // Return the complete response object, including pagination metadata
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const createEmployee = async (
  employee: Omit<Employee, "id">
): Promise<Employee> => {
  try {
    const response = await api.post("/web/employees", employee);
    return response.data.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

export const updateEmployee = async (employee: Employee): Promise<Employee> => {
  try {
    const user_id = AuthService.getUserId() || 14; // Fallback to 14 if not available
    const school_id = AuthService.getSchoolId() || 4; // Fallback to 4 if not available

    // Prepare payload for the API
    const payload = {
      user_id,
      school_id,
      emp_id: employee.id,
      emp_no: employee.empNo,
      designation: employee.designation,
      first_name: employee.firstName,
      middle_name: employee.middleName || "",
      last_name: employee.lastName || "",
      email: employee.email || "",
      mobile_no: employee.mobileNo,
    };

    const response = await api.put(
      `/employee/overview?user_id=${user_id}`,
      payload
    );

    // Transform the response back to our Employee interface
    if (response.data && response.data.status === "success") {
      return {
        id: employee.id,
        empNo: employee.empNo,
        firstName: employee.firstName,
        lastName: employee.lastName,
        middleName: employee.middleName,
        designation: employee.designation,
        mobileNo: employee.mobileNo,
        email: employee.email,
        address: employee.address,
        joiningDate: employee.joiningDate,
        userId: employee.userId,
        schoolId: employee.schoolId,
      };
    }

    throw new Error(response.data?.message || "Failed to update employee");
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

export const deleteEmployee = async (id: number): Promise<void> => {
  try {
    await api.delete(`/web/employees/${id}`);
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

export const bulkUploadEmployees = async (
  employees: Omit<Employee, "id">[]
): Promise<Employee[]> => {
  try {
    const response = await api.post("/web/employees/bulk", employees);
    return response.data.data || [];
  } catch (error) {
    console.error("Error bulk uploading employees:", error);
    throw error;
  }
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
  try {
    const response = await api.get(`/web/employees/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    throw error;
  }
};

// Method for downloading employee data
export const downloadEmployeeCSV = async (): Promise<Blob> => {
  try {
    const response = await api.get("/web/employees/export", {
      responseType: "blob",
    });
    return new Blob([response.data], { type: "text/csv" });
  } catch (error) {
    console.error("Error downloading employees CSV:", error);
    throw error;
  }
};

export const validateEmployeePhone = async (
  mobileNo: string
): Promise<{
  exists: boolean;
  employeeNo?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  designation?: string;
  email?: string;
}> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/employee/validate-phone?user_id=${user_id}&school_id=${school_id}&mobile_no=${mobileNo}`
    );

    if (response.data && response.data.status === "success") {
      // If employee exists with this phone number
      if (response.data.exists) {
        const employee = response.data.data;
        return {
          exists: true,
          employeeNo: employee.empNo,
          firstName: employee.firstName,
          middleName: employee.middleName,
          lastName: employee.lastName,
          designation: employee.designation,
          email: employee.email,
        };
      }

      // If no employee exists with this phone number
      return {
        exists: false,
      };
    }

    return { exists: false };
  } catch (error) {
    // Handle errors as "number not found" case
    // This makes the form fields active instead of showing an error
    console.log(
      "Phone number not found or validation service unavailable:",
      error
    );
    return { exists: false };
  }
};
