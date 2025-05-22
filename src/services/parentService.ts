import api from "./api";
import AuthService from "./auth";

export interface Parent {
  id: number;
  firstname: string;
  middlename?: string;
  lastname?: string;
  mobileno: string;
  email?: string;
  profilepic?: string;
  isactive: boolean;
  parenttype: "father" | "mother" | "guardian";
  createdat?: string;
  updatedat?: string;
  deletedat?: string;
}

export interface ValidateUserResponse {
  user: {
    message: string;
    userId: number | null;
    firstName: string;
    middleName?: string;
    lastName?: string;
    mobileNo: string;
    email?: string;
    profilepic?: string;
  };
  employee?: {
    message: string;
    empId: number;
    schoolId: number;
    empNo: string;
    designation: string;
  };
}

export const getParentsForStudent = async (
  studentId: number
): Promise<Parent[]> => {
  try {
    const userId = AuthService.getUserId() || 14;
    const response = await api.get(
      `/students/parents?user_id=${userId}&student_id=${studentId}`
    );

    if (response.data && response.data.parents) {
      return response.data.parents;
    }
    return [];
  } catch (error) {
    console.error("Error fetching parents:", error);
    return [];
  }
};

export const validateMobileNumber = async (
  mobileNumber: string
): Promise<ValidateUserResponse | null> => {
  try {
    const response = await api.get(
      `/user/validate?mobile_number=${mobileNumber}`
    );

    if (response.data && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error validating mobile number:", error);
    return null;
  }
};

export const createParent = async (
  studentId: number,
  parentType: string,
  parentData: {
    mobileno: string;
    first_name: string;
    middle_name?: string;
    last_name?: string;
    email?: string;
    profilepic?: string;
  }
): Promise<boolean> => {
  try {
    const userId = AuthService.getUserId() || 14;

    const payload = {
      ...parentData,
      createdby: userId,
    };

    await api.post(
      `/students/parent/create?student_id=${studentId}&user_id=${userId}&parent_type=${parentType}`,
      payload
    );
    return true;
  } catch (error) {
    console.error("Error creating parent:", error);
    return false;
  }
};

export const linkParent = async (
  studentId: number,
  parentId: number,
  parentType: string
): Promise<boolean> => {
  try {
    const userId = AuthService.getUserId() || 14;

    const payload = {
      student_id: studentId,
      parent_id: parentId,
      user_id: userId,
      parent_type: parentType,
    };

    await api.post(`/students/parent/add`, payload);
    return true;
  } catch (error) {
    console.error("Error linking parent:", error);
    return false;
  }
};

export const updateParent = async (
  userId: number,
  parentData: {
    mobileno: string;
    first_name: string;
    middle_name?: string;
    last_name?: string;
    email?: string;
    profilepic?: string;
  }
): Promise<boolean> => {
  try {
    const currentUserId = AuthService.getUserId() || 14;

    const payload = {
      ...parentData,
      createdby: currentUserId,
    };

    await api.put(`/user/user_id?user_id=${userId}`, payload);
    return true;
  } catch (error) {
    console.error("Error updating parent:", error);
    return false;
  }
};
