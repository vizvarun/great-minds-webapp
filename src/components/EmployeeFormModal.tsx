// @ts-nocheck

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
  FormLabel,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { validateEmployeePhone } from "../services/employeeService";

interface EmployeeFormData {
  id?: number;
  employeeNo: string;
  firstName: string;
  lastName: string;
  designation: string;
  mobileNumber: string;
  middleName?: string;
  email?: string;
}

const initialFormData: EmployeeFormData = {
  employeeNo: "",
  firstName: "",
  lastName: "",
  designation: "",
  mobileNumber: "",
  middleName: "",
  email: "",
};

interface EmployeeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (employee: EmployeeFormData) => void;
  employee?: EmployeeFormData;
  isEditMode?: boolean;
}

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
  const [validateLoading, setValidateLoading] = useState(false);
  const [phoneValidated, setPhoneValidated] = useState(false);
  const [fieldsDisabled, setFieldsDisabled] = useState(true);

  // Common styles for consistent inputs with increased width
  const inputStyles = {
    borderRadius: 0.5, // Reduced border radius
    width: "100%", // Ensure all inputs have the same width
    minWidth: "250px", // Set a minimum width
  };

  // Specific styles for disabled inputs
  const disabledInputStyles = {
    ...inputStyles,
    bgcolor: "rgba(0, 0, 0, 0.05)",
    color: "text.disabled",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.15)",
    },
  };

  // Form field container style for consistent sizing
  const fieldContainerStyle = {
    width: "100%", // Full width container
  };

  // Initialize form data when employee prop changes
  useEffect(() => {
    if (employee) {
      setFormData({ ...employee });
      setFieldsDisabled(false); // In edit mode, all fields are enabled
      setPhoneValidated(true); // In edit mode, phone is already validated
    } else {
      setFormData(initialFormData);
      setFieldsDisabled(true); // In add mode, fields are initially disabled
      setPhoneValidated(false); // In add mode, phone is not yet validated
    }
    setErrors({});
  }, [employee, isEditMode]);

  const handleValidatePhone = async () => {
    // Check if the mobile number is valid
    if (
      !formData.mobileNumber.trim() ||
      !/^\d{10}$/.test(formData.mobileNumber)
    ) {
      setErrors({
        ...errors,
        mobileNumber: "Mobile number must be 10 digits",
      });
      return;
    }

    setValidateLoading(true);
    try {
      const result = await validateEmployeePhone(formData.mobileNumber);

      if (result.exists) {
        // Pre-fill form with existing data
        setFormData({
          ...formData,
          employeeNo: result.employeeNo || "",
          firstName: result.firstName || "",
          middleName: result.middleName || "",
          lastName: result.lastName || "",
          designation: result.designation || "",
          email: result.email || "",
        });

        // Keep fields disabled as we're using existing data
        setFieldsDisabled(false);
      } else {
        // Enable fields for new user input
        setFieldsDisabled(false);
      }

      setPhoneValidated(true);
    } catch (error) {
      console.error("Error validating phone:", error);
      setErrors({
        ...errors,
        mobileNumber: "Failed to validate phone number",
      });
    } finally {
      setValidateLoading(false);
    }
  };

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

    // Add validation for phone validation if not in edit mode
    if (!isEditMode && !phoneValidated) {
      newErrors.mobileNumber = "Phone number must be validated first";
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

    // If changing phone number, reset validation
    if (name === "mobileNumber" && phoneValidated) {
      setPhoneValidated(false);
      if (!isEditMode) {
        setFieldsDisabled(true);
      }
    }

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
                disabled={validateLoading}
                InputProps={{
                  sx: validateLoading ? disabledInputStyles : inputStyles,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={handleValidatePhone}
                        disabled={
                          validateLoading || (isEditMode && phoneValidated)
                        }
                        size="small"
                        variant="contained"
                        disableElevation
                        sx={{
                          textTransform: "none",
                          minWidth: "70px",
                          height: "30px",
                          fontSize: "0.75rem",
                        }}
                      >
                        {validateLoading ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : phoneValidated ? (
                          "Validated"
                        ) : (
                          "Validate"
                        )}
                      </Button>
                    </InputAdornment>
                  ),
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
                disabled={isEditMode || fieldsDisabled}
                size="small"
                InputProps={{
                  sx:
                    isEditMode || fieldsDisabled
                      ? disabledInputStyles
                      : inputStyles,
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
                disabled={fieldsDisabled}
                size="small"
                InputProps={{
                  sx: fieldsDisabled ? disabledInputStyles : inputStyles,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={fieldContainerStyle}>
              <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                Middle Name
              </FormLabel>
              <TextField
                name="middleName"
                value={formData.middleName || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Enter middle name (optional)"
                disabled={fieldsDisabled}
                size="small"
                InputProps={{
                  sx: fieldsDisabled ? disabledInputStyles : inputStyles,
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
                disabled={fieldsDisabled}
                size="small"
                InputProps={{
                  sx: fieldsDisabled ? disabledInputStyles : inputStyles,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={fieldContainerStyle}>
              <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                Email
              </FormLabel>
              <TextField
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Enter email (optional)"
                disabled={fieldsDisabled}
                size="small"
                InputProps={{
                  sx: fieldsDisabled ? disabledInputStyles : inputStyles,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={fieldContainerStyle}>
              <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                Designation
              </FormLabel>
              <TextField
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Enter designation"
                error={!!errors.designation}
                helperText={errors.designation}
                disabled={fieldsDisabled}
                size="small"
                InputProps={{
                  sx: fieldsDisabled ? disabledInputStyles : inputStyles,
                }}
              />
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
              disableRipple
              disabled={!isEditMode && !phoneValidated}
              sx={{
                px: 3,
                py: 1,
                textTransform: "none",
                borderRadius: 0.5,
                background: (theme) => theme.palette.primary.main,
                color: "white",
                backgroundImage: "none",
                outline: "none",
                transition: "none",
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
                  transform: "none",
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
