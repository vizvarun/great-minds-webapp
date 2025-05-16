import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  Chip,
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
import { useState } from "react";
import StudentFormModal from "../components/StudentFormModal";

// Student interface matching the form data structure
interface Student {
  id: number;
  enrollmentNo: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  city: string;
  state: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  profilePhoto?: string;
  // Father details
  fatherFirstName: string;
  fatherLastName: string;
  fatherPhoneNumber: string;
  fatherEmail?: string;
  // Mother details
  motherFirstName: string;
  motherLastName: string;
  motherPhoneNumber: string;
  motherEmail?: string;
  // Guardian details
  guardianFirstName: string;
  guardianLastName: string;
  guardianPhoneNumber: string;
  guardianEmail?: string;
}

// Mock data for students
const mockStudents: Student[] = [
  {
    id: 1,
    enrollmentNo: "2023001",
    firstName: "Aarav",
    lastName: "Sharma",
    phoneNumber: "9876543210",
    dateOfBirth: "2010-05-15",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    addressLine1: "123 Main St",
    fatherFirstName: "Raj",
    fatherLastName: "Sharma",
    fatherPhoneNumber: "9876543211",
    fatherEmail: "raj@example.com",
    motherFirstName: "Priya",
    motherLastName: "Sharma",
    motherPhoneNumber: "9876543212",
    motherEmail: "priya@example.com",
    guardianFirstName: "",
    guardianLastName: "",
    guardianPhoneNumber: "",
    guardianEmail: "",
  },
  {
    id: 2,
    enrollmentNo: "2023002",
    firstName: "Aisha",
    lastName: "Patel",
    phoneNumber: "9876543220",
    dateOfBirth: "2011-07-22",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    addressLine1: "456 Park Ave",
    fatherFirstName: "Kunal",
    fatherLastName: "Patel",
    fatherPhoneNumber: "9876543221",
    fatherEmail: "kunal@example.com",
    motherFirstName: "Neha",
    motherLastName: "Patel",
    motherPhoneNumber: "9876543222",
    motherEmail: "neha@example.com",
    guardianFirstName: "",
    guardianLastName: "",
    guardianPhoneNumber: "",
    guardianEmail: "",
  },
  // Add more mock students as needed
];

const Students = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>(mockStudents);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | undefined>(
    undefined
  );

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phoneNumber.includes(searchQuery)
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
    setIsEditMode(false);
    setCurrentStudent(undefined);
    setIsModalOpen(true);
  };

  const handleEditStudent = (id: number) => {
    const studentToEdit = students.find((student) => student.id === id);
    if (studentToEdit) {
      setCurrentStudent(studentToEdit);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const handleDeleteStudent = (id: number) => {
    // Filter out the student with the given id
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);

    // Show notification
    setNotification({
      open: true,
      message: "Student deleted successfully",
      severity: "success",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleStudentSubmit = (studentData: Student) => {
    if (isEditMode && currentStudent) {
      // Update existing student
      const updatedStudents = students.map((student) =>
        student.id === currentStudent.id
          ? { ...studentData, id: student.id }
          : student
      );
      setStudents(updatedStudents);
      setNotification({
        open: true,
        message: "Student updated successfully",
        severity: "success",
      });
    } else {
      // Add new student
      const newId = Math.max(...students.map((student) => student.id), 0) + 1;
      setStudents([...students, { ...studentData, id: newId }]);
      setNotification({
        open: true,
        message: "Student added successfully",
        severity: "success",
      });
    }

    setIsModalOpen(false);
  };

  const handleDownloadList = () => {
    // Implementation for download
    console.log("Download list clicked");
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
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
              startIcon={<DownloadIcon />}
              onClick={handleDownloadList}
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
              Download
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Scrollable Table Container */}
      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        mt={2}
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
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                Enrollment No
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                Phone Number
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                City
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                State
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
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                    transition: "none",
                  }}
                >
                  <TableCell>
                    <Chip
                      label={student.enrollmentNo}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 0.5, height: 24 }}
                    />
                  </TableCell>
                  <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                  <TableCell>{student.phoneNumber}</TableCell>
                  <TableCell>{student.city}</TableCell>
                  <TableCell>{student.state}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditStudent(student.id)}
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
                        onClick={() => handleDeleteStudent(student.id)}
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

      {/* Student Form Modal */}
      <StudentFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleStudentSubmit}
        student={currentStudent}
        isEditMode={isEditMode}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Students;
