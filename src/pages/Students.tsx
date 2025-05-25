//@ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import PaymentsIcon from "@mui/icons-material/Payments";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ClearIcon from "@mui/icons-material/Clear"; // Add this import
import StudentFormModal from "../components/StudentFormModal";
import StudentFeesModal from "../components/StudentFeesModal";
import AddParentModal from "../components/AddParentModal";
import BulkUploadModal from "../components/BulkUploadModal";
import CustomSpinner from "../components/CustomSpinner";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  toggleStudentStatus,
  getStudentTemplate,
  bulkUploadStudents,
} from "../services/studentService";
import type { Student } from "../services/studentService";
import { useDebounce } from "../hooks/useDebounce";

const Students = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce search query with 500ms delay
  const [students, setStudents] = useState<Student[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
    timestamp: 0,
  });

  // Add state for the delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Add state for the parent modal
  const [parentModalOpen, setParentModalOpen] = useState(false);
  const [selectedStudentForParent, setSelectedStudentForParent] =
    useState<Student | null>(null);

  // Add state for the bulk upload modal and template URL
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);

  // Fetch students and template on component mount
  useEffect(() => {
    fetchStudents();
    fetchTemplateUrl();
  }, [page, rowsPerPage, debouncedSearchQuery]); // Add debouncedSearchQuery as a dependency

  const fetchStudents = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      // Pass the debounced search query to getStudents
      const data = await getStudents(page, rowsPerPage, debouncedSearchQuery);

      if (data && Array.isArray(data.data)) {
        setStudents(data.data);
        setTotalRecords(data.total_records || data.data.length);
        setError(null);
      } else {
        // Don't set error when no students are found, just set empty array
        // This will show the "No students found" message instead of error
        setStudents([]);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      // Only set error for actual API failures, not empty results
      setError("Failed to load students. Please try again later.");
      setNotification({
        open: true,
        message: "Failed to load students",
        severity: "error",
        timestamp: Date.now(),
      });
      setStudents([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Add function to get template URL for download
  const fetchTemplateUrl = async () => {
    try {
      const blob = await getStudentTemplate();
      const url = URL.createObjectURL(blob);
      setTemplateUrl(url);
    } catch (error) {
      console.error("Error getting template:", error);
    }
  };

  // Update search handler
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    setPage(0); // Reset to first page when searching
  };

  // Since search is now handled by the server, we'll use the students array directly
  // instead of filtering locally
  const filteredStudents = students;

  // Handle pagination
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle adding a new student
  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsEditMode(false);
    setIsFormModalOpen(true);
  };

  // Handle editing a student
  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditMode(true);
    setIsFormModalOpen(true);
  };

  // Handle toggling student status with API call
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await toggleStudentStatus(id, currentStatus);

      // Update local state
      const updatedStudents = students.map((student) =>
        student.id === id ? { ...student, isActive: !currentStatus } : student
      );
      setStudents(updatedStudents);

      // Get student details for notification message
      const student = students.find((s) => s.id === id);
      if (student) {
        // Close any existing notification first
        setNotification((prev) => ({ ...prev, open: false }));

        // Then set a new one after a brief delay to ensure DOM update
        setTimeout(() => {
          setNotification({
            open: true,
            message: `${student.firstName} ${
              student.lastName
            } status has been ${!currentStatus ? "activated" : "deactivated"}`,
            severity: !currentStatus ? "success" : "info",
            timestamp: Date.now(),
          });
        }, 100);
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to update student status",
        severity: "error",
        timestamp: Date.now(),
      });
    }
  };

  // Update delete handling to show confirmation first
  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  // Actual delete function after confirmation
  const handleConfirmDelete = async () => {
    if (studentToDelete) {
      try {
        await deleteStudent(studentToDelete.id);

        const updatedStudents = students.filter(
          (student) => student.id !== studentToDelete.id
        );
        setStudents(updatedStudents);

        setNotification({
          open: true,
          message: `${studentToDelete.firstName} ${studentToDelete.lastName} has been deleted`,
          severity: "success",
          timestamp: Date.now(),
        });
      } catch (error) {
        setNotification({
          open: true,
          message: "Failed to delete student",
          severity: "error",
          timestamp: Date.now(),
        });
      } finally {
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
      }
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  // Handle viewing student fees
  const handleViewFees = (student: Student) => {
    setSelectedStudent(student);
    setIsFeesModalOpen(true);
  };

  // Handle adding parent
  const handleAddParent = (student: Student) => {
    setSelectedStudentForParent(student);
    setParentModalOpen(true);
  };

  // Handle parent submission
  const handleAddParentSubmit = async (data: any) => {
    try {
      // Success message will be handled inside the modal
      // Refresh student data if needed
      fetchStudents();

      // Close the modal
      setParentModalOpen(false);
    } catch (error) {
      console.error("Error handling parent:", error);
      setNotification({
        open: true,
        message: "Failed to process parent contact",
        severity: "error",
        timestamp: Date.now(),
      });
    }
  };

  // Handle form submission (add/edit)
  const handleStudentSubmit = async (studentData: any) => {
    setLoading(true);
    try {
      if (isEditMode && selectedStudent) {
        await fetchStudents();
      } else {
        const result = await createStudent(studentData);
        if (result && result.id) {
          await fetchStudents();
          setNotification({
            open: true,
            message: "Student added successfully",
            severity: "success",
            timestamp: Date.now(),
          });
        } else {
          throw new Error("Failed to create student");
        }
      }

      // Close modal after successful operation
      setIsFormModalOpen(false);
    } catch (error) {
      console.error("Error in student operation:", error);
      console.log("Error details:", error.response?.data || error.message);
      setNotification({
        open: true,
        message: error.response?.data?.detail || "Something went wrong",
        severity: "error",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Add function to handle bulk upload button click
  const handleBulkUpload = () => {
    setIsBulkUploadModalOpen(true);
  };

  // Add function to handle closing the bulk upload modal
  const handleCloseBulkUploadModal = () => {
    setIsBulkUploadModalOpen(false);
  };

  // Add function to handle successful bulk upload
  const handleBulkUploadSuccess = async (file: File) => {
    try {
      setLoading(true);
      await bulkUploadStudents(file);

      // Refresh student list after successful upload
      await fetchStudents();

      setNotification({
        open: true,
        message: `Students uploaded successfully`,
        severity: "success",
        timestamp: Date.now(),
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to upload students",
        severity: "error",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle closing the notification
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
      <Box sx={{ mb: 3, flexShrink: 0 }}>
        <Typography
          variant="h5"
          gutterBottom
          mb={2}
          sx={{ fontWeight: 500, color: "text.primary" }}
        >
          Students
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              outline: "none",
              "&:focus": {
                outline: "none",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              // Show loading indicator when searching, or clear button when there's a search query
              endAdornment:
                debouncedSearchQuery !== searchQuery ? (
                  <InputAdornment position="end">
                    <CustomSpinner
                      size={20}
                      color="rgba(0, 0, 0, 0.54)"
                      thickness={2}
                    />
                  </InputAdornment>
                ) : searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label="clear search"
                      onClick={() => setSearchQuery("")}
                      edge="end"
                      sx={{
                        color: "rgba(0, 0, 0, 0.54)",
                        p: 0.5,
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
            }}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
              onClick={handleAddStudent}
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
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              Add Student
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileUploadIcon />}
              onClick={handleBulkUpload}
              sx={{
                textTransform: "none",
                borderRadius: 0.5,
                transition: "none",
                outline: "none",
                "&:hover": {
                  bgcolor: "transparent",
                  borderColor: "primary.main",
                  outline: "none",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              Bulk Upload
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Table Container */}
      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{
          borderRadius: 0.5,
          flex: 1,
          overflow: "auto",
          height: "100%",
          maxHeight: "calc(100% - 120px)",
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
            {/* Replace the main loading indicator with our custom spinner */}
            <CustomSpinner size={40} color="#1976d2" thickness={3} />
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 4,
            }}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "15%" }}
                >
                  Enrollment No.
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "15%" }}
                >
                  First Name
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "15%" }}
                >
                  Last Name
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "15%" }}
                >
                  Phone No.
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "15%" }}
                >
                  Gender
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "15%" }}
                >
                  City
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "15%" }}
                  align="center"
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "10%" }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
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
                    <TableCell>
                      {student.enrollmentNo ||
                        `ST-${student.id.toString().padStart(4, "0")}`}
                    </TableCell>
                    <TableCell>{student.firstName || "-"}</TableCell>
                    <TableCell>{student.lastName || "-"}</TableCell>
                    <TableCell>
                      {student.mobileNo || student.phoneNumber || "-"}
                    </TableCell>
                    <TableCell>
                      {student.gender
                        ? student.gender === "M"
                          ? "Male"
                          : "Female"
                        : "-"}
                    </TableCell>
                    <TableCell>{student.city || "-"}</TableCell>
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
                            checked={student.isActive}
                            onChange={() =>
                              handleToggleStatus(student.id, student.isActive)
                            }
                            style={{
                              appearance: "none",
                              WebkitAppearance: "none",
                              MozAppearance: "none",
                              width: "30px",
                              height: "18px",
                              borderRadius: "10px",
                              background: student.isActive
                                ? "#0cb5bf"
                                : "#e0e0e0",
                              outline: "none",
                              cursor: "pointer",
                              position: "relative",
                              transition: "background 0.25s ease",
                              border: "1px solid",
                              borderColor: student.isActive
                                ? "#0cb5bf"
                                : "#d0d0d0",
                            }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              left: student.isActive ? "18px" : "2px",
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
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditStudent(student)}
                          color="primary"
                          sx={{
                            transition: "none",
                            outline: "none",
                            "&:hover": {
                              bgcolor: "rgba(25, 118, 210, 0.04)",
                            },
                            "&:focus": {
                              outline: "none",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleViewFees(student)}
                          color="primary"
                          sx={{
                            transition: "none",
                            outline: "none",
                            "&:hover": {
                              bgcolor: "rgba(25, 118, 210, 0.04)",
                            },
                            "&:focus": {
                              outline: "none",
                            },
                          }}
                        >
                          <PaymentsIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleAddParent(student)}
                          color="primary"
                          sx={{
                            transition: "none",
                            outline: "none",
                            "&:hover": {
                              bgcolor: "rgba(25, 118, 210, 0.04)",
                            },
                            "&:focus": {
                              outline: "none",
                            },
                          }}
                        >
                          <PersonAddIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(student)}
                          color="error"
                          sx={{
                            transition: "none",
                            outline: "none",
                            "&:hover": {
                              bgcolor: "rgba(211, 47, 47, 0.04)",
                            },
                            "&:focus": {
                              outline: "none",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        py: 4,
                      }}
                    >
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {debouncedSearchQuery
                          ? `No students found matching "${debouncedSearchQuery}"`
                          : "No students found"}
                      </Typography>
                      {debouncedSearchQuery && (
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => setSearchQuery("")}
                          sx={{ mt: 1, textTransform: "none" }}
                        >
                          Clear search
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination Section */}
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          flexShrink: 0,
          borderTop: 1,
          borderColor: "grey.200",
          mt: 1,
          "& .MuiButtonBase-root": {
            transition: "none",
            "&:hover": {
              bgcolor: "transparent",
              opacity: 0.8,
            },
          },
        }}
      />

      {/* Student Form Modal */}
      <StudentFormModal
        open={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleStudentSubmit}
        student={selectedStudent as any}
        isEditMode={isEditMode}
      />

      {/* Student Fees Modal */}
      <StudentFeesModal
        open={isFeesModalOpen}
        onClose={() => setIsFeesModalOpen(false)}
        student={selectedStudent}
      />

      {/* Add Parent Modal */}
      <AddParentModal
        open={parentModalOpen}
        onClose={() => setParentModalOpen(false)}
        onSubmit={handleAddParentSubmit}
        studentId={selectedStudentForParent?.id}
        studentName={
          selectedStudentForParent
            ? `${selectedStudentForParent.firstName} ${selectedStudentForParent.lastName}`
            : ""
        }
      />

      {/* Add Bulk Upload Modal */}
      <BulkUploadModal
        open={isBulkUploadModalOpen}
        onClose={handleCloseBulkUploadModal}
        onUploadSuccess={handleBulkUploadSuccess}
        entityType="Students"
        templateUrl={templateUrl || undefined}
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
              Confirm Deletion
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
              Are you sure you want to delete{" "}
              <strong>
                {studentToDelete?.firstName} {studentToDelete?.lastName}
              </strong>
              ? This action cannot be undone.
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
                Delete
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>

      {/* Notification Snackbar */}
      <Snackbar
        key={notification.timestamp}
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            minWidth: "100%",
          },
        }}
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
            "& .MuiAlert-icon": {
              opacity: 0.8,
            },
            "& .MuiAlert-message": {
              fontSize: "0.875rem",
            },
            "& .MuiAlert-action": {
              paddingTop: 0,
              alignItems: "flex-start",
            },
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Students;
