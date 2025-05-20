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
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  getStudentsBySection,
  removeStudentFromSection,
  addStudentsToSection,
} from "../services/studentService";
import AddStudentsModal from "../components/AddStudentsModal";
import type { Student } from "../services/studentService";

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

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

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

  const handleEditStudent = (student: Student) => {
    console.log("Edit student assignment:", student.id);
    // Open edit modal for this student
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (studentToDelete && sectionId) {
      try {
        const success = await removeStudentFromSection(
          studentToDelete.id,
          sectionId
        );

        if (success) {
          // Update local state
          setStudents(students.filter((s) => s.id !== studentToDelete.id));

          setNotification({
            open: true,
            message: `${studentToDelete.firstname} ${studentToDelete.lastname} removed from section`,
            severity: "success",
            timestamp: Date.now(),
          });
        } else {
          throw new Error("Failed to remove student");
        }
      } catch (error) {
        setNotification({
          open: true,
          message: "Failed to remove student from section",
          severity: "error",
          timestamp: Date.now(),
        });
      }

      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Get full name helper function
  const getFullName = (student: Student) => {
    return (
      `${student.firstname || ""} ${
        student.middlename ? student.middlename + " " : ""
      }${student.lastname || ""}`.trim() || "-"
    );
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
                  Actions
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
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(student)}
                          color="error"
                          sx={{
                            "&:hover": {
                              bgcolor: "rgba(211, 47, 47, 0.04)",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
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

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-confirmation-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: 400,
            maxWidth: "95%",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
            outline: "none",
          }}
        >
          <Box
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Confirm Removal
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
              Are you sure you want to remove{" "}
              <strong>
                {studentToDelete ? getFullName(studentToDelete) : ""}
              </strong>{" "}
              from this section?
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCancelDelete}
                disableRipple
                sx={{
                  flex: 1,
                  textTransform: "none",
                  borderRadius: 0.5,
                  backgroundColor: "transparent",
                  outline: "none",
                  border: "1px solid",
                  borderColor: "grey.300",
                  color: "text.primary",
                  transition: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    borderColor: "grey.400",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmDelete}
                disableElevation
                disableRipple
                sx={{
                  flex: 1,
                  textTransform: "none",
                  borderRadius: 0.5,
                  background: "error.main",
                  color: "white",
                  transition: "none",
                  "&:hover": {
                    background: "error.dark",
                  },
                }}
              >
                Remove
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>

      {/* Add Students Modal - Pass existing students to filter them out */}
      <AddStudentsModal
        open={isAddStudentsModalOpen}
        onClose={() => setIsAddStudentsModalOpen(false)}
        onSubmit={handleAddStudentsSubmit}
        sectionId={sectionId}
        existingStudents={students} // Pass existing students to filter them out
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
