//@ts-nocheck

import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Paper,
  Select,
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionFormModal from "../components/SectionFormModal";
import api from "../services/api";
import { getAllActiveClasses } from "../services/classService";
import {
  createSection,
  deleteSection,
  getSections,
  toggleSectionStatus,
  updateSection,
} from "../services/sectionService";

import type { SelectChangeEvent } from "@mui/material";
import AuthService from "../services/auth";
import type { Class } from "../services/classService";
import type { Section } from "../services/sectionService";

const Sections = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filterClassId, setFilterClassId] = useState<string>("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "info" | "warning" | "error",
    timestamp: Date.now(),
  });

  // Fetch sections and classes on component mount
  useEffect(() => {
    // Get stored filter class ID from localStorage if available
    const storedFilterClassId = localStorage.getItem("sectionFilterClassId");

    fetchClasses().then((classData) => {
      // If there's stored filter, use it
      if (storedFilterClassId) {
        setFilterClassId(storedFilterClassId);
      }
      // Otherwise, if there's class data and no filter is set, set the first class as active
      else if (classData && classData.length > 0 && !filterClassId) {
        setFilterClassId(classData[0].id.toString());
      }
    });
  }, []);

  // Fetch sections when page, rowsPerPage, or filterClassId changes
  useEffect(() => {
    if (filterClassId) {
      // Store the selected filter class ID in localStorage whenever it changes
      localStorage.setItem("sectionFilterClassId", filterClassId);
      fetchSections();
    }
  }, [page, rowsPerPage, filterClassId]);

  const fetchClasses = async () => {
    try {
      const response = await getAllActiveClasses();
      if (response && response.data) {
        setClasses(response.data);
        return response.data;
      }
      return [];
    } catch (err) {
      console.error("Error fetching classes:", err);
      setNotification({
        open: true,
        message: "Failed to load classes",
        severity: "error",
        timestamp: Date.now(),
      });
      return [];
    }
  };

  const fetchSections = async () => {
    setLoading(true);
    try {
      const classId = filterClassId ? parseInt(filterClassId) : undefined;
      const response = await getSections(page, rowsPerPage, classId);

      setSections(response.data || []);
      setTotalRecords(response.total_records || 0);
      setError(null);
    } catch (err) {
      // Instead of showing error, just set empty sections
      console.error("Error fetching sections:", err);
      setSections([]);
      setTotalRecords(0);
      setError(null); // Don't set error state
    } finally {
      setLoading(false);
    }
  };

  // Filter sections based on search query
  const filteredSections = sections.filter(
    (section) =>
      (section.section?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (section.className || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
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

  const handleFilterClassChange = (event: SelectChangeEvent) => {
    const newClassId = event.target.value;
    setFilterClassId(newClassId);
    // Store the updated filter class ID
    localStorage.setItem("sectionFilterClassId", newClassId);
    setPage(0);
  };

  // Add/Edit handlers
  const handleAddSection = () => {
    setSelectedSection(null);
    setIsEditMode(false);
    // Pass the currently selected filterClassId when opening the modal
    setIsModalOpen(true);
  };

  const handleEditSection = (id: number) => {
    const section = sections.find((s) => s.id === id);
    if (section) {
      setSelectedSection(section);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  // Delete handlers
  const handleDeleteClick = (id: number) => {
    const section = sections.find((s) => s.id === id);
    setSectionToDelete(section || null);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (sectionToDelete) {
      try {
        await deleteSection(sectionToDelete.id);

        // Update the UI
        setSections((prevSections) =>
          prevSections.filter((s) => s.id !== sectionToDelete.id)
        );

        setNotification({
          open: true,
          message: `Section ${sectionToDelete.section} deleted successfully`,
          severity: "success",
          timestamp: Date.now(),
        });
      } catch (error) {
        setNotification({
          open: true,
          message: "Failed to delete section",
          severity: "error",
          timestamp: Date.now(),
        });
      }

      setIsDeleteModalOpen(false);
      setSectionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSectionToDelete(null);
  };

  // Save section (add or edit)
  const handleSaveSection = async (sectionData: Partial<Section>) => {
    const userProfile = localStorage.getItem("userProfile");
    const schoolId =
      JSON.parse(userProfile).schoolid ||
      parseInt(localStorage.getItem("schoolId") || "-1");

    console.log("sectionData:", userProfile, schoolId);
    try {
      if (isEditMode && selectedSection) {
        // Update existing section
        await updateSection({
          ...sectionData,
          id: selectedSection.id,
          schoolid: schoolId,
          isactive:
            sectionData.isactive !== undefined ? sectionData.isactive : true,
        } as Section);

        // Show notification
        setNotification({
          open: true,
          message: "Section updated successfully",
          severity: "success",
          timestamp: Date.now(),
        });
      } else {
        // Add new section
        const payload = {
          ...sectionData,
          schoolid: schoolId,
          isactive: true,
        };

        await createSection(payload as Omit<Section, "id">);

        // Show notification
        setNotification({
          open: true,
          message: "Section added successfully",
          severity: "success",
          timestamp: Date.now(),
        });
      }

      // Refetch sections to get updated data instead of manually updating state
      await fetchSections();

      // Close modal
      setIsModalOpen(false);
      setSelectedSection(null);
    } catch (error) {
      setNotification({
        open: true,
        message: isEditMode
          ? "Failed to update section"
          : "Failed to add section",
        severity: "error",
        timestamp: Date.now(),
      });
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const updatedSection = await toggleSectionStatus(id, currentStatus);

      // Update the UI
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === id ? { ...section, isactive: !currentStatus } : section
        )
      );

      // Show toast notification with section details
      const toggledSection = sections.find((section) => section.id === id);
      if (toggledSection) {
        const newStatus = !currentStatus;
        const actionText = newStatus ? "enabled" : "disabled";

        setNotification({
          open: true,
          message: `Section ${toggledSection.section} has been ${actionText}`,
          severity: newStatus ? "success" : "info",
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to update section status",
        severity: "error",
        timestamp: Date.now(),
      });
    }
  };

  // Navigate to teachers screen
  const handleViewTeacher = (id: number) => {
    const section = sections.find((s) => s.id === id);
    if (section) {
      navigate(`/sections/${id}/teachers`, {
        state: {
          sectionId: id,
          className: section.className || `Class ${section.classid}`,
          sectionName: section.section,
        },
      });
    }
  };

  // Navigate to students screen
  const handleViewStudents = (id: number) => {
    const section = sections.find((s) => s.id === id);
    if (section) {
      navigate(`/sections/${id}/students`, {
        state: {
          sectionId: id,
          className: section.className || `Class ${section.classid}`,
          sectionName: section.section,
        },
      });
    }
  };

  const handleDownloadSection = async (id: number) => {
    try {
      const user_id = AuthService.getUserId() || 14;
      const section = sections.find((s) => s.id === id);

      // Show loading notification
      setNotification({
        open: true,
        message: `Downloading students data for ${
          section?.section || "section"
        }...`,
        severity: "info",
        timestamp: Date.now(),
      });

      try {
        // Call the API to get the Excel file as blob
        const response = await api.get(
          `/students/section/export?section_id=${id}&user_id=${user_id}`,
          { responseType: "blob" }
        );

        // Create a URL for the blob
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);

        // Create a hidden link element and trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = `Students_${section?.className || "Class"}_${
          section?.section || "Section"
        }.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL object
        URL.revokeObjectURL(url);

        // Show success notification
        setNotification({
          open: true,
          message: `Students data downloaded successfully`,
          severity: "success",
          timestamp: Date.now(),
        });
      } catch (error) {
        // Handle specific error response data
        if (error.response) {
          if (error.response.status === 404) {
            // Try to parse the error message from the API
            try {
              // For non-blob responses, we can read the data directly
              const errorData = await error.response.data;
              if (typeof errorData === "object" && errorData.detail) {
                // Show the actual error message from API
                setNotification({
                  open: true,
                  message: errorData.detail,
                  severity: "error",
                  timestamp: Date.now(),
                });
                return;
              }
            } catch (parseError) {
              // If the response is a blob, we need to read it as text
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  const errorJson = JSON.parse(reader.result as string);
                  if (errorJson.detail) {
                    setNotification({
                      open: true,
                      message: errorJson.detail,
                      severity: "error",
                      timestamp: Date.now(),
                    });
                    return;
                  }
                } catch (jsonError) {
                  // Fallback if JSON parsing fails
                  console.error("Error parsing error response:", jsonError);
                }

                // Default error message if we couldn't extract API message
                setNotification({
                  open: true,
                  message: "No students found in this section",
                  severity: "warning",
                  timestamp: Date.now(),
                });
              };
              reader.readAsText(error.response.data);
              return;
            }
          }
        }

        // Generic error fallback
        console.error("Error downloading section students:", error);
        setNotification({
          open: true,
          message: "Failed to download students data",
          severity: "error",
          timestamp: Date.now(),
        });
      }
    } catch (outerError) {
      console.error("Error in download process:", outerError);
      setNotification({
        open: true,
        message: "An unexpected error occurred",
        severity: "error",
        timestamp: Date.now(),
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Add custom CSS for tooltips
  useEffect(() => {
    // Add custom CSS to control tooltip positioning
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-tooltip {
        position: relative;
      }
      .custom-tooltip::before {
        content: attr(data-tooltip);
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        padding: 5px 8px;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.75);
        color: white;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s;
        z-index: 1000;
      }
      .custom-tooltip:hover::before {
        opacity: 1;
        visibility: visible;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
          Sections
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            <TextField
              placeholder="Search sections..."
              variant="outlined"
              size="medium"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                minWidth: 250,
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

            <FormControl sx={{ minWidth: 200 }}>
              <Select
                displayEmpty
                value={filterClassId}
                onChange={handleFilterClassChange}
                size="medium"
                sx={{ minWidth: 200 }}
              >
                {classes.length > 0 ? (
                  classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id.toString()}>
                      {cls.classname}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No classes available</MenuItem>
                )}
              </Select>
              {/* <FormHelperText>Filter by Class</FormHelperText> */}
            </FormControl>
          </Box>

          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            onClick={handleAddSection}
            sx={{
              textTransform: "none",
              borderRadius: 0.5,
              transition: "none",
              background: (theme) => theme.palette.primary.main,
              boxShadow: "none",
              "&:hover": {
                background: (theme) => theme.palette.primary.dark,
                opacity: 0.9,
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            Add Section
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
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "20%" }}
                >
                  Class
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "10%" }}
                >
                  Section
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "20%" }}
                >
                  Class Teacher
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "10%" }}
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
              {filteredSections.length > 0 ? (
                filteredSections.map((section) => (
                  <TableRow
                    key={section.id}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.02)" },
                      transition: "none",
                    }}
                  >
                    <TableCell>
                      {section.className || `Class ${section.classid}`}
                    </TableCell>
                    <TableCell>{section.section}</TableCell>
                    <TableCell>
                      {section.classTeacherName || "Not Assigned"}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Box
                          component="span"
                          className="custom-tooltip"
                          data-tooltip={section.isactive ? "Disable Section" : "Enable Section"}
                          sx={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={section.isactive}
                            onChange={() =>
                              handleToggleStatus(section.id, section.isactive)
                            }
                            style={{
                              appearance: "none",
                              WebkitAppearance: "none",
                              MozAppearance: "none",
                              width: "30px",
                              height: "18px",
                              borderRadius: "10px",
                              background: section.isactive
                                ? "#0cb5bf"
                                : "#e0e0e0",
                              outline: "none",
                              cursor: "pointer",
                              position: "relative",
                              transition: "background 0.25s ease",
                              border: "1px solid",
                              borderColor: section.isactive
                                ? "#0cb5bf"
                                : "#d0d0d0",
                            }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              left: section.isactive ? "18px" : "2px",
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
                          className="custom-tooltip"
                          data-tooltip="Edit Section"
                          size="small"
                          onClick={() => handleEditSection(section.id)}
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
                          className="custom-tooltip"
                          data-tooltip="View Teacher"
                          size="small"
                          onClick={() => handleViewTeacher(section.id)}
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
                          <PersonIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          className="custom-tooltip"
                          data-tooltip="View Students"
                          size="small"
                          onClick={() => handleViewStudents(section.id)}
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
                          <PeopleIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          className="custom-tooltip"
                          data-tooltip="Download Students"
                          size="small"
                          onClick={() => handleDownloadSection(section.id)}
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
                        {/* <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(section.id)}
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
                        </IconButton> */}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No sections found.
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

      {/* Section Form Modal */}
      <SectionFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveSection}
        section={selectedSection || undefined}
        isEditMode={isEditMode}
        sectionId={selectedSection?.id} // Pass section ID separately for API calls
        // Pass the currently selected class ID to prefill
        defaultClassId={filterClassId ? parseInt(filterClassId) : undefined}
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
                {sectionToDelete?.className ||
                  `Class ${sectionToDelete?.classid}`}{" "}
                {sectionToDelete?.section}
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

export default Sections;
