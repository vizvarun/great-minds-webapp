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
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Mock data for students
interface Student {
  id: number;
  name: string;
  rollNumber: string;
  contactNumber: string;
}

// Mock students data - in a real app this would come from an API
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

const SectionStudents = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sectionId, className, sectionName } = location.state || {};

  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch students for the section - using mock data for now
    if (sectionId && mockStudents[sectionId]) {
      setStudents(mockStudents[sectionId] || []);
    } else {
      setStudents([]);
    }
  }, [sectionId]);

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.includes(searchQuery) ||
      student.contactNumber.includes(searchQuery)
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

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page (sections)
  };

  const handleAddStudent = () => {
    console.log("Add student clicked for section", sectionId);
    // Implement add student functionality
  };

  const handleEditStudent = (id: number) => {
    console.log("Edit student", id);
    // Implement edit student functionality
  };

  const handleDeleteStudent = (id: number) => {
    console.log("Delete student", id);
    // Implement delete student functionality
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
          Add Student
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
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                Roll Number
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                Contact Number
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
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {student.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={student.rollNumber}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 24,
                        fontSize: "0.75rem",
                      }}
                    />
                  </TableCell>
                  <TableCell>{student.contactNumber}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditStudent(student.id)}
                        color="primary"
                        sx={{
                          "&:hover": {
                            bgcolor: "rgba(25, 118, 210, 0.04)",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteStudent(student.id)}
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
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  No students found for this section.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
    </Paper>
  );
};

export default SectionStudents;
