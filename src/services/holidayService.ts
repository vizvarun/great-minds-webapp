import api from "./api";
import AuthService from "./auth";
import { getAllActiveClasses } from "./classService";

export interface Holiday {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  classes: any[]; // Updated to accept both strings and objects
  holidayName?: string; // For API compatibility
  start_date?: string; // For API compatibility
  end_date?: string; // For API compatibility
}

export const getHolidays = async (): Promise<Holiday[]> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/holiday/list?school_id=${school_id}&user_id=${user_id}`
    );

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map((holiday: any) => ({
        id: holiday.id,
        name: holiday.holidayname || holiday.holidayName || holiday.name || "",
        startDate: holiday.startdate || holiday.start_date || "",
        endDate: holiday.enddate || holiday.end_date || holiday.startdate || "", // Use startdate as fallback
        classes: holiday.classes || [],
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching holidays:", error);
    throw error;
  }
};

export const createHoliday = async (holiday: Holiday): Promise<Holiday> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // Transform the classes array to ensure it contains only IDs
    let classIds = [];

    // If "All" is selected, we need to include ALL class IDs
    if (holiday.classes && holiday.classes.length > 0) {
      if (holiday.classes.includes("All")) {
        // Get all available classes
        try {
          const classesResponse = await getAllActiveClasses();
          if (classesResponse && classesResponse.data) {
            // Extract all class IDs
            classIds = classesResponse.data.map((cls: any) => cls.id);
          }
        } catch (err) {
          console.error(
            "Failed to fetch all classes for holiday creation:",
            err
          );
        }
      } else {
        // Convert class values to numeric IDs as before
        classIds = holiday.classes
          .map((cls) => {
            // If the class is already a number, use it
            if (typeof cls === "number") {
              return cls;
            }

            // Extract ID from the class object if it's an object with id property
            if (typeof cls === "object" && cls !== null && "id" in cls) {
              return cls.id;
            }

            // If it's a string that could be a number, try to parse as integer
            if (typeof cls === "string" && /^\d+$/.test(cls)) {
              return parseInt(cls, 10);
            }

            return null; // Return null for values we can't convert
          })
          .filter((id) => id !== null); // Filter out null values
      }
    }

    const payload = {
      holiday_name: holiday.name,
      start_date: holiday.startDate,
      end_date: holiday.endDate,
      school_id: school_id,
      created_by: user_id,
      classes: classIds, // Send array of IDs
    };

    // Log the payload for debugging
    console.log("Holiday create payload:", payload);

    const response = await api.post("/holiday/create", payload);

    // Log the response for debugging
    console.log("Holiday create response:", response.data);

    if (response.data && response.data.status === "success") {
      return {
        id: response.data.data?.id || Date.now(), // Fallback to timestamp if no ID
        name: holiday.name,
        startDate: holiday.startDate,
        endDate: holiday.endDate,
        classes: holiday.classes, // Keep the original classes array for UI
      };
    }

    throw new Error(response.data?.message || "Failed to create holiday");
  } catch (error) {
    console.error("Error creating holiday:", error);
    throw error;
  }
};

export const updateHoliday = async (holiday: Holiday): Promise<Holiday> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // Transform the classes array to extract IDs
    let classIds = [];

    // Handle the "All" case properly
    if (holiday.classes && holiday.classes.length > 0) {
      if (holiday.classes.includes("All")) {
        // Get all available classes
        try {
          const classesResponse = await getAllActiveClasses();
          if (classesResponse && classesResponse.data) {
            // Extract all class IDs
            classIds = classesResponse.data.map((cls: any) => cls.id);
          }
        } catch (err) {
          console.error("Failed to fetch all classes for holiday update:", err);
        }
      } else {
        // Convert class values to IDs similar to createHoliday function
        classIds = holiday.classes
          .map((cls) => {
            if (typeof cls === "number") {
              return cls;
            }

            if (typeof cls === "object" && cls !== null && "id" in cls) {
              return cls.id;
            }

            if (typeof cls === "string" && /^\d+$/.test(cls)) {
              return parseInt(cls, 10);
            }

            return null;
          })
          .filter((id) => id !== null);
      }
    }

    const payload = {
      holiday_name: holiday.name,
      holiday_id: holiday.id,
      start_date: holiday.startDate,
      end_date: holiday.endDate,
      school_id: school_id,
      updated_by: user_id,
      created_by: user_id,
      classes: classIds, // Send array of IDs
    };

    // Log the payload for debugging
    console.log("Holiday update payload:", payload);

    const response = await api.put(`/holiday/update`, payload);

    if (response.data && response.data.status === "success") {
      return {
        id: holiday.id,
        name: holiday.name,
        startDate: holiday.startDate,
        endDate: holiday.endDate,
        classes: holiday.classes,
      };
    }

    throw new Error(response.data?.message || "Failed to update holiday");
  } catch (error) {
    console.error("Error updating holiday:", error);
    throw error;
  }
};

export const deleteHoliday = async (id: number): Promise<void> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    // Updated endpoint to match the required format with all necessary query parameters
    await api.delete(
      `/holiday/delete?holiday_id=${id}&school_id=${school_id}&user_id=${user_id}`
    );
  } catch (error) {
    console.error("Error deleting holiday:", error);
    throw error;
  }
};

export const downloadHolidays = async (): Promise<Blob> => {
  try {
    const user_id = AuthService.getUserId() || 14;
    const school_id = AuthService.getSchoolId() || 4;

    const response = await api.get(
      `/holiday/download?school_id=${school_id}&user_id=${user_id}`,
      { responseType: "blob" }
    );

    return new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } catch (error) {
    console.error("Error downloading holidays:", error);
    throw error;
  }
};
