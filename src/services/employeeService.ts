import api from "./api";
import AuthService from "./auth";

export interface Employee {
  empId: number;
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
  deletedAt?: string;
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
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // Map the fields to ensure proper naming
    const empNo = employee.empNo;
    const mobileNo = employee.mobileNo;

    // Prepare the payload according to the API requirements
    const payload = {
      employee: {
        // If userId is provided (from validation), use it as user_id_of_emp
        ...(employee.userId && { user_id_of_emp: employee.userId }),
        school_id: school_id,
        emp_no: empNo, // Explicitly include emp_no
        designation: employee.designation,
      },
      user: {
        email: employee.email || "",
        mobileno: mobileNo, // Explicitly include mobileno
        first_name: employee.firstName,
        last_name: employee.lastName || "",
        middle_name: employee.middleName || "",
        createdby: user_id,
      },
    };

    console.log("Creating employee with payload:", payload); // Debug log

    const response = await api.post(
      `/employee/create?user_id=${user_id}`,
      payload
    );

    // Check if the response status is 200, regardless of the response.data.status
    if (response.status === 200) {
      // Return a properly structured Employee object even if response data structure varies
      const responseData = response.data.data || {};

      // For safety, use fallback values from the original request when API response is incomplete
      return {
        id: responseData.empId || responseData.id || 0, // Use 0 as last resort
        empNo: responseData.empNo || empNo,
        firstName: responseData.firstName || employee.firstName,
        lastName: responseData.lastName || employee.lastName || "",
        middleName: responseData.middleName || employee.middleName || "",
        designation: responseData.designation || employee.designation,
        mobileNo: responseData.mobileNo || mobileNo,
        email: responseData.email || employee.email || "",
        userId: responseData.userId || employee.userId,
        schoolId: school_id,
      };
    }

    throw new Error(response.data?.message || "Failed to create employee");
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

export const updateEmployee = async (employee: Employee): Promise<Employee> => {
  try {
    const user_id = AuthService.getUserId() || 14; // Fallback to 14 if not available

    // Map fields from our interface to the API expected format
    const empNo = employee.empNo;
    const mobileNo = employee.mobileNo;

    // Prepare payload for the API's expected format
    const payload = {
      emp_id: employee.id,
      emp_no: empNo,
      designation: employee.designation,
      first_name: employee.firstName,
      middle_name: employee.middleName || "",
      last_name: employee.lastName || "",
      email: employee.email || "",
      mobile_no: mobileNo || "",
    };

    // Use the correct endpoint format with query parameter
    const response = await api.put(
      `/employee/update?user_id=${user_id}`,
      payload
    );

    // Transform the response back to our Employee interface
    if (response.data && response.data.status === "success") {
      return {
        id: employee.id,
        empNo: empNo,
        firstName: employee.firstName,
        lastName: employee.lastName,
        middleName: employee.middleName,
        designation: employee.designation,
        mobileNo: mobileNo,
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

export const getEmployeeTemplate = async (): Promise<Blob> => {
  try {
    const response = await api.get("/employee/import/template", {
      responseType: "blob",
    });

    return new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } catch (error) {
    console.error("Error downloading employee template:", error);
    throw error;
  }
};

export const bulkUploadEmployees = async (file: File): Promise<any> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // Create FormData and append the file
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/employee/import?user_id=${user_id}&school_id=${school_id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
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
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/employee/list/export?user_id=${user_id}&school_id=${school_id}`,
      { responseType: "blob" }
    );

    return response.data;
  } catch (error) {
    console.error("Error downloading employee CSV:", error);
    throw error;
  }
};

// Method for downloading employee data as Excel
export const downloadEmployeeExcel = async (): Promise<Blob> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/employee/list/export?user_id=${user_id}&school_id=${school_id}&format=excel`,
      { responseType: "blob" }
    );

    return new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } catch (error) {
    console.error("Error downloading employee Excel:", error);
    throw error;
  }
};

export const validateEmployeePhone = async (mobileNumber: string) => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/employee/validate?school_id=${school_id}&mobile_number=${mobileNumber}`
    );

    // Return the full response including the emp_no if available
    if (
      response.data &&
      response.data.status === "success" &&
      response.data.data
    ) {
      // Make sure emp_no is included in the returned data
      if (
        response.data.data.employee &&
        !response.data.data.employee.emp_no &&
        response.data.data.employee.empNo
      ) {
        // If emp_no isn't provided but empNo is, map it correctly
        response.data.data.employee.emp_no = response.data.data.employee.empNo;
      }
    }

    return response.data;
  } catch (error) {
    // Handle errors as "number not found" case, which will enable fields for new entry
    console.log(
      "Phone number not found or validation service unavailable:",
      error
    );
    return { status: "error", message: "Phone number not found" };
  }
};

export const toggleEmployeeStatus = async (
  id: number,
  currentStatus: boolean
): Promise<Employee> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // Log the id to verify it's not undefined
    console.log("Toggle status for employee ID:", id);

    // Use query parameters instead of body for the toggle endpoint
    // This ensures emp_id is properly passed even if the API expects it in a different format
    const response = await api.post(
      `/employee/status/toggle?user_id=${user_id}&school_id=${school_id}&emp_id=${id}&activate=${!currentStatus}`,
      {} // Empty body
    );

    if (response.data && response.data.status === "success") {
      // Return updated employee data
      return response.data.data;
    }

    throw new Error(
      response.data?.message || "Failed to update employee status"
    );
  } catch (error) {
    console.error("Error toggling employee status:", error);
    throw error;
  }
};
