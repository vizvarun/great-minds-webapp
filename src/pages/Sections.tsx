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
  Switch,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";

// Mock data for sections
interface Section {
  id: number;
  className: string;
  sectionName: string;
  isActive: boolean;
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

const Sections = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter sections based on search query
  const filteredSections = mockSections.filter(
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
    console.log("View teacher for section", id);
    // Implement view teacher functionality
  };

  const handleViewStudents = (id: number) => {
    console.log("View students for section", id);
    // Implement view students functionality
  };

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    console.log(
      `Toggle section ${id} status from ${currentStatus} to ${!currentStatus}`
    );
    // Implement toggle status functionality
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
                sx={{ fontWeight: 600, bgcolor: "grey.50", width: "35%" }}
              >
                Class
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, bgcolor: "grey.50", width: "15%" }}
              >
                Section
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, bgcolor: "grey.50", width: "50%" }}
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
                      <Switch
                        checked={section.isActive}
                        onChange={() =>
                          handleToggleStatus(section.id, section.isActive)
                        }
                        size="small"
                        sx={{
                          transition: "none",
                          "& .MuiSwitch-switchBase": {
                            "&.Mui-checked": {
                              color: "primary.main",
                            },
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {filteredSections.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
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
    </Paper>
  );
};

export default Sections;
