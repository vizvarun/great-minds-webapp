// @ts-nocheck

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useState } from "react";

// Mock data for classes
const mockClasses = [
  { id: 1, name: "Class 1" },
  { id: 2, name: "Class 2" },
  { id: 3, name: "Class 3" },
  { id: 4, name: "Class 4" },
  { id: 5, name: "Class 5" },
  { id: 6, name: "Class 6" },
  { id: 7, name: "Class 7" },
  { id: 8, name: "Class 8" },
  { id: 9, name: "Class 9" },
  { id: 10, name: "Class 10" },
];

// Mock data for sections
const mockSectionsMap: Record<number, { id: number; name: string }[]> = {
  1: [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
  ],
  2: [
    { id: 3, name: "A" },
    { id: 4, name: "B" },
  ],
  3: [
    { id: 5, name: "A" },
    { id: 6, name: "B" },
    { id: 7, name: "C" },
  ],
  4: [{ id: 8, name: "A" }],
  5: [
    { id: 9, name: "A" },
    { id: 10, name: "B" },
  ],
  6: [{ id: 11, name: "A" }],
  7: [{ id: 12, name: "A" }],
  8: [{ id: 13, name: "A" }],
  9: [{ id: 14, name: "A" }],
  10: [
    { id: 15, name: "A" },
    { id: 16, name: "B" },
  ],
};

// Student attendance interface
interface StudentAttendance {
  id: number;
  name: string;
  rollNumber: string;
  daysPresent: number;
  daysAbsent: number;
  totalWorkingDays: number;
  attendancePercentage: number;
}

// Mock function to generate attendance data
const generateMockAttendanceData = (
  classId: number,
  sectionId: number,
  monthYear: string
): StudentAttendance[] => {
  // Parse the month and year
  const [year, month] = monthYear.split("-").map(Number);

  // Calculate total working days (mock data)
  const totalDays = new Date(year, month, 0).getDate();
  const workingDays = Math.min(totalDays - 4, 22); // Exclude weekends and some holidays

  // Generate 10-15 students with random attendance records
  const numberOfStudents = Math.floor(Math.random() * 6) + 10;

  return Array.from({ length: numberOfStudents }, (_, i) => {
    const daysPresent = Math.floor(Math.random() * (workingDays + 1));
    const daysAbsent = workingDays - daysPresent;
    const attendancePercentage = Math.round((daysPresent / workingDays) * 100);

    return {
      id: i + 1,
      name: `Student ${i + 1}`,
      rollNumber: `${classId}${sectionId}${(i + 1)
        .toString()
        .padStart(2, "0")}`,
      daysPresent,
      daysAbsent,
      totalWorkingDays: workingDays,
      attendancePercentage,
    };
  });
};

// Format date for display
const formatMonthYear = (monthYearString: string): string => {
  if (!monthYearString) return "";

  const [year, month] = monthYearString.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

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
  const [sections, setSections] = useState<{ id: number; name: string }[]>([]);

  // Report state
  const [reportGenerated, setReportGenerated] = useState(false);
  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([]);
  const [reportDetails, setReportDetails] = useState({
    className: "",
    sectionName: "",
    monthYear: "",
  });

  // Update sections when class changes
  useEffect(() => {
    if (selectedClass) {
      const classId = parseInt(selectedClass);
      setSections(mockSectionsMap[classId] || []);
    } else {
      setSections([]);
    }
    setSelectedSection("");
  }, [selectedClass]);

  // Handle form input changes
  const handleClassChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value);
    setReportGenerated(false);
  };

  const handleSectionChange = (event: SelectChangeEvent) => {
    setSelectedSection(event.target.value);
    setReportGenerated(false);
  };

  const handleMonthYearChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedMonthYear(event.target.value);
    setReportGenerated(false);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedClass || !selectedSection || !selectedMonthYear) return;

    const classId = parseInt(selectedClass);
    const sectionId = parseInt(selectedSection);

    // Get class and section names for display
    const className = mockClasses.find((c) => c.id === classId)?.name ?? "";
    const sectionName = sections.find((s) => s.id === sectionId)?.name ?? "";

    // Generate attendance data
    const data = generateMockAttendanceData(
      classId,
      sectionId,
      selectedMonthYear
    );

    setAttendanceData(data);
    setReportDetails({
      className,
      sectionName,
      monthYear: formatMonthYear(selectedMonthYear),
    });
    setReportGenerated(true);
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

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Class
              </Typography>
            </Box>
            <FormControl fullWidth size="medium" sx={{ minWidth: "100%" }}>
              <Select
                labelId="class-select-label"
                id="class-select"
                value={selectedClass}
                displayEmpty
                notched={false}
                onChange={handleClassChange}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      width: "auto",
                      minWidth: "100%",
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                }}
                sx={{
                  transition: "none",
                  paddingRight: 2,
                  "& .MuiSelect-select": {
                    paddingRight: 4,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select a class</em>
                </MenuItem>
                {mockClasses.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Section
              </Typography>
            </Box>
            <FormControl
              fullWidth
              disabled={!selectedClass}
              size="medium"
              sx={{ minWidth: "100%" }}
            >
              <Select
                labelId="section-select-label"
                id="section-select"
                value={selectedSection}
                displayEmpty
                notched={false}
                onChange={handleSectionChange}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      width: "auto",
                      minWidth: "100%",
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                }}
                sx={{
                  transition: "none",
                  paddingRight: 2,
                  "& .MuiSelect-select": {
                    paddingRight: 4,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select a section</em>
                </MenuItem>
                {sections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Month and Year
              </Typography>
            </Box>
            <TextField
              value={selectedMonthYear}
              onChange={handleMonthYearChange}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  type: "month",
                },
              }}
              sx={{
                transition: "none",
                "& .MuiOutlinedInput-root": {
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                },
              }}
              placeholder="Select month and year"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            disableElevation
            onClick={handleSubmit}
            disabled={!selectedClass || !selectedSection || !selectedMonthYear}
            sx={{
              textTransform: "none",
              borderRadius: 0.5,
              transition: "none",
              backgroundImage: "none",
              background: "primary.main",
              boxShadow: "none",
              "&:hover": {
                backgroundImage: "none",
                background: "primary.main",
                opacity: 0.9,
              },
            }}
          >
            Generate Report
          </Button>
        </Box>
      </Box>

      {reportGenerated && (
        <>
          <Divider sx={{ my: 3 }} />

          <Box mb={2} display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" fontWeight={500}>
              Monthly Attendance Report:
            </Typography>
            <Chip
              label={`${reportDetails.className} ${reportDetails.sectionName}`}
              color="primary"
              size="small"
              sx={{ fontWeight: 500 }}
            />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {reportDetails.monthYear}
            </Typography>
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            variant="outlined"
            sx={{
              flex: 1,
              overflow: "auto",
              borderRadius: 0.5,
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                    Roll No.
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                    Name
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: "grey.50", width: 130 }}
                    align="center"
                  >
                    Days Present
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: "grey.50", width: 130 }}
                    align="center"
                  >
                    Days Absent
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: "grey.50", width: 130 }}
                    align="center"
                  >
                    Working Days
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: "grey.50", width: 150 }}
                    align="center"
                  >
                    Attendance %
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((student) => (
                  <TableRow
                    key={student.id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                      transition: "none",
                    }}
                  >
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell align="center">{student.daysPresent}</TableCell>
                    <TableCell align="center">{student.daysAbsent}</TableCell>
                    <TableCell align="center">
                      {student.totalWorkingDays}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${student.attendancePercentage}%`}
                        size="small"
                        color={
                          student.attendancePercentage >= 75
                            ? "success"
                            : student.attendancePercentage >= 50
                            ? "warning"
                            : "error"
                        }
                        sx={{
                          minWidth: 60,
                          transition: "none",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {attendanceData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      No attendance data found for the selected criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Paper>
  );
};

export default AttendanceReport;
