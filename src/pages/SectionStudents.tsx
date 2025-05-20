import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  getStudentsBySection,
  addStudentsToSection,
} from "../services/studentService";
import AddStudentsModal from "../components/AddStudentsModal";
import type { Student } from "../services/studentService";
import api from "../services/api";
import AuthService from "../services/auth";

const SectionStudents = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sectionId, className, sectionName } = location.state || {};

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Add students modal state
  const [isAddStudentsModalOpen, setIsAddStudentsModalOpen] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
    timestamp: Date.now(),
  });

  useEffect(() => {
    fetchStudents();
  }, [sectionId]);

  const fetchStudents = async () => {
    if (!sectionId) {
      setError("Section ID is missing");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getStudentsBySection(sectionId);
      setStudents(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(null); // Don't show error to user, just show empty state
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.lastname &&
        student.lastname.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.enrollmentno &&
        student.enrollmentno.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page (sections)
  };

  const handleAddStudent = () => {
    setIsAddStudentsModalOpen(true);
  };

  const handleAddStudentsSubmit = async (studentIds: number[]) => {
    if (studentIds.length === 0 || !sectionId) return;

    setLoading(true);
    try {
      const success = await addStudentsToSection(sectionId, studentIds);

      if (success) {
        setNotification({
          open: true,
          message: `${studentIds.length} ${
            studentIds.length === 1 ? "student" : "students"
          } added to section successfully`,
          severity: "success",
          timestamp: Date.now(),
        });

        // Refresh the students list
        fetchStudents();
      } else {
        throw new Error("Failed to add students");
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to add students to section",
        severity: "error",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
      setIsAddStudentsModalOpen(false);
    }
  };

  const handleToggleStudentStatus = async (student: Student) => {
    if (!sectionId) return;

    setLoading(true);
    try {
      const user_id = AuthService.getUserId() || 14;
      const school_id = AuthService.getSchoolId() || 4;

      // Call the API to toggle student status
      const response = await api.put(
        `/section/remove-student?section_id=${sectionId}&student_ids=${student.id}&user_id=${user_id}&school_id=${school_id}`
      );

      // Check for success response
      if (response.data) {
        // Show success notification
        setNotification({
          open: true,
          message: `${student.firstname} ${
            student.lastname || ""
          } removed from section successfully`,
          severity: "success",
          timestamp: Date.now(),
        });

        // Refresh the student list after a short delay to allow the API to update
        setTimeout(() => {
          fetchStudents();
        }, 300);
      } else {
        throw new Error("Failed to remove student from section");
      }
    } catch (error) {
      console.error("Error updating student status:", error);
      setNotification({
        open: true,
        message: "Failed to remove student from section",
        severity: "error",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Get full name helper function
  const getFullName = (student: Student) => {
    return (
      `${student.firstname || ""} ${
        student.middlename ? student.middlename + " " : ""
      }${student.lastname || ""}`.trim() || "-"
    );
  };

  // Add this function to handle closing notifications
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
      {/* Header Section */}
      <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          variant="text"
          sx={{
            mr: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
            outline: "none",
            "&:focus": {
              outline: "none",
            },
          }}
        >
          Back
        </Button>
        <Typography
          variant="h5"
          sx={{ fontWeight: 500, color: "text.primary" }}
        >
          Students - {className} {sectionName}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Search and Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          placeholder="Search students..."
          variant="outlined"
          size="medium"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            minWidth: 250,
            flex: 1,
            maxWidth: 400,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          onClick={handleAddStudent}
          sx={{
            textTransform: "none",
            borderRadius: 0.5,
            backgroundImage: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundImage: "none",
              opacity: 0.9,
            },
          }}
        >
          Add Students
        </Button>
      </Box>

      {/* Students Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{
          borderRadius: 0.5,
          flex: 1,
          overflow: "auto",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                  Enrollment No.
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                  Name
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "15%" }}
                  align="center"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student) => (
                  <TableRow
                    key={student.id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  >
                    <TableCell>{student.enrollmentno || "-"}</TableCell>
                    <TableCell>{getFullName(student)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Box
                          sx={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={student.isactive !== false}
                            onChange={() => handleToggleStudentStatus(student)}
                            style={{
                              appearance: "none",
                              WebkitAppearance: "none",
                              MozAppearance: "none",
                              width: "30px",
                              height: "18px",
                              borderRadius: "10px",
                              background:
                                student.isactive !== false
                                  ? "#0cb5bf"
                                  : "#e0e0e0",
                              outline: "none",
                              cursor: "pointer",
                              position: "relative",
                              transition: "background 0.25s ease",
                              border: "1px solid",
                              borderColor:
                                student.isactive !== false
                                  ? "#0cb5bf"
                                  : "#d0d0d0",
                              pointerEvents: loading ? "none" : "auto",
                            }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              left: student.isactive !== false ? "18px" : "2px",
                              width: "14px",
                              height: "14px",
                              borderRadius: "50%",
                              background: "#ffffff",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                              transition: "left 0.25s ease",
                              pointerEvents: "none",
                              top: "50%",
                              marginTop: "-7px",
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredStudents.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    No students found for this section.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        count={filteredStudents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          flexShrink: 0,
          borderTop: 1,
          borderColor: "grey.200",
          mt: 1,
        }}
      />

      {/* Add Students Modal - Pass existing students to filter them out */}
      <AddStudentsModal
        open={isAddStudentsModalOpen}
        onClose={() => setIsAddStudentsModalOpen(false)}
        onSubmit={handleAddStudentsSubmit}
        sectionId={sectionId}
        existingStudents={students}
      />

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
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default SectionStudents;
