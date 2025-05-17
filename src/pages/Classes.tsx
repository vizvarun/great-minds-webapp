// @ts-nocheck

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Modal,
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
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
} from "../services/classService";
import type { Class } from "../services/classService";

// Mock data for classes
interface Subject {
  id: number;
  name: string;
}

const mockSubjects: Subject[] = [
  { id: 1, name: "English" },
  { id: 2, name: "Hindi" },
  { id: 3, name: "Mathematics" },
  { id: 4, name: "Science" },
  { id: 5, name: "Social Studies" },
  { id: 6, name: "Physics" },
  { id: 7, name: "Chemistry" },
  { id: 8, name: "Biology" },
  { id: 9, name: "Accountancy" },
  { id: 10, name: "Business Studies" },
  { id: 11, name: "Economics" },
  { id: 12, name: "History" },
  { id: 13, name: "Political Science" },
  { id: 14, name: "Geography" },
];

const Classes = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);

  // New states for handling class operations
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);

  // State for delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);

  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
    timestamp: Date.now(),
  });

  // State for class modal
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [classFormData, setClassFormData] = useState<{ name: string }>({
    name: "",
  });

  // Fetch classes when component mounts
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await getClasses();
      setClasses(response.data);
      setTotalRecords(response.total_records);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to load classes",
        severity: "error",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter classes based on search query
  const filteredClasses = classes.filter((cls) =>
    cls.classname.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Handle class name input change
  const handleClassNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassFormData({
      name: e.target.value,
    });
  };

  // Open modal to add a new class
  const handleAddClass = () => {
    setIsEditMode(false);
    setClassFormData({ name: "" });
    setIsClassModalOpen(true);
  };

  // Open modal to edit an existing class
  const handleEditClass = (id: number) => {
    const classToEdit = classes.find((cls) => cls.id === id);
    if (classToEdit) {
      setIsEditMode(true);
      setClassFormData({ name: classToEdit.classname });
      setSelectedClass(classToEdit);
      setIsClassModalOpen(true);
    }
  };

  // Close the class form modal
  const handleCloseClassModal = () => {
    setIsClassModalOpen(false);
    setSelectedClass(null);
  };

  // Prepare to delete a class - show confirmation modal
  const handleDeleteClick = (cls: Class) => {
    setClassToDelete(cls);
    setIsDeleteModalOpen(true);
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setClassToDelete(null);
  };

  // Confirm and perform deletion
  const handleConfirmDelete = async () => {
    if (classToDelete) {
      try {
        await deleteClass(classToDelete.id);

        // Refresh classes after delete
        fetchClasses();

        setNotification({
          open: true,
          message: `${classToDelete.classname} has been deleted`,
          severity: "success",
          timestamp: Date.now(),
        });

        setIsDeleteModalOpen(false);
        setClassToDelete(null);
      } catch (error) {
        setNotification({
          open: true,
          message: "Failed to delete class",
          severity: "error",
          timestamp: Date.now(),
        });
      }
    }
  };

  // Save new class or update existing one
  const handleSaveClass = async () => {
    if (!classFormData.name.trim()) {
      setNotification({
        open: true,
        message: "Class name cannot be empty",
        severity: "error",
        timestamp: Date.now(),
      });
      return;
    }

    try {
      if (isEditMode && selectedClass) {
        // Update existing class
        await updateClass({
          ...selectedClass,
          classname: classFormData.name,
        });

        // Refresh classes after update
        fetchClasses();

        setNotification({
          open: true,
          message: `Class "${classFormData.name}" has been updated`,
          severity: "success",
          timestamp: Date.now(),
        });
      } else {
        // Add new class
        await createClass({
          classname: classFormData.name,
          isactive: true,
        });

        // Refresh classes after adding
        fetchClasses();

        setNotification({
          open: true,
          message: `Class "${classFormData.name}" has been added`,
          severity: "success",
          timestamp: Date.now(),
        });
      }

      handleCloseClassModal();
    } catch (error) {
      setNotification({
        open: true,
        message: isEditMode ? "Failed to update class" : "Failed to add class",
        severity: "error",
        timestamp: Date.now(),
      });
    }
  };

  const handleDownloadClass = (id: number) => {
    const cls = classes.find((c) => c.id === id);
    if (cls) {
      setNotification({
        open: true,
        message: `Downloading data for ${cls.classname}`,
        severity: "info",
        timestamp: Date.now(),
      });
    }
    // Implement actual download functionality if needed
  };

  const handleOpenSubjectMapping = (cls: Class) => {
    setSelectedClass(cls);
    setSelectedSubjects([...cls.subjectIds]);
    setModalOpen(true);
  };

  const handleCloseSubjectMapping = () => {
    setModalOpen(false);
    setSelectedClass(null);
  };

  const handleSubjectCheckboxChange = (subjectId: number) => {
    setSelectedSubjects((prevSelected) => {
      if (prevSelected.includes(subjectId)) {
        return prevSelected.filter((id) => id !== subjectId);
      } else {
        return [...prevSelected, subjectId];
      }
    });
  };

  const handleSaveSubjectMapping = () => {
    if (selectedClass) {
      // Update the class data with new subject mapping
      const updatedClasses = classes.map((cls) => {
        if (cls.id === selectedClass.id) {
          return { ...cls, subjectIds: selectedSubjects };
        }
        return cls;
      });

      setClasses(updatedClasses);

      setNotification({
        open: true,
        message: `Subjects updated for ${selectedClass.classname}`,
        severity: "success",
        timestamp: Date.now(),
      });
    }
    handleCloseSubjectMapping();
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
        height: "calc(100% - 16px)", // Account for the parent padding
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent the Paper component from scrolling
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
          Classes
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
            placeholder="Search classes..."
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
            onClick={handleAddClass}
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
            Add Class
          </Button>
        </Box>
      </Box>

      {/* Scrollable Table Container - ONLY this should scroll */}
      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{
          borderRadius: 0.5,
          flex: 1,
          overflow: "auto", // This element should scroll
          height: "100%", // Take full height of parent
          maxHeight: "calc(100% - 120px)", // Account for header and pagination
        }}
      >
        <Table stickyHeader sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              <TableCell
                sx={{ fontWeight: 600, bgcolor: "grey.50", width: "70%" }}
              >
                Class
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
            {filteredClasses
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((cls) => (
                <TableRow
                  key={cls.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)", // Very subtle hover
                    },
                    transition: "none",
                  }}
                >
                  <TableCell>{cls.classname || "-"}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenSubjectMapping(cls)}
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
                        <MenuBookIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClass(cls.id)}
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
                        onClick={() => handleDownloadClass(cls.id)}
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
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(cls)}
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
            {filteredClasses.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                  No classes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Fixed Pagination Section */}
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        count={filteredClasses.length}
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

      {/* Subject Mapping Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseSubjectMapping}
        aria-labelledby="subject-mapping-modal"
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
            maxWidth: "90%",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              Subject Mapping: {selectedClass?.classname}
            </Typography>
            <IconButton
              onClick={handleCloseSubjectMapping}
              sx={{
                transition: "none",
                "&:hover": {
                  bgcolor: "transparent",
                  opacity: 0.9, // More subtle opacity change (was 0.7)
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}>
            <FormGroup>
              {mockSubjects.map((subject) => (
                <FormControlLabel
                  key={subject.id}
                  control={
                    <Checkbox
                      checked={selectedSubjects.includes(subject.id)}
                      onChange={() => handleSubjectCheckboxChange(subject.id)}
                      sx={{
                        transition: "none",
                        "&:hover": { bgcolor: "transparent" },
                      }}
                    />
                  }
                  label={subject.name}
                  sx={{ mb: 1 }}
                />
              ))}
            </FormGroup>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleCloseSubjectMapping}
              sx={{
                textTransform: "none",
                transition: "none",
                borderRadius: 0.5, // Consistent with other buttons
                "&:hover": {
                  bgcolor: "transparent",
                  borderColor: "primary.main", // Keep border color consistent
                  opacity: 0.9,
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handleSaveSubjectMapping}
              sx={{
                textTransform: "none",
                backgroundImage: "none",
                borderRadius: 0.5, // Consistent with other buttons
                transition: "none",
                background: "primary.main",
                "&:hover": {
                  backgroundImage: "none",
                  background: "primary.main", // Keep background consistent
                  opacity: 0.9,
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Add/Edit Class Modal */}
      <Modal
        open={isClassModalOpen}
        onClose={handleCloseClassModal}
        aria-labelledby="class-modal"
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
            maxWidth: "90%",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              {isEditMode ? "Edit Class" : "Add New Class"}
            </Typography>
            <IconButton
              onClick={handleCloseClassModal}
              sx={{
                transition: "none",
                "&:hover": {
                  bgcolor: "transparent",
                  opacity: 0.9,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Class Name
            </Typography>
            <TextField
              autoFocus
              fullWidth
              value={classFormData.name}
              onChange={handleClassNameChange}
              placeholder="Enter class name"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 0.5,
                },
              }}
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleCloseClassModal}
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
              onClick={handleSaveClass}
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
              Save
            </Button>
          </Box>
        </Paper>
      </Modal>

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
              <strong>{classToDelete?.classname}</strong>? This action cannot be
              undone.
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
            borderColor: (theme) =>
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

export default Classes;
