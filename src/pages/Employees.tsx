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

// Mock data for employees
interface Employee {
  id: number;
  employeeNo: string;
  firstName: string;
  lastName: string;
  designation: string;
  mobileNumber: string;
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    employeeNo: "EMP001",
    firstName: "John",
    lastName: "Doe",
    designation: "Principal",
    mobileNumber: "9876543210",
  },
  {
    id: 2,
    employeeNo: "EMP002",
    firstName: "Jane",
    lastName: "Smith",
    designation: "Teacher",
    mobileNumber: "9876543211",
  },
  {
    id: 3,
    employeeNo: "EMP003",
    firstName: "Robert",
    lastName: "Johnson",
    designation: "Administrator",
    mobileNumber: "9876543212",
  },
  {
    id: 4,
    employeeNo: "EMP004",
    firstName: "Sarah",
    lastName: "Williams",
    designation: "Teacher",
    mobileNumber: "9876543213",
  },
  {
    id: 5,
    employeeNo: "EMP005",
    firstName: "Michael",
    lastName: "Brown",
    designation: "Accountant",
    mobileNumber: "9876543214",
  },
  {
    id: 6,
    employeeNo: "EMP006",
    firstName: "Emily",
    lastName: "Davis",
    designation: "Librarian",
    mobileNumber: "9876543215",
  },
  {
    id: 7,
    employeeNo: "EMP007",
    firstName: "David",
    lastName: "Wilson",
    designation: "Physical Education",
    mobileNumber: "9876543216",
  },
  {
    id: 8,
    employeeNo: "EMP008",
    firstName: "Jennifer",
    lastName: "Taylor",
    designation: "Mathematics Teacher",
    mobileNumber: "9876543217",
  },
  {
    id: 9,
    employeeNo: "EMP009",
    firstName: "Thomas",
    lastName: "Anderson",
    designation: "Science Teacher",
    mobileNumber: "9876543218",
  },
  {
    id: 10,
    employeeNo: "EMP010",
    firstName: "Lisa",
    lastName: "Martin",
    designation: "English Teacher",
    mobileNumber: "9876543219",
  },
  {
    id: 11,
    employeeNo: "EMP011",
    firstName: "Richard",
    lastName: "White",
    designation: "History Teacher",
    mobileNumber: "9876543220",
  },
  {
    id: 12,
    employeeNo: "EMP012",
    firstName: "Patricia",
    lastName: "Clark",
    designation: "Art Teacher",
    mobileNumber: "9876543221",
  },
  {
    id: 13,
    employeeNo: "EMP013",
    firstName: "Daniel",
    lastName: "Lewis",
    designation: "Computer Science",
    mobileNumber: "9876543222",
  },
  {
    id: 14,
    employeeNo: "EMP014",
    firstName: "Nancy",
    lastName: "Young",
    designation: "Counselor",
    mobileNumber: "9876543223",
  },
  {
    id: 15,
    employeeNo: "EMP015",
    firstName: "Charles",
    lastName: "Hall",
    designation: "Vice Principal",
    mobileNumber: "9876543224",
  },
  {
    id: 16,
    employeeNo: "EMP016",
    firstName: "Linda",
    lastName: "Allen",
    designation: "Office Staff",
    mobileNumber: "9876543225",
  },
  {
    id: 17,
    employeeNo: "EMP017",
    firstName: "Mark",
    lastName: "Wright",
    designation: "Security",
    mobileNumber: "9876543226",
  },
  {
    id: 18,
    employeeNo: "EMP018",
    firstName: "Sandra",
    lastName: "Scott",
    designation: "Janitor",
    mobileNumber: "9876543227",
  },
  {
    id: 19,
    employeeNo: "EMP019",
    firstName: "Paul",
    lastName: "Green",
    designation: "Bus Driver",
    mobileNumber: "9876543228",
  },
  {
    id: 20,
    employeeNo: "EMP020",
    firstName: "Betty",
    lastName: "Adams",
    designation: "Cafeteria Staff",
    mobileNumber: "9876543229",
  },
  {
    id: 21,
    employeeNo: "EMP021",
    firstName: "George",
    lastName: "Baker",
    designation: "Maintenance",
    mobileNumber: "9876543230",
  },
];

const Employees = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter employees based on search query
  const filteredEmployees = mockEmployees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.mobileNumber.includes(searchQuery)
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

  const handleAddEmployee = () => {
    console.log("Add employee clicked");
    // Implement add employee functionality
  };

  const handleBulkUpload = () => {
    console.log("Bulk upload clicked");
    // Implement bulk upload functionality
  };

  const handleEditEmployee = (id: number) => {
    console.log("Edit employee", id);
    // Implement edit employee functionality
  };

  const handleDeleteEmployee = (id: number) => {
    console.log("Delete employee", id);
    // Implement delete employee functionality
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
          Employees
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
            placeholder="Search employees..."
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
              onClick={handleAddEmployee}
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
              Add Employee
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
                Employee No.
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                First Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                Last Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                Designation
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                Mobile Number
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
            {filteredEmployees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((employee) => (
                <TableRow
                  key={employee.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)", // Very subtle hover
                    },
                    transition: "none",
                  }}
                >
                  <TableCell>{employee.employeeNo}</TableCell>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.mobileNumber}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditEmployee(employee.id)}
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
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteEmployee(employee.id)}
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
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {filteredEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No employees found.
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
        count={filteredEmployees.length}
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

export default Employees;
