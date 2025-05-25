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
import AuthService from "../services/auth";

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
  const [showFullForm, setShowFullForm] = useState(false);

  // Add state to track the validated user and employee status
  const [validatedUserId, setValidatedUserId] = useState<number | null>(null);
  const [employeeExists, setEmployeeExists] = useState(false);

  // Add additional state to track validation response data
  const [validationResponse, setValidationResponse] = useState(null);

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

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      if (employee && isEditMode) {
        // Map the fields correctly for edit mode
        setFormData({
          ...employee,
          // Handle property name differences
          employeeNo: employee.employeeNo || employee.empNo || "",
          mobileNumber: employee.mobileNumber || employee.mobileNo || "",
        });
        setFieldsDisabled(false);
        setPhoneValidated(true);
        setShowFullForm(true);
        // Make sure validateLoading is reset to false in edit mode
        setValidateLoading(false);
      } else {
        // Reset to initial state for new modal
        setFormData(initialFormData);
        setFieldsDisabled(true);
        setPhoneValidated(false);
        setShowFullForm(false);
        // Reset loading state for new entries as well
        setValidateLoading(false);
      }
      setErrors({});
    }
  }, [open, employee, isEditMode]);

  // Handle closing modal with proper cleanup
  const handleModalClose = () => {
    // Reset state when modal closes
    setFormData(initialFormData);
    setErrors({});
    setPhoneValidated(false);
    setFieldsDisabled(true);
    setShowFullForm(false);

    // Call the parent onClose
    onClose();
  };

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

      // Store the complete validation response for later use
      setValidationResponse(result);

      // Handle the API response format
      if (result && result.status === "success" && result.data) {
        const { user, employee: empData } = result.data;

        // Check if employee exists based on whether empId is present and not empty
        const hasEmployee = empData && empData.empId && empData.empId !== "";
        setEmployeeExists(hasEmployee);

        // Store the user ID for later use in the submission
        if (user && user.userId) {
          setValidatedUserId(user.userId);
        } else {
          setValidatedUserId(null);
        }

        if (hasEmployee) {
          // Both user and employee exist
          setErrors({
            ...errors,
            mobileNumber:
              "An employee with this mobile number already exists with ID: " +
              empData.empNo,
          });
          // Keep fields disabled
          setFieldsDisabled(true);
          setPhoneValidated(true);
        } else {
          // Employee doesn't exist, but user might
          // Pre-fill form with existing user data if available
          if (user) {
            setFormData({
              ...formData,
              firstName: user.firstName || "",
              middleName: user.middleName || "",
              lastName: user.lastName || "",
              // If user has mobileNo property, use it
              mobileNumber: user.mobileNo || formData.mobileNumber,
            });
          }

          setFieldsDisabled(false);
          setPhoneValidated(true);
          setShowFullForm(true);
        }
      } else {
        // Handle case where no data is returned but validation was successful
        setValidatedUserId(null);
        setEmployeeExists(false);
        setFieldsDisabled(false);
        setPhoneValidated(true);
        setShowFullForm(true);
      }
    } catch (error) {
      console.error("Error validating phone:", error);
      setErrors({
        ...errors,
        mobileNumber: "Failed to validate phone number",
      });
      // Even if there's an error, we still show the form fields to allow manual entry
      setValidatedUserId(null);
      setEmployeeExists(false);
      setFieldsDisabled(false);
      setPhoneValidated(true);
      setShowFullForm(true);
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
        setShowFullForm(false);
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
      try {
        // Get school ID and current user ID
        const school_id = AuthService.getSchoolId() || 4;
        const current_user_id = AuthService.getUserId() || 0;

        let payload;

        if (isEditMode) {
          // Use existing submit format for edit mode
          payload = {
            ...formData,
            empNo: formData.employeeNo,
            mobileNo: formData.mobileNumber,
          };
        } else {
          // Create the appropriate payload based on validation results
          if (validatedUserId) {
            // User exists, but employee doesn't - just create employee linked to user
            payload = {
              employee: {
                user_id_of_emp: validatedUserId,
                school_id: school_id,
                emp_no: formData.employeeNo,
                designation: formData.designation,
              },
            };
          } else {
            // Neither user nor employee exists - create both
            payload = {
              employee: {
                school_id: school_id,
                emp_no: formData.employeeNo,
                designation: formData.designation,
              },
              user: {
                email: formData.email || "",
                mobileno: formData.mobileNumber,
                first_name: formData.firstName,
                last_name: formData.lastName || "",
                middle_name: formData.middleName || "",
                createdby: current_user_id,
              },
            };
          }
        }

        console.log("Submitting employee data with payload:", payload);
        setValidateLoading(true);
        onSubmit(payload);
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrors({
          ...errors,
          employeeNo: "Error saving employee. Please try again.",
        });
        setValidateLoading(false);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose} // Use our custom close handler
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
            onClick={handleModalClose} // Use our custom close handler
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
                          borderRadius: 0.5,
                          transition: "none",
                          backgroundImage: "none", // Remove gradient
                          background: "primary.main", // Use solid color
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

            {/* Only show the rest of the form after validation or in edit mode */}
            {showFullForm && (
              <>
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
                    disabled={fieldsDisabled} // Only use fieldsDisabled
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
              </>
            )}
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Display a warning if employee already exists */}
          {/* {employeeExists && (
            <Box
              sx={{
                p: 2,
                mb: 3,
                bgcolor: "#0e9384",
                color: "warning.dark",
                borderRadius: 1,
                border: 1,
                borderColor: "#0e9384",
              }}
            >
              <Typography variant="body2" color="white">
                An employee with this mobile number already exists in the
                system.
              </Typography>
            </Box>
          )} */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleModalClose} // Use our custom close handler
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
              disabled={!isEditMode && (!phoneValidated || !showFullForm)}
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
