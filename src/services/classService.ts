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

// Add function to create a new class
export const createClass = async (
  classData: Partial<Class>
): Promise<Class> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const payload = {
      ...classData,
      schoolid: school_id,
      user_id: user_id,
    };

    const response = await api.post(`/classes?user_id=${user_id}`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error creating class:", error);
    throw error;
  }
};

// Add function to update a class
export const updateClass = async (classData: Class): Promise<Class> => {
  try {
    const user_id = AuthService.getUserId() || 14;

    const response = await api.put(
      `/classes/${classData.id}?user_id=${user_id}`,
      classData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating class:", error);
    throw error;
  }
};

// Add function to delete a class
export const deleteClass = async (classId: number): Promise<void> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    await api.delete(`/classes/${classId}?user_id=${user_id}`);
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};
