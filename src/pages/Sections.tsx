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
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
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

// Mock data for sections
interface Section {
  id: number;
  className: string;
  sectionName: string;
  isActive: boolean;
}

interface Teacher {
  id: number;
  name: string;
  subject: string;
  contactNumber: string;
}

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  contactNumber: string;
}

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

const mockTeachers: Record<number, Teacher[]> = {
  1: [
    {
      id: 1,
      name: "John Smith",
      subject: "Mathematics",
      contactNumber: "9876543210",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      subject: "English",
      contactNumber: "9876543211",
    },
  ],
  2: [
    {
      id: 3,
      name: "Robert Williams",
      subject: "Science",
      contactNumber: "9876543212",
    },
  ],
  3: [
    {
      id: 4,
      name: "Lisa Brown",
      subject: "Hindi",
      contactNumber: "9876543213",
    },
    {
      id: 5,
      name: "Michael Davis",
      subject: "Social Studies",
      contactNumber: "9876543214",
    },
  ],
  5: [
    {
      id: 6,
      name: "James Wilson",
      subject: "Computer Science",
      contactNumber: "9876543215",
    },
  ],
  8: [
    {
      id: 7,
      name: "Emily Taylor",
      subject: "Art",
      contactNumber: "9876543216",
    },
  ],
};

const mockStudents: Record<number, Student[]> = {
  1: [
    {
      id: 1,
      name: "Alice Green",
      rollNumber: "101",
      contactNumber: "9876543301",
    },
    {
      id: 2,
      name: "Bob Wilson",
      rollNumber: "102",
      contactNumber: "9876543302",
    },
    {
      id: 3,
      name: "Charlie Evans",
      rollNumber: "103",
      contactNumber: "9876543303",
    },
  ],
  2: [
    {
      id: 4,
      name: "Diana Foster",
      rollNumber: "104",
      contactNumber: "9876543304",
    },
    {
      id: 5,
      name: "Edward Gardner",
      rollNumber: "105",
      contactNumber: "9876543305",
    },
  ],
  3: [
    {
      id: 6,
      name: "Fiona Harrison",
      rollNumber: "106",
      contactNumber: "9876543306",
    },
    {
      id: 7,
      name: "George Irving",
      rollNumber: "107",
      contactNumber: "9876543307",
    },
    {
      id: 8,
      name: "Hannah Jackson",
      rollNumber: "108",
      contactNumber: "9876543308",
    },
  ],
};

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

  // Filter sections based on search query
  const filteredSections = sections.filter(
    (section) =>
      section.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.sectionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
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

  const handleAddSection = () => {
    console.log("Add section clicked");
    // Implement add section functionality
  };

  const handleEditSection = (id: number) => {
    console.log("Edit section", id);
    // Implement edit section functionality
  };

  const handleDeleteSection = (id: number) => {
    console.log("Delete section", id);
    // Implement delete section functionality
  };

  const handleViewTeacher = (id: number) => {
    // Navigate to teachers screen instead of opening a modal
    navigate(`/sections/${id}/teachers`, {
      state: {
        sectionId: id,
        className: sections.find((s) => s.id === id)?.className,
        sectionName: sections.find((s) => s.id === id)?.sectionName,
      },
    });
  };

  const handleViewStudents = (id: number) => {
    // Navigate to students screen instead of opening a modal
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
    event?: React.SyntheticEvent | Event,
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
                sx={{ fontWeight: 600, bgcolor: "grey.50", width: "30%" }}
              >
                Class
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, bgcolor: "grey.50", width: "10%" }}
              >
                Section
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, bgcolor: "grey.50", width: "15%" }}
                align="center"
              >
                Status
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, bgcolor: "grey.50", width: "45%" }}
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
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                    transition: "none",
                  }}
                >
                  <TableCell>{section.className}</TableCell>
                  <TableCell>{section.sectionName}</TableCell>
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
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
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
            borderColor: (theme) =>
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
    </Paper>
  );
};

export default Sections;
