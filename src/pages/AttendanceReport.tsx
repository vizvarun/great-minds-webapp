//@ts-nocheck

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../services/api";
import AuthService from "../services/auth";
import { getAllActiveClasses } from "../services/classService";
import { getSections } from "../services/sectionService";

// Get current month-year in YYYY-MM format
const getCurrentMonthYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

const AttendanceReport = () => {
  // Form state
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>(
    getCurrentMonthYear()
  );

  // Data state
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
    timestamp: Date.now(),
  });

  // Fetch classes when component mounts
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch sections when class changes
  useEffect(() => {
    if (selectedClass) {
      fetchSections(parseInt(selectedClass));
    } else {
      setSections([]);
    }
    setSelectedSection("");
  }, [selectedClass]);

  // Fetch classes from API
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await getAllActiveClasses();
      if (response && response.data) {
        setClasses(response.data);
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setNotification({
        open: true,
        message: "Failed to load classes",
        severity: "error",
        timestamp: Date.now(),
      });
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sections from API
  const fetchSections = async (classId: number) => {
    setLoading(true);
    try {
      const response = await getSections(0, 100, classId);
      if (response && response.data) {
        setSections(response.data);
      } else {
        setSections([]);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setNotification({
        open: true,
        message: "Failed to load sections",
        severity: "error",
        timestamp: Date.now(),
      });
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleClassChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedClass(event.target.value as string);
  };

  const handleSectionChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedSection(event.target.value as string);
  };

  const handleMonthYearChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedMonthYear(event.target.value);
  };

  // Generate and download attendance report
  const handleSubmit = async () => {
    if (!selectedSection || !selectedMonthYear) return;

    const sectionId = parseInt(selectedSection);
    const [year, month] = selectedMonthYear.split("-");

    setExporting(true);
    try {
      const user_id = AuthService.getUserId() || 14;
      const school_id = AuthService.getSchoolId() || 4;

      // Call the API to get the Excel file as blob
      const response = await api.get(
        `/section/attendance/export?section_id=${sectionId}&month=${month}&year=${year}`,
        { responseType: "blob" }
      );

      // Create a URL for the blob
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);

      // Find class and section names for the filename
      const className =
        classes.find((c) => c.id === parseInt(selectedClass))?.classname ||
        "Class";
      const sectionName =
        sections.find((s) => s.id === sectionId)?.section || "Section";

      // Create a hidden link element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `Attendance_${className}_${sectionName}_${month}_${year}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);

      setNotification({
        open: true,
        message: "Attendance report downloaded successfully",
        severity: "success",
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error downloading attendance report:", error);
      setNotification({
        open: true,
        message: "No attendance data found for this section",
        severity: "error",
        timestamp: Date.now(),
      });
    } finally {
      setExporting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 0.5,
        border: 1,
        borderColor: "grey.200",
        height: "calc(100% - 16px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        mb={2}
        sx={{ fontWeight: 500, color: "text.primary" }}
      >
        Attendance Report
      </Typography>

      {/* Information text moved above the form */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          mb: 4,
          mt: 2,
        }}
      >
        <CalendarTodayIcon sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Download Attendance Reports
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 500, mt: 1 }}
        >
          Select a class, section, and month from the form to generate and
          download attendance reports in Excel format. These reports contain
          detailed student attendance data for the selected period.
        </Typography>
      </Box>

      {/* Form centered on page */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 800 }}>
          <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Class
                </Typography>
              </Box>
              <FormControl fullWidth size="medium">
                <Select
                  labelId="class-select-label"
                  id="class-select"
                  value={selectedClass}
                  displayEmpty
                  onChange={handleClassChange}
                  disabled={loading}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        width: "auto",
                        minWidth: "100%",
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Select a class</em>
                  </MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id.toString()}>
                      {cls.classname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Section
                </Typography>
              </Box>
              <FormControl
                fullWidth
                disabled={!selectedClass || loading}
                size="medium"
              >
                <Select
                  labelId="section-select-label"
                  id="section-select"
                  value={selectedSection}
                  displayEmpty
                  onChange={handleSectionChange}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        width: "auto",
                        minWidth: "100%",
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Select a section</em>
                  </MenuItem>
                  {sections.map((section) => (
                    <MenuItem key={section.id} value={section.id.toString()}>
                      {section.section}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Month and Year
                </Typography>
              </Box>
              <TextField
                value={selectedMonthYear}
                onChange={handleMonthYearChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  type: "month",
                }}
                placeholder="Select month and year"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                disableElevation
                onClick={handleSubmit}
                disabled={
                  !selectedClass ||
                  !selectedSection ||
                  !selectedMonthYear ||
                  loading ||
                  exporting
                }
                sx={{
                  mt: 1,
                  textTransform: "none",
                  borderRadius: 0.5,
                  transition: "none",
                  backgroundImage: "none",
                  background: "primary.main",
                  boxShadow: "none",
                  py: 1.5,
                  "&:hover": {
                    backgroundImage: "none",
                    background: "primary.main",
                    opacity: 0.9,
                  },
                }}
              >
                {exporting ? (
                  <>
                    <CircularProgress
                      size={20}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Downloading...
                  </>
                ) : (
                  "Download Report"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        key={notification.timestamp}
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="standard"
          sx={{
            width: "100%",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            border: "1px solid",
            borderColor:
              notification.severity === "success"
                ? "rgba(46, 125, 50, 0.2)"
                : notification.severity === "info"
                ? "rgba(2, 136, 209, 0.2)"
                : notification.severity === "warning"
                ? "rgba(237, 108, 2, 0.2)"
                : "rgba(211, 47, 47, 0.2)",
            borderRadius: 1,
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AttendanceReport;
