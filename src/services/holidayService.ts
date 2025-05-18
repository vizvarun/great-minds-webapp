import api from "./api";
import AuthService from "./auth";

export interface Holiday {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  classes: string[];
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
    // If "All" is selected, convert it to empty array (server will interpret as all classes)
    const classIds = holiday.classes.includes("All")
      ? []
      : holiday.classes
          .map((cls) => {
            // If the class is already a number or string number, use it
            // Otherwise, it might be a class name which needs to be mapped to an ID
            return typeof cls === "number" ? cls : parseInt(cls, 10);
          })
          .filter((id) => !isNaN(id)); // Filter out any invalid IDs

    const payload = {
      holiday_name: holiday.name,
      start_date: holiday.startDate,
      end_date: holiday.endDate,
      school_id: school_id,
      created_by: user_id,
      classes: classIds, // Send array of IDs
    };

    const response = await api.post("/holiday/create", payload);

    if (response.data && response.data.status === "success") {
      return {
        id: response.data.data?.id || Date.now(), // Fallback to timestamp if no ID
        name: holiday.name,
        startDate: holiday.startDate,
        endDate: holiday.endDate,
        classes: holiday.classes,
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

    const payload = {
      holiday_name: holiday.name,
      start_date: holiday.startDate,
      end_date: holiday.endDate,
      school_id: school_id,
      updated_by: user_id,
      classes: holiday.classes,
    };

    const response = await api.put(`/holiday/${holiday.id}`, payload);

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
