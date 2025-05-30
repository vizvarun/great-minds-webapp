//@ts-nocheck

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
  // New fields for teacher and admin information
  classTeacherId?: number;
  classTeacherName?: string;
  classAdminId?: number;
  classAdminName?: string;
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
  classId?: number,
  searchQuery: string = "" // Add searchQuery parameter with default empty string
): Promise<{ data: Section[]; total_records: number }> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // Build base URL with required parameters
    let url = `/sections/list?user_id=${user_id}&school_id=${school_id}&page=${
      page + 1
    }&pageSize=${rowsPerPage}`;

    // Add classId parameter if provided
    if (classId) {
      url += `&class_id=${classId}`;
    }

    // Add search parameter if provided
    if (searchQuery && searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }

    // Make the API call
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

    // Map class names to sections and extract teacher/admin data from new structure
    const sectionsWithClassNames = sectionsData.map((sectionItem: any) => {
      // Handle the new nested structure
      const section = sectionItem.section_data || sectionItem;

      // Extract teacher and admin data from the nested structure
      const teacherData = sectionItem.teacher_data?.employee;
      const adminData = sectionItem.admin_data?.employee;

      const matchedClass = classes.find((cls) => cls.id === section.classid);

      // Format name function to handle employee names consistently
      const formatName = (employee: any) => {
        if (!employee) return "";
        return `${employee.firstName || ""} ${
          employee.middleName ? employee.middleName + " " : ""
        }${employee.lastName || ""}`.trim();
      };

      return {
        ...section,
        className: matchedClass ? matchedClass.classname : "Unknown Class",
        classTeacherId: teacherData?.id,
        classTeacherName: formatName(teacherData),
        classAdminId: adminData?.id,
        classAdminName: formatName(adminData),
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
  section: Omit<Section, "id"> & {
    classTeacherId?: number;
    classAdminId?: number;
  }
): Promise<Section> => {
  try {
    const user_id = AuthService.getUserId() || 14;

    // Prepare payload in the required format
    const payload = {
      section: section.section,
      schoolid: section.schoolid,
      classid: section.classid,
      createdby: user_id,
      isactive: section.isactive || true,
      teacherid: section.classTeacherId || null,
      adminid: section.classAdminId || null,
    };

    const response = await api.post(`/sections/create`, payload);

    // Check that the response contains the expected data structure
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      // If response structure is not as expected, construct a minimal valid section object
      console.warn(
        "Unexpected response structure from section creation:",
        response.data
      );
      return {
        id: response.data.id || Date.now(), // Use any id from response or generate a temporary one
        section: section.section,
        schoolid: section.schoolid,
        classid: section.classid,
        isactive: true,
      };
    }
  } catch (error) {
    console.error("Error creating section:", error);
    throw error;
  }
};

export const updateSection = async (section: Section): Promise<Section> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // Update to use the correct endpoint format with section_id as query parameter
    const response = await api.put(
      `/sections/update?section_id=${section.id}&user_id=${user_id}`,
      {
        section: section.section,
        classid: section.classid,
        createdby: user_id,
        schoolid: section.schoolid || school_id,
        isactive: section.isactive !== undefined ? section.isactive : true,
        teacherid: section.classTeacherId || null,
        adminid: section.classAdminId || null,
      }
    );

    if (response.data && response.data.status === "success") {
      return response.data.data || section;
    }

    return section;
  } catch (error) {
    console.error("Error updating section:", error);
    throw error;
  }
};

export const deleteSection = async (id: number): Promise<void> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // Updated endpoint to match the required format
    await api.delete(
      `/sections/delete?section_id=${id}&school_id=${school_id}&user_id=${user_id}`
    );
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
    const school_id = AuthService.getSchoolId() || 4;

    // Updated endpoint to match required format
    const response = await api.put(
      `/sections/toggle-status?section_id=${id}&school_id=${school_id}&user_id=${user_id}`
    );

    // Return the updated section from the response or create one with toggled status
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      // If response doesn't contain data, return a partial section with toggled status
      return {
        id: id,
        isactive: !currentStatus,
        // Include required fields with default values to satisfy TypeScript
        schoolid: school_id,
        classid: 0,
        section: "",
      };
    }
  } catch (error) {
    console.error("Error toggling section status:", error);
    throw error;
  }
};
