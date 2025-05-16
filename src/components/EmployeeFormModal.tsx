import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
  FormLabel,
} from "@mui/material";
import { useEffect, useState } from "react";

interface EmployeeFormData {
  id?: number;
  employeeNo: string;
  firstName: string;
  lastName: string;
  designation: string;
  mobileNumber: string;
}

const initialFormData: EmployeeFormData = {
  employeeNo: "",
  firstName: "",
  lastName: "",
  designation: "",
  mobileNumber: "",
};

interface EmployeeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (employee: EmployeeFormData) => void;
  employee?: EmployeeFormData;
  isEditMode?: boolean;
}

// Mock designations for dropdown
const designations = [
  "Principal",
  "Vice Principal",
  "Administrator",
  "Teacher",
  "Librarian",
  "Accountant",
  "Office Staff",
  "Physical Education",
  "Mathematics Teacher",
  "Science Teacher",
  "English Teacher",
  "History Teacher",
  "Art Teacher",
  "Computer Science",
  "Counselor",
  "Security",
  "Janitor",
  "Bus Driver",
  "Cafeteria Staff",
  "Maintenance",
];

const EmployeeFormModal = ({
  open,
  onClose,
  onSubmit,
  employee,
  isEditMode = false,
}: EmployeeFormModalProps) => {
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EmployeeFormData, string>>
  >({});

  // Common styles for consistent inputs with increased width
  const inputStyles = {
    borderRadius: 0.5, // Reduced border radius
    width: "100%", // Ensure all inputs have the same width
    minWidth: "250px", // Set a minimum width
  };

  // Form field container style for consistent sizing
  const fieldContainerStyle = {
    width: "100%", // Full width container
  };

  // Initialize form data when employee prop changes
  useEffect(() => {
    if (employee) {
      setFormData({ ...employee });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [employee]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};
    let isValid = true;

    // Required field validation
    if (!formData.employeeNo.trim()) {
      newErrors.employeeNo = "Employee ID is required";
      isValid = false;
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
      isValid = false;
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name as keyof EmployeeFormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name as keyof EmployeeFormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="employee-form-modal"
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
          width: 700,
          maxWidth: "95%",
          maxHeight: "95%",
          overflow: "auto",
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
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "primary.light",
            color: "white",
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {isEditMode ? "Edit Employee" : "Add New Employee"}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={fieldContainerStyle}>
              <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                Mobile Number
              </FormLabel>
              <TextField
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="10-digit mobile number"
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
                inputProps={{ maxLength: 10 }}
                size="small"
                InputProps={{
                  sx: inputStyles,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={fieldContainerStyle}>
              <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                Employee ID
              </FormLabel>
              <TextField
                name="employeeNo"
                value={formData.employeeNo}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Enter employee ID"
                error={!!errors.employeeNo}
                helperText={errors.employeeNo}
                disabled={isEditMode}
                size="small"
                InputProps={{
                  sx: inputStyles,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={fieldContainerStyle}>
              <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                First Name
              </FormLabel>
              <TextField
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Enter first name"
                error={!!errors.firstName}
                helperText={errors.firstName}
                size="small"
                InputProps={{
                  sx: inputStyles,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={fieldContainerStyle}>
              <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                Last Name
              </FormLabel>
              <TextField
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Enter last name"
                error={!!errors.lastName}
                helperText={errors.lastName}
                size="small"
                InputProps={{
                  sx: inputStyles,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={fieldContainerStyle}>
              <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                Designation
              </FormLabel>
              <FormControl fullWidth error={!!errors.designation} size="small">
                <Select
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleSelectChange}
                  displayEmpty
                  sx={{
                    ...inputStyles,
                    "& .MuiSelect-select": {
                      width: "100%",
                    },
                  }}
                >
                  <MenuItem disabled value="">
                    Select designation
                  </MenuItem>
                  {designations.map((designation) => (
                    <MenuItem key={designation} value={designation}>
                      {designation}
                    </MenuItem>
                  ))}
                </Select>
                {errors.designation && (
                  <FormHelperText>{errors.designation}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              disableRipple
              sx={{
                px: 3,
                py: 1,
                textTransform: "none",
                borderRadius: 0.5,
                backgroundColor: "transparent",
                outline: "none",
                border: "1px solid",
                borderColor: (theme) => theme.palette.primary.main,
                transition: "none",
                "&.MuiButton-outlined:hover": {
                  backgroundColor: "transparent",
                  border: "1px solid",
                  borderColor: (theme) => theme.palette.primary.main,
                },
                "&:hover": {
                  backgroundColor: "transparent",
                  border: "1px solid",
                },
                "&:active, &.Mui-focusVisible, &:focus": {
                  outline: "none",
                  boxShadow: "none",
                  border: "1px solid",
                  borderColor: (theme) => theme.palette.primary.main,
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              disableRipple // Disable ripple effect
              sx={{
                px: 3,
                py: 1,
                textTransform: "none",
                borderRadius: 0.5,
                background: (theme) => theme.palette.primary.main,
                color: "white",
                backgroundImage: "none",
                outline: "none",
                transition: "none", // Remove all transition effects
                "&:hover": {
                  backgroundImage: "none",
                  background: (theme) => theme.palette.primary.main,
                  boxShadow: "none",
                  transition: "none",
                },
                "&:focus": {
                  outline: "none",
                  boxShadow: "none",
                },
                "&:active": {
                  transform: "none", // Prevent any transform on click
                  boxShadow: "none",
                },
              }}
            >
              {isEditMode ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default EmployeeFormModal;
