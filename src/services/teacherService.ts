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
}

export const getTeachersBySection = async (
  sectionId?: number
): Promise<Teacher[]> => {
  try {
    const user_id = AuthService.getUserId() || 14;

    if (!sectionId) {
      return getAllTeachers();
    }

    // Updated endpoint to match the required format
    const response = await api.get(`/section/teachers?section_id=${sectionId}`);

    if (response.data && Array.isArray(response.data.teachers)) {
      // Map API response to Teacher interface and add fullName computed property
      return response.data.teachers.map((teacher: any) => ({
        id: teacher.teacherid, // Use teacherid as the id for selection
        userId: teacher.id, // Original ID field might be the userId
        firstName: teacher.firstname || "",
        lastName: teacher.lastname || "",
        middleName: teacher.middlename || "",
        fullName: `${teacher.firstname || ""} ${
          teacher.middlename ? teacher.middlename + " " : ""
        }${teacher.lastname || ""}`.trim(),
        designation: teacher.designation || "",
        email: teacher.email || "",
        sectionId: teacher.sectionid,
        typeId: teacher.typeid, // This might indicate the teacher's role (teacher/admin)
      }));
    }
    
    // Return empty array if no data found
    return [];
  } catch (error) {
    console.error("Error fetching teachers by section:", error);
    // If an error occurs, fall back to getAllTeachers
    return getAllTeachers();
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
