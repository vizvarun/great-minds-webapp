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
  IconButton,
  InputAdornment,
  Modal,
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
import EmployeeFormModal from "../components/EmployeeFormModal";
import BulkUploadModal from "../components/BulkUploadModal";

// Mock data for employees
interface Employee {
  id: number;
  employeeNo: string;
  firstName: string;
  lastName: string;
  designation: string;
  mobileNumber: string;
  email?: string;
  address?: string;
  joiningDate?: string;
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(
    undefined
  );

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
    timestamp: Date.now(),
  });

  // Filter employees based on search query
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.mobileNumber.includes(searchQuery)
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

  const handleAddEmployee = () => {
    setIsEditMode(false);
    setCurrentEmployee(undefined);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (id: number) => {
    const employeeToEdit = employees.find((emp) => emp.id === id);
    if (employeeToEdit) {
      setCurrentEmployee(employeeToEdit);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      const updatedEmployees = employees.filter(
        (emp) => emp.id !== employeeToDelete.id
      );
      setEmployees(updatedEmployees);

      setNotification({
        open: true,
        message: "Employee deleted successfully",
        severity: "success",
        timestamp: Date.now(),
      });

      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEmployeeSubmit = (employeeData: Employee) => {
    if (isEditMode && currentEmployee) {
      const updatedEmployees = employees.map((emp) =>
        emp.id === currentEmployee.id ? { ...employeeData, id: emp.id } : emp
      );
      setEmployees(updatedEmployees);
      setNotification({
        open: true,
        message: "Employee updated successfully",
        severity: "success",
        timestamp: Date.now(),
      });
    } else {
      const newId = Math.max(...employees.map((emp) => emp.id)) + 1;
      setEmployees([...employees, { ...employeeData, id: newId }]);
      setNotification({
        open: true,
        message: "Employee added successfully",
        severity: "success",
        timestamp: Date.now(),
      });
    }

    setIsModalOpen(false);
  };

  const handleBulkUpload = () => {
    setIsBulkUploadModalOpen(true);
  };

  const handleCloseBulkUploadModal = () => {
    setIsBulkUploadModalOpen(false);
  };

  const handleBulkUploadSuccess = (uploadedEmployees: any[]) => {
    const lastId =
      employees.length > 0 ? Math.max(...employees.map((emp) => emp.id)) : 0;

    const newEmployees = uploadedEmployees.map((emp, index) => ({
      ...emp,
      id: lastId + index + 1,
    }));

    setEmployees([...employees, ...newEmployees]);

    setNotification({
      open: true,
      message: `Successfully added ${uploadedEmployees.length} employees`,
      severity: "success",
      timestamp: Date.now(),
    });
  };

  const handleDownloadList = () => {
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

      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{
          mt: 2,
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
                Employee ID
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
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
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
                        onClick={() => handleDeleteClick(employee)}
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

      <EmployeeFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(employeeData) => handleEmployeeSubmit(employeeData as any)}
        employee={currentEmployee}
        isEditMode={isEditMode}
      />

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        open={isBulkUploadModalOpen}
        onClose={handleCloseBulkUploadModal}
        onUploadSuccess={handleBulkUploadSuccess}
        entityType="Employees"
      />

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
                {employeeToDelete?.firstName} {employeeToDelete?.lastName}
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

      <Snackbar
        key={notification.timestamp}
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

export default Employees;
