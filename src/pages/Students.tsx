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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";

// Mock data for students
interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  status: "active" | "inactive"; // Replace grade and section with status
  contactNumber: string;
}

const mockStudents: Student[] = [
  {
    id: 1,
    studentId: "STD001",
    firstName: "Alice",
    lastName: "Johnson",
    status: "active",
    contactNumber: "9876543101",
  },
  {
    id: 2,
    studentId: "STD002",
    firstName: "Bob",
    lastName: "Smith",
    status: "active",
    contactNumber: "9876543102",
  },
  {
    id: 3,
    studentId: "STD003",
    firstName: "Charlie",
    lastName: "Williams",
    status: "active",
    contactNumber: "9876543103",
  },
  {
    id: 4,
    studentId: "STD004",
    firstName: "Diana",
    lastName: "Brown",
    status: "inactive",
    contactNumber: "9876543104",
  },
  {
    id: 5,
    studentId: "STD005",
    firstName: "Edward",
    lastName: "Jones",
    status: "active",
    contactNumber: "9876543105",
  },
  {
    id: 6,
    studentId: "STD006",
    firstName: "Fiona",
    lastName: "Miller",
    status: "inactive",
    contactNumber: "9876543106",
  },
  {
    id: 7,
    studentId: "STD007",
    firstName: "George",
    lastName: "Davis",
    status: "active",
    contactNumber: "9876543107",
  },
  {
    id: 8,
    studentId: "STD008",
    firstName: "Helen",
    lastName: "Wilson",
    status: "active",
    contactNumber: "9876543108",
  },
  {
    id: 9,
    studentId: "STD009",
    firstName: "Ian",
    lastName: "Taylor",
    status: "inactive",
    contactNumber: "9876543109",
  },
  {
    id: 10,
    studentId: "STD010",
    firstName: "Jessica",
    lastName: "Anderson",
    status: "active",
    contactNumber: "9876543110",
  },
  {
    id: 11,
    studentId: "STD011",
    firstName: "Kevin",
    lastName: "Thomas",
    status: "active",
    contactNumber: "9876543111",
  },
  {
    id: 12,
    studentId: "STD012",
    firstName: "Laura",
    lastName: "Jackson",
    status: "inactive",
    contactNumber: "9876543112",
  },
  {
    id: 13,
    studentId: "STD013",
    firstName: "Mike",
    lastName: "White",
    status: "active",
    contactNumber: "9876543113",
  },
  {
    id: 14,
    studentId: "STD014",
    firstName: "Nancy",
    lastName: "Harris",
    status: "inactive",
    contactNumber: "9876543114",
  },
  {
    id: 15,
    studentId: "STD015",
    firstName: "Oscar",
    lastName: "Martin",
    status: "active",
    contactNumber: "9876543115",
  },
  {
    id: 16,
    studentId: "STD016",
    firstName: "Patricia",
    lastName: "Thompson",
    status: "active",
    contactNumber: "9876543116",
  },
  {
    id: 17,
    studentId: "STD017",
    firstName: "Quentin",
    lastName: "Garcia",
    status: "inactive",
    contactNumber: "9876543117",
  },
  {
    id: 18,
    studentId: "STD018",
    firstName: "Rachel",
    lastName: "Martinez",
    status: "active",
    contactNumber: "9876543118",
  },
  {
    id: 19,
    studentId: "STD019",
    firstName: "Steve",
    lastName: "Robinson",
    status: "inactive",
    contactNumber: "9876543119",
  },
  {
    id: 20,
    studentId: "STD020",
    firstName: "Tina",
    lastName: "Clark",
    status: "active",
    contactNumber: "9876543120",
  },
];

const Students = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter students based on search query
  const filteredStudents = mockStudents.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleAddStudent = () => {
    console.log("Add student clicked");
    // Implement add student functionality
  };

  const handleBulkUpload = () => {
    console.log("Bulk upload clicked");
    // Implement bulk upload functionality
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
          Students
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
            placeholder="Search students..."
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
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
              onClick={handleAddStudent}
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
              Add Student
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileUploadIcon />}
              onClick={handleBulkUpload}
              sx={{
                textTransform: "none",
                borderRadius: 0.5,
                transition: "none",
                outline: "none",
                "&:hover": {
                  bgcolor: "transparent",
                  borderColor: "primary.main",
                  outline: "none",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              Bulk Upload
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Scrollable Table Container - ONLY this should scroll */}
      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        mt={2}
        sx={{
          borderRadius: 0.5,
          flex: 1,
          overflow: "auto", // This element should scroll
          height: "100%", // Take full height of parent
          maxHeight: "calc(100% - 120px)", // Account for header and pagination
        }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                Enrollment No.
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                First Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                Last Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                Contact Number
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                Status
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, bgcolor: "grey.50" }}
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
                      backgroundColor: "rgba(0, 0, 0, 0.02)", // Very subtle hover
                    },
                    transition: "none",
                  }}
                >
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.contactNumber}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor:
                          student.status === "active"
                            ? "rgba(46, 125, 50, 0.1)"
                            : "rgba(211, 47, 47, 0.1)",
                        color:
                          student.status === "active"
                            ? "success.main"
                            : "error.main",
                        fontSize: "0.75rem",
                        fontWeight: "medium",
                        textTransform: "capitalize",
                      }}
                    >
                      {student.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditStudent(student.id)}
                          color="primary"
                          sx={{
                            transition: "none",
                            outline: "none", // Remove outline
                            "&:hover": {
                              bgcolor: "rgba(25, 118, 210, 0.04)",
                            },
                            "&:focus": {
                              outline: "none", // Remove focus outline
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteStudent(student.id)}
                          color="error"
                          sx={{
                            transition: "none",
                            outline: "none", // Remove outline
                            "&:hover": {
                              bgcolor: "rgba(211, 47, 47, 0.04)",
                            },
                            "&:focus": {
                              outline: "none", // Remove focus outline
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No students found.
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
        count={filteredStudents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          flexShrink: 0,
          borderTop: 1,
          borderColor: "grey.200",
          mt: 1, // Add margin-top for spacing
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

export default Students;
