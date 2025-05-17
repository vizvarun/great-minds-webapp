import api from "./api";
import AuthService from "./auth";

export interface Student {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  mobileNo: string;
  schoolId: number;
  createdby: number;
  isActive: boolean;
  dob?: string;
  addressline1?: string;
  addressline2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  updatedat?: string;
  createdat?: string;
  deletedat?: string;
  // Keep these for compatibility with existing UI
  enrollmentNo?: string;
  gender?: string;
  phoneNumber?: string;
}

// Updated getStudents function to support pagination
export const getStudents = async (page = 0, pageSize = 10): Promise<any> => {
  try {
    // Get user_id and school_id from auth service
    const user_id = AuthService.getUserId() || 7;
    const school_id = AuthService.getSchoolId() || 4;

    // Add page and pageSize parameters to the API request
    const response = await api.get(
      `/students/list?user_id=${user_id}&school_id=${school_id}&page=${
        page + 1
      }&pageSize=${pageSize}`
    );

    return response.data; // Return the complete response object
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

// Create a new student
export const createStudent = async (
  student: Omit<Student, "id">
): Promise<Student> => {
  try {
    const user_id = AuthService.getUserId() || 7;
    const school_id = AuthService.getSchoolId() || 4;

    // Prepare data for API
    const payload = {
      user_id,
      school_id,
      first_name: student.firstName,
      middle_name: student.middleName || "",
      last_name: student.lastName || "",
      mobile_no: student.mobileNo || student.phoneNumber,
      dob: student.dob || "",
      addressline1: student.addressline1 || "",
      addressline2: student.addressline2 || "",
      city: student.city || "",
      state: student.state || "",
      zipcode: student.zipcode || "",
    };

    const response = await api.post(`/students?user_id=${user_id}`, payload);

    if (response.data && response.data.status === "success") {
      const newStudent = response.data.data;
      return {
        ...newStudent,
        // Ensure UI compatibility
        enrollmentNo: `ST-${newStudent.id.toString().padStart(4, "0")}`,
        phoneNumber: newStudent.mobileNo,
      };
    }

    throw new Error(response.data?.message || "Failed to create student");
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
};

// Update a student
export const updateStudent = async (student: Student): Promise<Student> => {
  try {
    const user_id = AuthService.getUserId() || 7;
    const school_id = AuthService.getSchoolId() || 4;

    // Prepare data for API
    const payload = {
      user_id,
      school_id,
      student_id: student.id,
      first_name: student.firstName,
      middle_name: student.middleName || "",
      last_name: student.lastName || "",
      mobile_no: student.mobileNo || student.phoneNumber,
      dob: student.dob || "",
      addressline1: student.addressline1 || "",
      addressline2: student.addressline2 || "",
      city: student.city || "",
      state: student.state || "",
      zipcode: student.zipcode || "",
    };

    const response = await api.put(`/students?user_id=${user_id}`, payload);

    if (response.data && response.data.status === "success") {
      const updatedStudent = response.data.data;
      return {
        ...updatedStudent,
        // Ensure UI compatibility
        enrollmentNo: `ST-${updatedStudent.id.toString().padStart(4, "0")}`,
        phoneNumber: updatedStudent.mobileNo,
      };
    }

    throw new Error(response.data?.message || "Failed to update student");
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

// Delete a student
export const deleteStudent = async (id: number): Promise<void> => {
  try {
    const user_id = AuthService.getUserId() || 7;
    const school_id = AuthService.getSchoolId() || 4;

    await api.delete(
      `/students/${id}?user_id=${user_id}&school_id=${school_id}`
    );
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

// Toggle student active status
export const toggleStudentStatus = async (
  id: number,
  isActive: boolean
): Promise<Student> => {
  try {
    const user_id = AuthService.getUserId() || 7;
    const school_id = AuthService.getSchoolId() || 4;

    const payload = {
      user_id,
      school_id,
      student_id: id,
      is_active: !isActive, // Toggle the status
    };

    const response = await api.patch(
      `/students/status?user_id=${user_id}`,
      payload
    );

    if (response.data && response.data.status === "success") {
      const updatedStudent = response.data.data;
      return {
        ...updatedStudent,
        // Ensure UI compatibility
        enrollmentNo: `ST-${updatedStudent.id.toString().padStart(4, "0")}`,
        phoneNumber: updatedStudent.mobileNo,
      };
    }

    throw new Error(
      response.data?.message || "Failed to update student status"
    );
  } catch (error) {
    console.error("Error toggling student status:", error);
    throw error;
  }
};

// Get student by ID
export const getStudentById = async (id: number): Promise<Student> => {
  try {
    const user_id = AuthService.getUserId() || 7;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/students/${id}?user_id=${user_id}&school_id=${school_id}`
    );

    if (response.data && response.data.status === "success") {
      const student = response.data.data;
      return {
        ...student,
        enrollmentNo: `ST-${student.id.toString().padStart(4, "0")}`,
        phoneNumber: student.mobileNo,
      };
    }

    throw new Error(response.data?.message || "Failed to fetch student");
  } catch (error) {
    console.error(`Error fetching student with ID ${id}:`, error);
    throw error;
  }
};
