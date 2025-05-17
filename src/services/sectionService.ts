import api from "./api";
import AuthService from "./auth";
import { getAllActiveClasses } from "./classService";

export interface Section {
  id: number;
  schoolid: number;
  classid: number;
  section: string;
  isactive: boolean;
  createdby?: number;
  createdat?: string;
  updatedat?: string | null;
  deletedat?: string | null;
  className?: string; // This will be populated from the UI side
}

export interface SectionResponse {
  message: string;
  status: string;
  status_code: number;
  total_records: number;
  data: Section[];
}

// Function to fetch sections with class names
export const getSections = async (
  page: number = 0,
  rowsPerPage: number = 10,
  classId?: number
): Promise<{ data: Section[]; total_records: number }> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    let url = `/sections/list?user_id=${user_id}&school_id=${school_id}`;

    // Add class_id if provided
    if (classId) {
      url += `&class_id=${classId}`;
    }

    // Add pagination parameters
    url += `&page=${page + 1}&per_page=${rowsPerPage}`;

    const response = await api.get(url);

    // Extract sections from the correct property in the response
    const sectionsData = response.data.sections || [];
    const totalRecords = response.data.totalrecords || 0;

    if (!Array.isArray(sectionsData)) {
      console.error("Unexpected API response structure:", response);
      return {
        data: [],
        total_records: 0,
      };
    }

    // Get classes to map class names
    const classesResponse = await getAllActiveClasses();
    const classes = classesResponse.data || [];

    // Map class names to sections
    const sectionsWithClassNames = sectionsData.map((section: Section) => {
      const matchedClass = classes.find((cls) => cls.id === section.classid);
      return {
        ...section,
        className: matchedClass ? matchedClass.classname : "Unknown Class",
      };
    });

    return {
      data: sectionsWithClassNames,
      total_records: totalRecords || sectionsWithClassNames.length,
    };
  } catch (error) {
    console.error("Error fetching sections:", error);
    throw error;
  }
};

export const createSection = async (
  section: Omit<Section, "id">
): Promise<Section> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const response = await api.post(`/sections?user_id=${user_id}`, section);
    return response.data.data;
  } catch (error) {
    console.error("Error creating section:", error);
    throw error;
  }
};

export const updateSection = async (section: Section): Promise<Section> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const response = await api.put(
      `/sections/${section.id}?user_id=${user_id}`,
      section
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating section:", error);
    throw error;
  }
};

export const deleteSection = async (id: number): Promise<void> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    await api.delete(`/sections/${id}?user_id=${user_id}`);
  } catch (error) {
    console.error("Error deleting section:", error);
    throw error;
  }
};

export const toggleSectionStatus = async (
  id: number,
  currentStatus: boolean
): Promise<Section> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const response = await api.patch(
      `/sections/${id}/status?user_id=${user_id}`,
      {
        is_active: !currentStatus,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error toggling section status:", error);
    throw error;
  }
};
