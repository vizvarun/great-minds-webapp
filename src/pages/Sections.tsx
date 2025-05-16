import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Extend Section interface to include classTeacher and classAdmin
interface Section {
  id: number;
  className: string;
  sectionName: string;
  isActive: boolean;
  classTeacher?: string;
  classAdmin?: string;
}

// Mock data for sections
const mockSections: Section[] = [
  { id: 1, className: "Class 1", sectionName: "A", isActive: true },
  { id: 2, className: "Class 1", sectionName: "B", isActive: true },
  { id: 3, className: "Class 2", sectionName: "A", isActive: true },
  { id: 4, className: "Class 2", sectionName: "B", isActive: false },
  { id: 5, className: "Class 3", sectionName: "A", isActive: true },
  { id: 6, className: "Class 3", sectionName: "B", isActive: true },
  { id: 7, className: "Class 3", sectionName: "C", isActive: false },
  { id: 8, className: "Class 4", sectionName: "A", isActive: true },
  { id: 9, className: "Class 5", sectionName: "A", isActive: true },
  { id: 10, className: "Class 5", sectionName: "B", isActive: true },
  { id: 11, className: "Class 6", sectionName: "A", isActive: true },
  { id: 12, className: "Class 7", sectionName: "A", isActive: true },
  { id: 13, className: "Class 8", sectionName: "A", isActive: true },
  { id: 14, className: "Class 9", sectionName: "A", isActive: true },
  { id: 15, className: "Class 10", sectionName: "A", isActive: true },
  { id: 16, className: "Class 10", sectionName: "B", isActive: false },
  { id: 17, className: "Class 11 - Science", sectionName: "A", isActive: true },
  {
    id: 18,
    className: "Class 11 - Commerce",
    sectionName: "A",
    isActive: true,
  },
  { id: 19, className: "Class 12 - Science", sectionName: "A", isActive: true },
  {
    id: 20,
    className: "Class 12 - Commerce",
    sectionName: "A",
    isActive: true,
  },
];

const mockClasses = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11 - Science",
  "Class 11 - Commerce",
  "Class 12 - Science",
  "Class 12 - Commerce",
];
const mockAllTeachers = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sarah Johnson" },
  { id: 3, name: "Robert Williams" },
  { id: 4, name: "Lisa Brown" },
  { id: 5, name: "Michael Davis" },
  { id: 6, name: "James Wilson" },
  { id: 7, name: "Emily Taylor" },
];
const mockAdmins = [
  { id: 1, name: "Priya Admin" },
  { id: 2, name: "Ravi Admin" },
];

const Sections = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    className: "",
    sectionName: "",
    classTeacher: "",
    classAdmin: "",
  });
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);

  // Filter sections based on search query
  const filteredSections = sections.filter(
    (section) =>
      section.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.sectionName.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Add/Edit handlers
  const handleAddSection = () => {
    setFormData({
      className: "",
      sectionName: "",
      classTeacher: "",
      classAdmin: "",
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };
  const handleEditSection = (id: number) => {
    const section = sections.find((s) => s.id === id);
    if (section) {
      setFormData({
        className: section.className,
        sectionName: section.sectionName,
        classTeacher: section.classTeacher ?? "",
        classAdmin: section.classAdmin ?? "",
      });
      setSelectedSection(section);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };
  // Delete handlers
  const handleDeleteSection = (id: number) => {
    const section = sections.find((s) => s.id === id);
    setSectionToDelete(section || null);
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = () => {
    if (sectionToDelete) {
      setSections(sections.filter((s) => s.id !== sectionToDelete.id));
      setToastMessage(
        `Section ${sectionToDelete.className} ${sectionToDelete.sectionName} deleted`
      );
      setToastSeverity("success");
      setToastOpen(true);
      setIsDeleteModalOpen(false);
      setSectionToDelete(null);
    }
  };
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSectionToDelete(null);
  };
  // Form field change
  const handleFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };
  // Save section (add or edit)
  const handleSaveSection = () => {
    if (!formData.className || !formData.sectionName) {
      setToastMessage("Class and Section are required");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }
    if (isEditMode && selectedSection) {
      setSections(
        sections.map((s) =>
          s.id === selectedSection.id ? { ...s, ...formData } : s
        )
      );
      setToastMessage("Section updated successfully");
      setToastSeverity("success");
    } else {
      const newId = Math.max(...sections.map((s) => s.id), 0) + 1;
      setSections([...sections, { id: newId, isActive: true, ...formData }]);
      setToastMessage("Section added successfully");
      setToastSeverity("success");
    }
    setIsModalOpen(false);
    setSelectedSection(null);
    setToastOpen(true); // Move here to ensure toast is visible after modal closes
  };

  // Navigate to teachers screen instead of opening a modal
  const handleViewTeacher = (id: number) => {
    navigate(`/sections/${id}/teachers`, {
      state: {
        sectionId: id,
        className: sections.find((s) => s.id === id)?.className,
        sectionName: sections.find((s) => s.id === id)?.sectionName,
      },
    });
  };

  // Navigate to students screen instead of opening a modal
  const handleViewStudents = (id: number) => {
    navigate(`/sections/${id}/students`, {
      state: {
        sectionId: id,
        className: sections.find((s) => s.id === id)?.className,
        sectionName: sections.find((s) => s.id === id)?.sectionName,
      },
    });
  };

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    const updatedSections = sections.map((section) => {
      if (section.id === id) {
        return { ...section, isActive: !currentStatus };
      }
      return section;
    });

    setSections(updatedSections);

    // Show toast notification with section details
    const toggledSection = sections.find((section) => section.id === id);
    if (toggledSection) {
      const newStatus = !currentStatus;
      const actionText = newStatus ? "enabled" : "disabled";

      setToastMessage(
        `Section ${toggledSection.className} ${toggledSection.sectionName} has been ${actionText}`
      );
      setToastSeverity(newStatus ? "success" : "info");
      setToastOpen(true);
    }
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

  const handleDownloadSection = (id: number) => {
    console.log("Download section data for", id);
    // Implement download functionality
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
          <TextField
            placeholder="Search sections..."
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
            {filteredSections
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((section) => (
                <TableRow
                  key={section.id}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.02)" },
                    transition: "none",
                  }}
                >
                  <TableCell>{section.className}</TableCell>
                  <TableCell>{section.sectionName}</TableCell>
                  <TableCell>{section.classTeacher ?? "-"}</TableCell>
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
                          checked={section.isActive}
                          onChange={() =>
                            handleToggleStatus(section.id, section.isActive)
                          }
                          style={{
                            appearance: "none",
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            width: "30px",
                            height: "18px",
                            borderRadius: "10px",
                            background: section.isActive
                              ? "#0cb5bf"
                              : "#e0e0e0",
                            outline: "none",
                            cursor: "pointer",
                            position: "relative",
                            transition: "background 0.25s ease",
                            border: "1px solid",
                            borderColor: section.isActive
                              ? "#0cb5bf"
                              : "#d0d0d0",
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            left: section.isActive ? "18px" : "2px",
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
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteSection(section.id)}
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
            {filteredSections.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No sections found.
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
        count={filteredSections.length}
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

      {/* Add/Edit Section Modal */}
      {isModalOpen && (
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
            elevation={0}
            sx={{
              width: 400,
              maxWidth: "95%",
              borderRadius: 2,
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
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {isEditMode ? "Edit Section" : "Add New Section"}
              </Typography>
              <IconButton onClick={() => setIsModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Class
              </Typography>
              <TextField
                select
                fullWidth
                name="className"
                value={formData.className}
                onChange={handleFormChange}
                size="small"
              >
                <option value="">Select class</option>
                {mockClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </TextField>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Section Name
              </Typography>
              <TextField
                fullWidth
                name="sectionName"
                value={formData.sectionName}
                onChange={handleFormChange}
                placeholder="Enter section name"
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Class Teacher
              </Typography>
              <TextField
                select
                fullWidth
                name="classTeacher"
                value={formData.classTeacher}
                onChange={handleFormChange}
                size="small"
              >
                <option value="">Select class teacher</option>
                {mockAllTeachers.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </TextField>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Class Admin
              </Typography>
              <TextField
                select
                fullWidth
                name="classAdmin"
                value={formData.classAdmin}
                onChange={handleFormChange}
                size="small"
              >
                <option value="">Select class admin</option>
                {mockAdmins.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setIsModalOpen(false)}
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
                onClick={handleSaveSection}
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
            elevation={0}
            sx={{
              width: 400,
              maxWidth: "95%",
              borderRadius: 2,
              p: 3,
              outline: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Confirm Deletion
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
                Are you sure you want to delete
                <strong>
                  {sectionToDelete?.className} {sectionToDelete?.sectionName}
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
            </Box>
          </Paper>
        </Box>
      )}
    </Paper>
  );
};

export default Sections;
