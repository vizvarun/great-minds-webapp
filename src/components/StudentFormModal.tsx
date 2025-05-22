// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonIcon from "@mui/icons-material/Person";
import { updateStudent } from "../services/studentService";
import AuthService from "../services/auth";

interface StudentData {
  id?: number;
  enrollmentNo: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  dob: string;
  city: string;
  state: string;
  zipcode: string;
  gender: string;
  addressline1: string;
  addressline2?: string;
  profilePhoto?: string;
}

const initialStudentData: StudentData = {
  enrollmentNo: "",
  firstName: "",
  lastName: "",
  mobileNo: "",
  dob: "",
  city: "",
  state: "",
  zipcode: "",
  gender: "",
  addressline1: "",
  addressline2: "",
};

const mockStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

interface StudentFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (student: StudentData) => void;
  student?: StudentData;
  isEditMode?: boolean;
}

const StudentFormModal = ({
  open,
  onClose,
  onSubmit,
  student,
  isEditMode = false,
}: StudentFormModalProps) => {
  const [formData, setFormData] = useState<StudentData>(initialStudentData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof StudentData, string>>
  >({});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Initialize form data when student prop changes
  useEffect(() => {
    if (student) {
      setFormData({ ...student });
      if (student.profilePhoto) {
        setProfileImage(student.profilePhoto);
      }
    } else {
      setFormData(initialStudentData);
      setProfileImage(null);
    }
    setErrors({});
  }, [student]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setProfileImage(result);
        setFormData({
          ...formData,
          profilePhoto: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name as keyof StudentData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name as keyof StudentData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StudentData, string>> = {};
    let isValid = true;

    if (!formData.enrollmentNo?.trim()) {
      newErrors.enrollmentNo = "Enrollment number is required";
      isValid = false;
    }

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.mobileNo?.trim()) {
      newErrors.mobileNo = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
      isValid = false;
    }

    if (!formData.state) {
      newErrors.state = "State is required";
      isValid = false;
    }

    if (!formData.city?.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }

    if (!formData.zipcode?.trim()) {
      newErrors.zipcode = "Pin code is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(formData.zipcode)) {
      newErrors.zipcode = "Pin code must be 6 digits";
      isValid = false;
    }

    if (!formData.addressline1?.trim()) {
      newErrors.addressline1 = "Address is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Format the data to match the API expectations
        const school_id = AuthService.getSchoolId() || 0;
        const formattedData = {
          // Required API fields
          firstname: formData.firstName,
          lastname: formData.lastName,
          middlename: "", // Default empty string if not available
          enrollmentno: formData.enrollmentNo,
          email: formData.email || "", // Default empty string if not available
          mobileno: formData.mobileNo,
          schoolid: school_id,
          createdby: AuthService.getUserId() || 0,
          isactive: true,
          dob: formData.dob,
          addressline1: formData.addressline1,
          addressline2: formData.addressline2 || "",
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          gender: formData.gender,
          // Include id if in edit mode
          ...(isEditMode && student?.id ? { id: student.id } : {}),
        };

        if (isEditMode && student?.id) {
          await updateStudent(
            student.id,
            AuthService.getUserId() || 0,
            formattedData
          );
        }

        // Pass the formatted data to the parent component
        onSubmit(formattedData);
      } catch (error) {
        console.error("Error submitting student form:", error);
        // You might want to set an error state here to display to the user
      }
    }
  };

  // Radio button component for better reuse
  const RadioButton = ({ id, value, checked, label }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        mr: 3,
      }}
      onClick={() => setFormData({ ...formData, gender: value })}
    >
      <Box
        sx={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: "2px solid",
          borderColor: checked ? "primary.main" : "grey.400",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mr: 1,
        }}
      >
        {checked && (
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "primary.main",
            }}
          />
        )}
      </Box>
      <Typography
        component="label"
        htmlFor={id}
        variant="body2"
        sx={{
          fontWeight: checked ? 500 : 400,
          color: checked ? "text.primary" : "text.secondary",
        }}
      >
        {label}
      </Typography>
      <input
        type="radio"
        id={id}
        name="gender"
        value={value}
        checked={checked}
        onChange={handleChange}
        style={{ position: "absolute", opacity: 0 }}
      />
    </Box>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="student-form-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          // width: 900,
          maxWidth: "60%",
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Typography variant="h6" fontWeight="medium">
            {isEditMode ? "Edit Student" : "Add New Student"}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Student Information - Full Width */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Student Information
              </Typography>

              <Box
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                {/* Photo and Basic Info in same row */}
                <Grid container spacing={2}>
                  {/* Photo Section */}
                  <Grid item xs={12} sm={3} md={2}>
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "1/1",
                        borderRadius: 1,
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      {profileImage ? (
                        <Box
                          component="img"
                          src={profileImage}
                          alt="Student"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <PersonIcon sx={{ fontSize: 50, color: "grey.300" }} />
                      )}
                    </Box>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />

                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      startIcon={<CloudUploadIcon fontSize="small" />}
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.75rem",
                        py: 0.5,
                        borderRadius: 1,
                        borderColor: "grey.300",
                      }}
                    >
                      Upload
                    </Button>
                  </Grid>

                  {/* Basic Info Section - Right side of photo */}
                  <Grid item xs={12} sm={9} md={10}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <FormLabel
                          sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
                        >
                          Enrollment Number*
                        </FormLabel>
                        <TextField
                          fullWidth
                          name="enrollmentNo"
                          value={formData.enrollmentNo || ""}
                          onChange={handleChange}
                          placeholder="Enrollment number"
                          size="small"
                          // disabled={isEditMode}
                          error={!!errors.enrollmentNo}
                          helperText={errors.enrollmentNo}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <FormLabel
                          sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
                        >
                          First Name*
                        </FormLabel>
                        <TextField
                          fullWidth
                          name="firstName"
                          value={formData.firstName || ""}
                          onChange={handleChange}
                          placeholder="Enter first name"
                          size="small"
                          error={!!errors.firstName}
                          helperText={errors.firstName}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <FormLabel
                          sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
                        >
                          Last Name*
                        </FormLabel>
                        <TextField
                          fullWidth
                          name="lastName"
                          value={formData.lastName || ""}
                          onChange={handleChange}
                          placeholder="Enter last name"
                          size="small"
                          error={!!errors.lastName}
                          helperText={errors.lastName}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <FormLabel
                          sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
                        >
                          Phone Number*
                        </FormLabel>
                        <TextField
                          fullWidth
                          name="mobileNo"
                          value={formData.mobileNo || ""}
                          onChange={handleChange}
                          placeholder="Phone number"
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          error={!!errors.mobileNo}
                          helperText={errors.mobileNo}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <FormLabel
                          sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
                        >
                          Date of Birth*
                        </FormLabel>
                        <TextField
                          fullWidth
                          name="dob"
                          type="date"
                          value={formData.dob || ""}
                          onChange={handleChange}
                          size="small"
                          error={!!errors.dob}
                          helperText={errors.dob}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <FormLabel
                          sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
                        >
                          Gender*
                        </FormLabel>
                        <Box sx={{ display: "flex", pt: 1 }}>
                          <RadioButton
                            id="male"
                            value="M"
                            checked={formData.gender === "M"}
                            label="Male"
                          />
                          <RadioButton
                            id="female"
                            value="F"
                            checked={formData.gender === "F"}
                            label="Female"
                          />
                        </Box>
                        {errors.gender && (
                          <FormHelperText error>{errors.gender}</FormHelperText>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Address Information Section - Full Width */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Address Information
              </Typography>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormLabel
                      sx={{ fontWeight: 500, display: "block", mb: 1 }}
                    >
                      State*
                    </FormLabel>
                    <FormControl fullWidth size="small" error={!!errors.state}>
                      <Select
                        name="state"
                        value={formData.state || ""}
                        onChange={handleSelectChange}
                        displayEmpty
                      >
                        <MenuItem disabled value="">
                          Select state
                        </MenuItem>
                        {mockStates.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.state && (
                        <FormHelperText>{errors.state}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormLabel
                      sx={{ fontWeight: 500, display: "block", mb: 1 }}
                    >
                      City*
                    </FormLabel>
                    <TextField
                      fullWidth
                      name="city"
                      value={formData.city || ""}
                      onChange={handleChange}
                      placeholder="Enter city name"
                      size="small"
                      error={!!errors.city}
                      helperText={errors.city}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormLabel
                      sx={{ fontWeight: 500, display: "block", mb: 1 }}
                    >
                      Pin Code*
                    </FormLabel>
                    <TextField
                      fullWidth
                      name="zipcode"
                      value={formData.zipcode || ""}
                      onChange={handleChange}
                      placeholder="6-digit pin code"
                      inputProps={{ maxLength: 6 }}
                      size="small"
                      error={!!errors.zipcode}
                      helperText={errors.zipcode}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel
                      sx={{ fontWeight: 500, display: "block", mb: 1 }}
                    >
                      Address Line 1*
                    </FormLabel>
                    <TextField
                      fullWidth
                      name="addressline1"
                      value={formData.addressline1 || ""}
                      onChange={handleChange}
                      placeholder="Enter address line 1"
                      size="small"
                      error={!!errors.addressline1}
                      helperText={errors.addressline1}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel
                      sx={{ fontWeight: 500, display: "block", mb: 1 }}
                    >
                      Address Line 2 (Optional)
                    </FormLabel>
                    <TextField
                      fullWidth
                      name="addressline2"
                      value={formData.addressline2 || ""}
                      onChange={handleChange}
                      placeholder="Enter address line 2"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          {/* Action buttons */}
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: 1,
              borderColor: "divider",
              textAlign: "right",
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                mr: 2,
                textTransform: "none",
                borderColor: "grey.300",
                color: "text.primary",
                "&:hover": {
                  borderColor: "grey.400",
                  bgcolor: "transparent",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
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

export default StudentFormModal;
