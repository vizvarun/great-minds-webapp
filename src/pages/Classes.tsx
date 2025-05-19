// @ts-nocheck

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
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
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getClasses, createClass, updateClass } from "../services/classService";
import {
  getSubjects,
  getClassSubjects,
  updateClassSubjects,
} from "../services/subjectService";
import type { Class } from "../services/classService";
import type { Subject } from "../services/subjectService";
import api from "../services/api";
import AuthService from "../services/auth";

const Classes = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);

  // New states for handling subjects
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [classSubjects, setClassSubjects] = useState<number[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  // New states for handling class operations
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);

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

  // Fetch classes and subjects when component mounts
  useEffect(() => {
    fetchClasses();
    fetchAllSubjects();
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

  const fetchAllSubjects = async () => {
    try {
      const subjects = await getSubjects();
      setAllSubjects(subjects);
    } catch (error) {
      console.error("Error fetching all subjects:", error);
    }
  };

  const fetchClassSubjects = async (classId: number) => {
    setSubjectsLoading(true);
    try {
      const subjects = await getClassSubjects(classId);
      // Extract just the IDs for the checkboxes
      const subjectIds = subjects.map((subject) => subject.id);
      setClassSubjects(subjectIds);
      setSelectedSubjects(subjectIds);
    } catch (error) {
      console.error("Error fetching class subjects:", error);
      setClassSubjects([]);
      setSelectedSubjects([]);
    } finally {
      setSubjectsLoading(false);
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
      const user_id = AuthService.getUserId() || 14;

      if (isEditMode && selectedClass) {
        // Update existing class with proper createdby
        await updateClass({
          ...selectedClass,
          classname: classFormData.name,
          createdby: user_id, // Include createdby in the payload
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

  const handleOpenSubjectMapping = async (cls: Class) => {
    setSelectedClass(cls);
    setModalOpen(true);
    setSubjectsLoading(true);

    try {
      // First fetch all subjects
      const allSubjectsResponse = await getSubjects(0, 1000);
      if (allSubjectsResponse && allSubjectsResponse.subjects) {
        setAllSubjects(allSubjectsResponse.subjects);
      }

      // Then fetch subjects assigned to the class
      const classSubjectsResponse = await getClassSubjects(cls.id);
      if (classSubjectsResponse) {
        // Extract just the IDs for the checkboxes
        const subjectIds = classSubjectsResponse.map((subject) => subject.id);
        setClassSubjects(subjectIds);
        setSelectedSubjects(subjectIds);
      } else {
        setClassSubjects([]);
        setSelectedSubjects([]);
      }
    } catch (error) {
      console.error("Error fetching subjects for mapping:", error);
      setNotification({
        open: true,
        message: "Failed to load subjects",
        severity: "error",
        timestamp: Date.now(),
      });
      setClassSubjects([]);
      setSelectedSubjects([]);
    } finally {
      setSubjectsLoading(false);
    }
  };

  const handleCloseSubjectMapping = () => {
    setModalOpen(false);
    setSelectedClass(null);
    setSelectedSubjects([]);
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

  const handleSaveSubjectMapping = async () => {
    if (selectedClass) {
      setSubjectsLoading(true);

      try {
        // Call API to update class subject mapping
        await updateClassSubjects(selectedClass.id, selectedSubjects);

        setNotification({
          open: true,
          message: `Subjects updated for ${selectedClass.classname}`,
          severity: "success",
          timestamp: Date.now(),
        });

        // Update local state if needed
        handleCloseSubjectMapping();
      } catch (error) {
        setNotification({
          open: true,
          message: "Failed to update subjects",
          severity: "error",
          timestamp: Date.now(),
        });
      } finally {
        setSubjectsLoading(false);
      }
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const user_id = AuthService.getUserId() || 14;
      const school_id = AuthService.getSchoolId() || 4;

      // Call the toggle status endpoint
      await api.put(
        `/classes/toggle-status?class_id=${id}&user_id=${user_id}&school_id=${school_id}`
      );

      // Refresh classes to get updated status
      await fetchClasses();

      // Show success notification
      setNotification({
        open: true,
        message: `Class status has been ${
          currentStatus ? "deactivated" : "activated"
        }`,
        severity: "success",
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error toggling class status:", error);
      setNotification({
        open: true,
        message: "Failed to update class status",
        severity: "error",
        timestamp: Date.now(),
      });
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
                sx={{ fontWeight: 600, bgcolor: "grey.50", width: "60%" }}
              >
                Class
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, bgcolor: "grey.50", width: "20%" }}
                align="center"
              >
                Status
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, bgcolor: "grey.50", width: "20%" }}
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
                      <Box
                        sx={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={cls.isactive === true}
                          onChange={() =>
                            handleToggleStatus(cls.id, cls.isactive === true)
                          }
                          style={{
                            appearance: "none",
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            width: "30px",
                            height: "18px",
                            borderRadius: "10px",
                            background:
                              cls.isactive === true ? "#0cb5bf" : "#e0e0e0",
                            outline: "none",
                            cursor: "pointer",
                            position: "relative",
                            transition: "background 0.25s ease",
                            border: "1px solid",
                            borderColor:
                              cls.isactive === true ? "#0cb5bf" : "#d0d0d0",
                            pointerEvents: loading ? "none" : "auto",
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            left: cls.isactive === true ? "18px" : "2px",
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
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {filteredClasses.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
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
                  opacity: 0.9,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {subjectsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : allSubjects.length > 0 ? (
            <Box sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}>
              {/* Select All option */}
              <Box
                sx={{
                  p: 1,
                  mb: 1,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                }}
                onClick={() => {
                  if (selectedSubjects.length === allSubjects.length) {
                    setSelectedSubjects([]);
                  } else {
                    setSelectedSubjects(allSubjects.map((s) => s.id));
                  }
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      border: "1px solid",
                      borderColor:
                        selectedSubjects.length === allSubjects.length
                          ? "primary.main"
                          : "grey.400",
                      borderRadius: 0.5,
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        selectedSubjects.length === allSubjects.length
                          ? "primary.main"
                          : "transparent",
                    }}
                  >
                    {selectedSubjects.length === allSubjects.length && (
                      <Box
                        component="span"
                        sx={{ color: "white", fontSize: "0.8rem" }}
                      >
                        ✓
                      </Box>
                    )}
                  </Box>
                  <Typography sx={{ fontWeight: 500 }}>
                    Select All Subjects
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />

              {allSubjects.map((subject) => {
                const isChecked = selectedSubjects.includes(subject.id);

                return (
                  <Box
                    key={subject.id}
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      cursor: "pointer",
                      mb: 0.5,
                      bgcolor: isChecked
                        ? "rgba(25, 118, 210, 0.08)"
                        : "transparent",
                      "&:hover": {
                        bgcolor: isChecked
                          ? "rgba(25, 118, 210, 0.12)"
                          : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                    onClick={() => handleSubjectCheckboxChange(subject.id)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: "1px solid",
                          borderColor: isChecked ? "primary.main" : "grey.400",
                          borderRadius: 0.5,
                          mr: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: isChecked ? "primary.main" : "transparent",
                        }}
                      >
                        {isChecked && (
                          <Box
                            component="span"
                            sx={{ color: "white", fontSize: "0.8rem" }}
                          >
                            ✓
                          </Box>
                        )}
                      </Box>
                      <Typography>{subject.subjectName}</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography
              color="text.secondary"
              sx={{ py: 2, textAlign: "center" }}
            >
              No subjects available. Please add subjects first.
            </Typography>
          )}

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleCloseSubjectMapping}
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
              onClick={handleSaveSubjectMapping}
              disabled={subjectsLoading || allSubjects.length === 0}
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
              {subjectsLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save"
              )}
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
