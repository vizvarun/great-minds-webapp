import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "../services/subjectService";
import type { Subject } from "../services/subjectService";

const Subjects = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [editSubjectId, setEditSubjectId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  // Toast notification states
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  // Fetch subjects on component mount and when pagination changes
  useEffect(() => {
    fetchSubjects();
  }, [page, rowsPerPage]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await getSubjects(page, rowsPerPage);
      setSubjects(response.subjects || []);
      setTotalRecords(response.total_records || 0);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      showToast("Failed to load subjects", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter((subject) =>
    subject && subject.subjectName 
      ? subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
      : false
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
    // Don't reset page for client-side filtering
  };

  const handleAddSubject = () => {
    setIsEditMode(false);
    setSubjectName("");
    setEditSubjectId(null);
    setError("");
    setModalOpen(true);
  };

  const handleEditSubject = (id: number) => {
    const subject = subjects.find((s) => s.id === id);
    if (subject) {
      setIsEditMode(true);
      setSubjectName(subject.subjectName);
      setEditSubjectId(id);
      setError("");
      setModalOpen(true);
    }
  };

  const handleDeleteSubject = (id: number) => {
    const subject = subjects.find((s) => s.id === id);
    setSubjectToDelete(subject || null);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (subjectToDelete) {
      try {
        await deleteSubject(subjectToDelete.id);
        
        // Update local state to remove the deleted subject
        setSubjects(subjects.filter((s) => s.id !== subjectToDelete.id));
        showToast(`Subject "${subjectToDelete.subjectName}" deleted`, "success");
      } catch (error) {
        showToast("Failed to delete subject", "error");
      } finally {
        setIsDeleteModalOpen(false);
        setSubjectToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSubjectToDelete(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSubjectName("");
    setEditSubjectId(null);
    setError("");
  };

  const handleModalSave = async () => {
    if (!subjectName.trim()) {
      setError("Subject name is required");
      return;
    }

    try {
      if (isEditMode && editSubjectId !== null) {
        // Update existing subject
        const updatedSubject = await updateSubject(
          editSubjectId, 
          subjectName, 
          fetchSubjects // Pass fetchSubjects as a callback to refresh data
        );
        
        // Also update the local state to ensure the UI stays consistent
        setSubjects(prevSubjects => 
          prevSubjects.map(subject => 
            subject.id === editSubjectId 
              ? { ...subject, subjectName: updatedSubject.subjectName } 
              : subject
          )
        );
        
        showToast("Subject updated successfully", "success");
      } else {
        // Add new subject
        const newSubject = await createSubject(
          subjectName, 
          fetchSubjects // Pass fetchSubjects as a callback to refresh data
        );
        
        // Also update local state
        setSubjects(prevSubjects => [...prevSubjects, newSubject]);
        
        showToast("Subject added successfully", "success");
      }
      
      // Close modal and reset state
      setModalOpen(false);
      setSubjectName("");
      setEditSubjectId(null);
      setError("");
    } catch (error) {
      showToast(
        isEditMode ? "Failed to update subject" : "Failed to add subject",
        "error"
      );
    }
  };

  const showToast = (message: string, severity: "success" | "info" | "warning" | "error") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleCloseToast = (
    _?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
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
      {/* Fixed Header Section */}
      <Box sx={{ mb: 3, flexShrink: 0 }}>
        <Typography
          variant="h5"
          gutterBottom
          mb={2}
          sx={{ fontWeight: 500, color: "text.primary" }}
        >
          Subjects
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
            placeholder="Search subjects..."
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
            }}
          />
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            onClick={handleAddSubject}
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
            Add Subject
          </Button>
        </Box>
      </Box>

      {/* Scrollable Table Container */}
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
            <CircularProgress />
          </Box>
        ) : (
          <Table stickyHeader sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "70%" }}
                >
                  Subject
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "30%" }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubjects.map((subject) => (
                <TableRow
                  key={subject.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                    transition: "none",
                  }}
                >
                  <TableCell>{subject.subjectName}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditSubject(subject.id)}
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
                        onClick={() => handleDeleteSubject(subject.id)}
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
              ))}
              {filteredSubjects.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                    No subjects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Fixed Pagination Section */}
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

      {/* Add/Edit Subject Modal */}
      {modalOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              minWidth: 440,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">
              {isEditMode ? "Edit Subject" : "Add Subject"}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Subject Name
              </Typography>
              <TextField
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                error={!!error}
                helperText={error}
                autoFocus
                fullWidth
                placeholder="Enter subject name"
                size="small"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0.5,
                  },
                }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={handleModalClose}
                sx={{
                  textTransform: "none",
                  transition: "none",
                  borderRadius: 0.5,
                  "&:hover": {
                    bgcolor: "transparent",
                    borderColor: "primary.main",
                    opacity: 0.9,
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disableElevation
                onClick={handleModalSave}
                sx={{
                  textTransform: "none",
                  backgroundImage: "none",
                  borderRadius: 0.5,
                  transition: "none",
                  background: "primary.main",
                  "&:hover": {
                    backgroundImage: "none",
                    background: "primary.main",
                    opacity: 0.9,
                  },
                }}
              >
                {isEditMode ? "Update" : "Add"}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            minWidth: "100%",
          },
        }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastSeverity}
          variant="standard"
          sx={{
            width: "100%",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            border: "1px solid",
            borderColor:
              toastSeverity === "success"
                ? "rgba(46, 125, 50, 0.2)"
                : toastSeverity === "info"
                ? "rgba(2, 136, 209, 0.2)"
                : toastSeverity === "warning"
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
          {toastMessage}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: 400,
              borderRadius: 2,
              p: 3,
              outline: "none",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Confirm Deletion
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
              Are you sure you want to delete{" "}
              <strong>{subjectToDelete?.subjectName}</strong>? This action cannot be
              undone.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancelDelete}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmDelete}
                sx={{ flex: 1 }}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Paper>
  );
};

export default Subjects;
