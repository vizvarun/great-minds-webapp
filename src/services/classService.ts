import api from "./api";
import AuthService from "./auth";

export interface Class {
  id: number;
  classname: string; // Changed from name to classname to match API response
  schoolid?: number; // Changed to lowercase to match API response
  isactive?: boolean; // Changed to lowercase to match API response
  createdby?: number;
  createdat?: string;
  updatedat?: string | null;
  deletedat?: string | null;
}

export interface ClassesResponse {
  data: Class[];
  total_records: number;
  status: string;
  message: string;
  status_code: number;
}

export const getClasses = async (): Promise<ClassesResponse> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/classes/list?user_id=${user_id}&school_id=${school_id}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

// Add new function to get only active classes for dropdowns
export const getAllActiveClasses = async (): Promise<ClassesResponse> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/classes/list_all_active?user_id=${user_id}&school_id=${school_id}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching active classes:", error);
    throw error;
  }
};

// Updated function to create a new class with the correct payload structure
export const createClass = async (
  classData: Partial<Class>
): Promise<Class> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const payload = {
      classname: classData.classname,
      schoolid: school_id,
      createdby: user_id, // Set createdby to user_id according to API requirements
      isactive: true, // Default to active
    };

    const response = await api.post(
      `/classes/create?user_id=${user_id}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating class:", error);
    throw error;
  }
};

// Updated function to update a class with the correct endpoint structure
export const updateClass = async (classData: Class): Promise<Class> => {
  try {
    const userId = AuthService.getUserId() || 14;
    const schoolId = AuthService.getSchoolId() || 4;

    const response = await api.put(`/classes/update?class_id=${classData.id}`, {
      classname: classData.classname,
      schoolid: schoolId,
      createdby: classData.createdby || userId, // Use provided createdby or default to userId
      isactive: classData.isactive !== undefined ? classData.isactive : true,
    });

    if (response.data && response.data.status === "success") {
      return response.data.data || classData;
    }

    return classData;
  } catch (error) {
    console.error("Error updating class:", error);
    throw error;
  }
};

// Update function to delete a class with the correct endpoint and query params
export const deleteClass = async (classId: number): Promise<void> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    await api.delete(
      `/classes/delete?class_id=${classId}&user_id=${user_id}&school_id=${school_id}`
    );
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};

// Add a new function to toggle class status
export const toggleClassStatus = async (classId: number): Promise<void> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    await api.put(
      `/classes/toggle-status?class_id=${classId}&user_id=${user_id}&school_id=${school_id}`
    );
  } catch (error) {
    console.error("Error toggling class status:", error);
    throw error;
  }
};
