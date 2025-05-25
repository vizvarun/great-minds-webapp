//@ts-nocheck

import api from "./api";
import AuthService from "./auth";

export interface Student {
  id: number;
  schoolid: number;
  enrollmentno: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  phoneno: string;
  isactive: boolean;
  profilepic?: string;
  dob?: string;
  email?: string;
  gender?: string;
  addressline1?: string;
  addressline2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  classid?: number;
  sectionid?: number;
  student_deletedat?: string | null; // Added this field to track student status
}

export const getStudentsBySection = async (
  sectionId: number
): Promise<Student[]> => {
  try {
    const user_id = AuthService.getUserId() || 14;

    const response = await api.get(
      `/section/students?section_id=${sectionId}&user_id=${user_id}`
    );

    // Return the data if it's an array
    if (Array.isArray(response.data)) {
      return response.data;
    }

    console.error("Unexpected response format:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching students by section:", error);
    return [];
  }
};

export const addStudentToSection = async (
  studentId: number,
  sectionId: number
): Promise<boolean> => {
  try {
    const user_id = AuthService.getUserId() || 14;

    await api.post(`/section/assign-student`, {
      student_id: studentId,
      section_id: sectionId,
      user_id,
    });

    return true;
  } catch (error) {
    console.error("Error adding student to section:", error);
    return false;
  }
};

export const addStudentsToSection = async (
  sectionId: number,
  studentIds: number[]
): Promise<boolean> => {
  try {
    const user_id = AuthService.getUserId() || 14;

    await api.post(
      `/section/add-students?section_id=${sectionId}&user_id=${user_id}`,
      studentIds
    );
    return true;
  } catch (error) {
    console.error("Error adding students to section:", error);
    return false;
  }
};

export const removeStudentFromSection = async (
  studentId: number,
  sectionId: number
): Promise<boolean> => {
  try {
    const user_id = AuthService.getUserId() || 14;

    await api.delete(
      `/section/remove-student?student_id=${studentId}&section_id=${sectionId}&user_id=${user_id}`
    );

    return true;
  } catch (error) {
    console.error("Error removing student from section:", error);
    return false;
  }
};

export const getStudents = async (
  page: number = 0,
  rowsPerPage: number = 10
): Promise<any> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/students/list?user_id=${user_id}&school_id=${school_id}&page=${
        page + 1
      }&per_page=${rowsPerPage}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const createStudent = async (
  student: Omit<Student, "id">
): Promise<Student> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // Map field names to match API expectations based on the correct format
    const payload = {
      firstname: student.firstname || "",
      lastname: student.lastname || "",
      middlename: student.middlename || "",
      enrollmentno: student.enrollmentno || "",
      email: student.email || "",
      mobileno: student.phoneno || student.mobileno || "",
      schoolid: school_id,
      createdby: user_id,
      isactive: true,
      dob: student.dob || "",
      addressline1: student.addressline1 || "",
      addressline2: student.addressline2 || "",
      city: student.city || "",
      state: student.state || "",
      zipcode: student.zipcode || "",
      gender: student.gender || "",
    };

    // Modified to move user_id to query parameters
    const response = await api.post(
      `/students/create?user_id=${user_id}`,
      payload
    );

    // Check for successful response with the correct structure
    if (
      response.data &&
      response.data.status === "success" &&
      response.data.data
    ) {
      return {
        ...student,
        id: response.data.data.id,
      };
    } else if (response.data && response.data.id) {
      // Alternative success response structure
      return {
        ...student,
        id: response.data.id,
      };
    } else if (response.status === 201 || response.status === 200) {
      // If the response is successful but doesn't have the expected data structure
      // Return a constructed student object with a temporary ID
      return {
        ...student,
        id: Date.now(), // Temporary ID that will be replaced on refresh
      };
    }

    throw new Error(
      response.data?.detail ||
        "Something went wrong while creating the student."
    );
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
};

export const updateStudent = async (
  studentId: number,
  userId: number,
  studentData: any
) => {
  try {
    const response = await api.put(
      `/students/update?student_id=${studentId}&user_id=${userId}`,
      studentData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

export const deleteStudent = async (id: number): Promise<void> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    await api.delete(`/students/${id}?user_id=${user_id}`);
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

export const toggleStudentStatus = async (
  id: number,
  currentStatus: boolean
): Promise<Student> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    // Use the correct endpoint for toggling student status
    const response = await api.post(
      `/students/toggle-status?student_id=${id}&user_id=${user_id}`
    );

    // Return the updated student data
    return response.data.data || { id, isactive: !currentStatus };
  } catch (error) {
    console.error("Error toggling student status:", error);
    throw error;
  }
};

export const getStudentTemplate = async (): Promise<Blob> => {
  try {
    const response = await api.get("/students/import/template", {
      responseType: "blob",
    });

    return new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } catch (error) {
    console.error("Error downloading student template:", error);
    throw error;
  }
};

export const bulkUploadStudents = async (file: File): Promise<any> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // Create FormData and append the file
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/students/import?user_id=${user_id}&school_id=${school_id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error bulk uploading students:", error);
    throw error;
  }
};
