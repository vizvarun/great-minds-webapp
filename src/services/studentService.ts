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
  // Including other fields for completeness
  dob?: string;
  addressline1?: string;
  addressline2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  classid?: number;
  sectionid?: number;
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

    const payload = {
      ...student,
      schoolid: school_id,
      user_id: user_id,
    };

    const response = await api.post("/students/create", payload);
    return response.data.data;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
};

export const updateStudent = async (student: Student): Promise<Student> => {
  try {
    const user_id = AuthService.getUserId() || 14;

    const response = await api.put(
      `/students/${student.id}?user_id=${user_id}`,
      student
    );
    return response.data.data;
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
    const response = await api.patch(
      `/students/${id}/status?user_id=${user_id}`,
      {
        is_active: !currentStatus,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error toggling student status:", error);
    throw error;
  }
};
