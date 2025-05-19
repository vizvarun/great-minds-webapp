import AddIcon from "@mui/icons-material/Add";
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
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import EmployeeFormModal from "../components/EmployeeFormModal";
import BulkUploadModal from "../components/BulkUploadModal";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  toggleEmployeeStatus,
  bulkUploadEmployees,
  downloadEmployeeExcel,
} from "../services/employeeService";
import type { Employee } from "../services/employeeService";

const Employees = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(
    undefined
  );

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
    timestamp: Date.now(),
  });

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees(page, rowsPerPage);

      if (response && response.data) {
        setEmployees(response.data);
        setTotalRecords(response.total_records || response.data.length);
        setError(null);
      } else {
        // Handle unexpected data format
        console.error("Unexpected data format:", response);
        setError("Received invalid data format from server");
        setEmployees([]);
      }
    } catch (err: any) {
      console.error("Error in fetchEmployees:", err);
      setError(
        err.message || "Failed to load employees. Please try again later."
      );
      setNotification({
        open: true,
        message: "Failed to load employees",
        severity: "error",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

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
    const employeeToEdit = employees.find((emp) => emp.empId === id);
    if (employeeToEdit) {
      setCurrentEmployee(employeeToEdit);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await toggleEmployeeStatus(id, currentStatus);

      // Refetch the latest employee list after successful toggle
      await fetchEmployees();

      // Show success notification
      setNotification({
        open: true,
        message: `Employee status has been ${
          !currentStatus ? "activated" : "deactivated"
        }`,
        severity: "success",
        timestamp: Date.now(),
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to update employee status",
        severity: "error",
        timestamp: Date.now(),
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEmployeeSubmit = async (employeeData: Employee) => {
    setLoading(true); // Start showing loader
    try {
      if (isEditMode && currentEmployee) {
        // Edit existing employee
        await updateEmployee({
          ...employeeData,
          id: currentEmployee.empId,
        });

        // Refetch the entire list to ensure we have the latest data
        await fetchEmployees();

        setNotification({
          open: true,
          message: "Employee updated successfully",
          severity: "success",
          timestamp: Date.now(),
        });
      } else {
        // Add new employee
        await createEmployee(employeeData);

        // Refetch the entire list to ensure we have the latest data
        await fetchEmployees();

        setNotification({
          open: true,
          message: "Employee added successfully",
          severity: "success",
          timestamp: Date.now(),
        });
      }

      // Close modal only after successful refresh
      setIsModalOpen(false);
    } catch (error) {
      setNotification({
        open: true,
        message: isEditMode
          ? "Failed to update employee"
          : "Failed to add employee",
        severity: "error",
        timestamp: Date.now(),
      });
      setLoading(false); // Stop loader on error
    }
  };

  const handleBulkUpload = () => {
    setIsBulkUploadModalOpen(true);
  };

  const handleCloseBulkUploadModal = () => {
    setIsBulkUploadModalOpen(false);
  };

  const handleBulkUploadSuccess = async (uploadedEmployees: any[]) => {
    try {
      const newEmployees = await bulkUploadEmployees(uploadedEmployees);

      setEmployees([...employees, ...newEmployees]);

      setNotification({
        open: true,
        message: `Successfully added ${newEmployees.length} employees`,
        severity: "success",
        timestamp: Date.now(),
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to bulk upload employees",
        severity: "error",
        timestamp: Date.now(),
      });
    }
  };

  const handleDownloadList = async () => {
    try {
      // Show loading notification
      setNotification({
        open: true,
        message: "Downloading employee data...",
        severity: "success",
        timestamp: Date.now(),
      });

      // Call the API to get the Excel file as blob
      const blob = await downloadEmployeeExcel();

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a hidden link element and trigger download with .xlsx extension
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `employees_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);

      // Show success notification
      setNotification({
        open: true,
        message: "Employee data downloaded successfully",
        severity: "success",
        timestamp: Date.now(),
      });
    } catch (error) {
      // Show error notification
      setNotification({
        open: true,
        message: "Failed to download employee data",
        severity: "error",
        timestamp: Date.now(),
      });
    }
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
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 4,
            }}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
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
              {employees.map((employee) => (
                <TableRow
                  key={employee.empId}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                    transition: "none",
                  }}
                >
                  <TableCell>{employee.empNo || "-"}</TableCell>
                  <TableCell>{employee.firstName || "-"}</TableCell>
                  <TableCell>{employee.lastName || "-"}</TableCell>
                  <TableCell>{employee.designation || "-"}</TableCell>
                  <TableCell>{employee.mobileNo || "-"}</TableCell>
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
                          checked={employee.deletedAt === null}
                          onChange={() =>
                            handleToggleStatus(
                              employee.empId,
                              employee.deletedAt === null
                            )
                          }
                          style={{
                            appearance: "none",
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            width: "30px",
                            height: "18px",
                            borderRadius: "10px",
                            background:
                              employee.deletedAt === null
                                ? "#0cb5bf"
                                : "#e0e0e0",
                            outline: "none",
                            cursor: "pointer",
                            position: "relative",
                            transition: "background 0.25s ease",
                            border: "1px solid",
                            borderColor:
                              employee.deletedAt === null
                                ? "#0cb5bf"
                                : "#d0d0d0",
                            pointerEvents: loading ? "none" : "auto", // Disable during loading
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            left: employee.deletedAt === null ? "18px" : "2px",
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
                        onClick={() => handleEditEmployee(employee.empId)}
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
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        count={totalRecords}
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
