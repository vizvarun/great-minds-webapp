//@ts-nocheck

import api from "./api";
import AuthService from "./auth";

export interface Teacher {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName?: string; // Computed property for display
  designation: string;
  email?: string;
  typeId: number;
}

export const getTeachersBySection = async (
  sectionId: number
): Promise<Teacher[]> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/section/teachers?section_id=${sectionId}&school_id=${school_id}&user_id=${user_id}`
    );

    // Handle the new response format with teachers array
    if (response.data && Array.isArray(response.data.teachers)) {
      return response.data.teachers.map((teacher: any) => ({
        id: teacher.teacherid, // Use teacherid as the primary identifier
        userId: teacher.teacherid,
        firstName: teacher.firstname || "",
        lastName: teacher.lastname || "",
        middleName: teacher.middlename || "",
        fullName: `${teacher.firstname || ""} ${
          teacher.middlename ? teacher.middlename + " " : ""
        }${teacher.lastname || ""}`.trim(),
        designation: teacher.designation, // Designation based on typeId
        email: teacher.email || "",
        sectionId: teacher.sectionid,
        typeId: teacher.typeid,
        recordId: teacher.id, // Store the original record ID separately for operations like delete
      }));
    }

    // Fallback to handling the old response format if needed
    if (response.data && Array.isArray(response.data)) {
      return response.data.map((teacher: any) => ({
        id: teacher.id || teacher.teacherId || teacher.empId,
        userId: teacher.userId,
        firstName: teacher.firstName || "",
        lastName: teacher.lastName || "",
        middleName: teacher.middleName || "",
        fullName: `${teacher.firstName || ""} ${
          teacher.middleName ? teacher.middleName + " " : ""
        }${teacher.lastName || ""}`.trim(),
        designation: teacher.designation || "",
        email: teacher.email || "",
      }));
    }
    return [];
  } catch (error) {
    console.error(`Error fetching teachers for section ${sectionId}:`, error);
    return [];
  }
};

export const getAllTeachers = async (): Promise<Teacher[]> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/teachers?user_id=${user_id}&school_id=${school_id}`
    );

    console.log("Teachers API response:", response.data); // Log response for debugging

    // Handle different response formats properly
    if (response.data) {
      // Check for data in standard format
      if (Array.isArray(response.data.data)) {
        return response.data.data.map((teacher: any) => ({
          id: teacher.id,
          userId: teacher.userId,
          firstName: teacher.firstName || "",
          lastName: teacher.lastName || "",
          middleName: teacher.middleName || "",
          fullName: `${teacher.firstName || ""} ${
            teacher.middleName ? teacher.middleName + " " : ""
          }${teacher.lastName || ""}`.trim(),
          designation: teacher.designation || "",
          email: teacher.email || "",
        }));
      }
      // Check if the response itself is an array
      else if (Array.isArray(response.data)) {
        return response.data.map((teacher: any) => ({
          id: teacher.id || teacher.empId,
          userId: teacher.userId,
          firstName: teacher.firstName || "",
          lastName: teacher.lastName || "",
          middleName: teacher.middleName || "",
          fullName: `${teacher.firstName || ""} ${
            teacher.middleName ? teacher.middleName + " " : ""
          }${teacher.lastName || ""}`.trim(),
          designation: teacher.designation || "",
          email: teacher.email || "",
        }));
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching all teachers:", error);
    return [];
  }
};

export const getActiveEmployees = async (): Promise<Teacher[]> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/employee/active-list?user_id=${user_id}&school_id=${school_id}`
    );

    // Handle the actual response structure where data is in response.data.data
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map((employee: any) => ({
        id: employee.empId, // Use empId as the primary id
        userId: employee.userId,
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        middleName: employee.middleName || "",
        fullName:
          `${employee.firstName || ""} ${
            employee.middleName ? employee.middleName + " " : ""
          }${employee.lastName || ""}`.trim() || `Employee ${employee.empId}`,
        designation: employee.designation || "",
        email: employee.email || "",
        empNo: employee.empNo || "", // Include employee number
        mobileNo: employee.mobileNo || "", // Include mobile number
      }));
    }

    console.log("Unexpected response format:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching active employees:", error);
    return [];
  }
};

/**
 * Add teacher to a specific section
 */
export const addTeacherToSection = async (
  teacherId: number,
  sectionId: number
): Promise<boolean> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.post(`/section/add-teacher`, {
      teacher_id: teacherId,
      section_id: sectionId,
      school_id: school_id,
      user_id: user_id,
    });

    return response.data && response.data.status === "success";
  } catch (error) {
    console.error(
      `Error adding teacher ${teacherId} to section ${sectionId}:`,
      error
    );
    return false;
  }
};

/**
 * Add teachers to a specific section - updated to handle multiple teachers
 */
export const addTeachersToSection = async (
  teacherIds: number[],
  sectionId: number
): Promise<boolean> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // For multiple teachers, execute all requests and wait for all to complete
    const results = await Promise.all(
      teacherIds.map(async (teacherId) => {
        const response = await api.post(
          `/sections/add-employee?section_id=${sectionId}&employee_id=${teacherId}&user_id=${user_id}`
        );

        return response.data && response.data.status === "success";
      })
    );

    // Return true only if all operations were successful
    return results.every((result) => result === true);
  } catch (error) {
    console.error(`Error adding teachers to section ${sectionId}:`, error);
    return false;
  }
};

/**
 * Remove teacher from a specific section
 */
export const removeTeacherFromSection = async (
  teacherId: number,
  sectionId: number,
  recordId?: number
): Promise<boolean> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // Use the correct API endpoint with the required query parameters
    const response = await api.delete(
      `/section/teacher/delete?section_id=${sectionId}&teacher_id=${teacherId}&user_id=${user_id}&school_id=${school_id}`
    );

    return response.data && response.data.status === "success";
  } catch (error) {
    console.error(
      `Error removing teacher ${teacherId} from section ${sectionId}:`,
      error
    );
    return false;
  }
};
