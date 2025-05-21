import api from "./api";
import AuthService from "./auth";

export interface Subject {
  id: number;
  schoolId: number;
  subjectName: string;
  createdAt?: string;
  updatedAt?: string | null;
}

// Add a new interface for the class-subject mapping response
export interface ClassSubjectMapping {
  id: number;
  classId: number;
  subjectId: number;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface SubjectsResponse {
  page: number;
  page_size: number;
  total_records: number;
  subjects: Subject[];
}

export const getSubjects = async (
  page: number = 0,
  pageSize: number = 10
): Promise<SubjectsResponse> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/subject/list?school_id=${school_id}&user_id=${user_id}&page=${
        page + 1
      }&page_size=${pageSize}`
    );

    // Transform the API response to match our expected format
    if (response.data && Array.isArray(response.data.subjects)) {
      // Map API response to our Subject interface
      const transformedSubjects = response.data.subjects.map(
        (subject: any) => ({
          id: subject.id,
          schoolId: subject.schoolId || subject.school_id,
          subjectName:
            subject.subjectName || subject.subject_name || subject.name || "",
          createdAt: subject.createdAt || subject.created_at,
          updatedAt: subject.updatedAt || subject.updated_at,
        })
      );

      return {
        page: response.data.page || 1,
        page_size: response.data.per_page || pageSize,
        total_records: response.data.totalrecords || transformedSubjects.length,
        subjects: transformedSubjects,
      };
    }

    // Return empty result if response format doesn't match
    return {
      page: 1,
      page_size: pageSize,
      total_records: 0,
      subjects: [],
    };
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

/**
 * Get subjects assigned to a specific class
 */
export const getClassSubjects = async (classId: number): Promise<Subject[]> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/classes/subjects?class_id=${classId}&school_id=${school_id}&user_id=${user_id}`
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching subjects for class ${classId}:`, error);
    return [];
  }
};

/**
 * Update the subjects assigned to a specific class
 */
export const updateClassSubjects = async (
  classId: number,
  subjectIds: number[],
  refreshCallback?: () => void
): Promise<boolean> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // Prepare the payload for the API
    const payload = {
      class_id: classId,
      subject_ids: subjectIds,
      school_id: school_id,
      user_id: user_id,
    };

    // Make the API call to update class subjects
    const response = await api.post("/class/update-subjects", payload);

    // Call the refresh callback if provided
    if (refreshCallback) {
      refreshCallback();
    }

    return response.data && response.data.status === "success";
  } catch (error) {
    console.error(`Error updating subjects for class ${classId}:`, error);
    throw error;
  }
};

export const createSubject = async (
  subjectName: string,
  refreshCallback?: () => void
): Promise<Subject> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.post(
      `/subject/create?school_id=${school_id}&user_id=${user_id}&subject_name=${encodeURIComponent(
        subjectName
      )}`
    );

    // Call the refresh callback if provided
    if (refreshCallback) {
      refreshCallback();
    }

    return response.data.data;
  } catch (error) {
    console.error("Error creating subject:", error);
    throw error;
  }
};

export const updateSubject = async (
  id: number,
  subjectName: string,
  refreshCallback?: () => void
): Promise<Subject> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.put(
      `/subject/update?school_id=${school_id}&user_id=${user_id}&subject_name=${encodeURIComponent(
        subjectName
      )}&subject_id=${id}`
    );

    // Return properly transformed subject data to match the Subject interface
    const updatedSubject: Subject = {
      id: id,
      schoolId: school_id,
      subjectName: subjectName,
      // Keep any other fields that might be in the response
      ...(response.data && response.data.data ? response.data.data : {}),
    };

    // Call the refresh callback if provided to immediately fetch the list again
    if (refreshCallback) {
      refreshCallback();
    }

    return updatedSubject;
  } catch (error) {
    console.error("Error updating subject:", error);
    throw error;
  }
};

export const deleteSubject = async (
  id: number,
  refreshCallback?: () => void
): Promise<void> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    await api.delete(
      `/subject/delete?school_id=${school_id}&user_id=${user_id}&subject_id=${id}`
    );

    // Call the refresh callback if provided
    if (refreshCallback) {
      refreshCallback();
    }
  } catch (error) {
    console.error("Error deleting subject:", error);
    throw error;
  }
};
