import { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  IconButton,
  Tooltip,
  Modal,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";

// Mock data for classes
interface Class {
  id: number;
  name: string;
  subjectIds: number[]; // IDs of subjects mapped to this class
}

interface Subject {
  id: number;
  name: string;
}

const mockClasses: Class[] = [
  { id: 1, name: "Class 1", subjectIds: [1, 2] },
  { id: 2, name: "Class 2", subjectIds: [1, 3, 4] },
  { id: 3, name: "Class 3", subjectIds: [2, 3, 5] },
  { id: 4, name: "Class 4", subjectIds: [1, 4, 5] },
  { id: 5, name: "Class 5", subjectIds: [2, 3, 4] },
  { id: 6, name: "Class 6", subjectIds: [1, 2, 5] },
  { id: 7, name: "Class 7", subjectIds: [3, 4] },
  { id: 8, name: "Class 8", subjectIds: [1, 5] },
  { id: 9, name: "Class 9", subjectIds: [2, 4] },
  { id: 10, name: "Class 10", subjectIds: [1, 3, 5] },
  { id: 11, name: "Class 11 - Science", subjectIds: [6, 7, 8] },
  { id: 12, name: "Class 11 - Commerce", subjectIds: [9, 10, 11] },
  { id: 13, name: "Class 11 - Arts", subjectIds: [12, 13, 14] },
  { id: 14, name: "Class 12 - Science", subjectIds: [6, 7, 8] },
  { id: 15, name: "Class 12 - Commerce", subjectIds: [9, 10, 11] },
  { id: 16, name: "Class 12 - Arts", subjectIds: [12, 13, 14] },
];

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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);

  // Filter classes based on search query
  const filteredClasses = mockClasses.filter((cls) =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleAddClass = () => {
    console.log("Add class clicked");
    // Implement add class functionality
  };

  const handleEditClass = (id: number) => {
    console.log("Edit class", id);
    // Implement edit class functionality
  };

  const handleDeleteClass = (id: number) => {
    console.log("Delete class", id);
    // Implement delete class functionality
  };

  const handleDownloadClass = (id: number) => {
    console.log("Download class data for", id);
    // Implement download functionality
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
      console.log(
        `Mapped subjects for ${selectedClass.name}:`,
        selectedSubjects
      );
      // In a real app, you would update the class data here

      // Update local state for demo purposes
      const updatedClasses = mockClasses.map((cls) => {
        if (cls.id === selectedClass.id) {
          return { ...cls, subjectIds: selectedSubjects };
        }
        return cls;
      });
      // This is just for demo since we're not using a real state management system
      // In a real app, you'd dispatch an action or use a mutation
    }
    handleCloseSubjectMapping();
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
                  <TableCell>{cls.name}</TableCell>
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
                        onClick={() => handleDeleteClass(cls.id)}
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
        BackdropProps={{
          sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        }}
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
              Subject Mapping: {selectedClass?.name}
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
    </Paper>
  );
};

export default Classes;
