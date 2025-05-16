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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Import the mock data from the sections page
interface Teacher {
  id: number;
  name: string;
  subject: string;
  contactNumber: string;
}

// Mock teachers data - in a real app this would come from an API
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

const SectionTeachers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sectionId, className, sectionName } = location.state || {};

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch teachers for the section - using mock data for now
    if (sectionId && mockTeachers[sectionId]) {
      setTeachers(mockTeachers[sectionId] || []);
    } else {
      setTeachers([]);
    }
  }, [sectionId]);

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.contactNumber.includes(searchQuery)
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

  const handleAddTeacher = () => {
    console.log("Add teacher clicked for section", sectionId);
    // Implement add teacher functionality
  };

  const handleEditTeacher = (id: number) => {
    console.log("Edit teacher", id);
    // Implement edit teacher functionality
  };

  const handleDeleteTeacher = (id: number) => {
    console.log("Delete teacher", id);
    // Implement delete teacher functionality
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
          Teachers - {className} {sectionName}
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
          placeholder="Search teachers..."
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
          onClick={handleAddTeacher}
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
          Add Teacher
        </Button>
      </Box>

      {/* Teachers Table */}
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
                Subject
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
            {filteredTeachers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((teacher) => (
                <TableRow
                  key={teacher.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                  }}
                >
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.contactNumber}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditTeacher(teacher.id)}
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
                        onClick={() => handleDeleteTeacher(teacher.id)}
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
            {filteredTeachers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  No teachers found for this section.
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
        count={filteredTeachers.length}
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

export default SectionTeachers;
