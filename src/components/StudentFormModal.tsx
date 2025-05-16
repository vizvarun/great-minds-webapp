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
  Tab,
  Tabs,
  TextField,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface StudentData {
  id?: number;
  enrollmentNo: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  city: string;
  state: string;
  pincode: string;
  gender: string;
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

const initialStudentData: StudentData = {
  enrollmentNo: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  dateOfBirth: "",
  city: "",
  state: "",
  pincode: "",
  gender: "",
  addressLine1: "",
  addressLine2: "",
  // Father details
  fatherFirstName: "",
  fatherLastName: "",
  fatherPhoneNumber: "",
  fatherEmail: "",
  // Mother details
  motherFirstName: "",
  motherLastName: "",
  motherPhoneNumber: "",
  motherEmail: "",
  // Guardian details
  guardianFirstName: "",
  guardianLastName: "",
  guardianPhoneNumber: "",
  guardianEmail: "",
};

// Mock data for dropdowns
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && <Box sx={{ pt: 2, width: "100%" }}>{children}</Box>}
    </div>
  );
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
  const [tabValue, setTabValue] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Common styles for consistent inputs with no outlines
  const inputStyles = {
    borderRadius: 0.5,
    width: "100%",
    minWidth: "250px",
    outline: "none",
    "&:focus": {
      outline: "none",
    },
  };

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

  // Tab change handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

    // Basic validation rules based on the current tab
    if (tabValue === 0) {
      // Student details tab
      if (!formData.enrollmentNo.trim()) {
        newErrors.enrollmentNo = "Enrollment number is required";
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

      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Phone number must be 10 digits";
        isValid = false;
      }

      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required";
        isValid = false;
      }

      if (!formData.state) {
        newErrors.state = "State is required";
        isValid = false;
      }

      if (!formData.city.trim()) {
        newErrors.city = "City is required";
        isValid = false;
      }

      if (!formData.pincode.trim()) {
        newErrors.pincode = "Pin code is required";
        isValid = false;
      } else if (!/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = "Pin code must be 6 digits";
        isValid = false;
      }

      if (!formData.addressLine1.trim()) {
        newErrors.addressLine1 = "Address is required";
        isValid = false;
      }
    } else if (tabValue === 1) {
      // Father details tab
      if (!formData.fatherFirstName.trim()) {
        newErrors.fatherFirstName = "First name is required";
        isValid = false;
      }

      if (!formData.fatherLastName.trim()) {
        newErrors.fatherLastName = "Last name is required";
        isValid = false;
      }

      if (!formData.fatherPhoneNumber.trim()) {
        newErrors.fatherPhoneNumber = "Phone number is required";
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.fatherPhoneNumber)) {
        newErrors.fatherPhoneNumber = "Phone number must be 10 digits";
        isValid = false;
      }

      // Email validation if provided
      if (formData.fatherEmail && !/\S+@\S+\.\S+/.test(formData.fatherEmail)) {
        newErrors.fatherEmail = "Invalid email format";
        isValid = false;
      }
    } else if (tabValue === 2) {
      // Mother details tab
      if (!formData.motherFirstName.trim()) {
        newErrors.motherFirstName = "First name is required";
        isValid = false;
      }

      if (!formData.motherLastName.trim()) {
        newErrors.motherLastName = "Last name is required";
        isValid = false;
      }

      if (!formData.motherPhoneNumber.trim()) {
        newErrors.motherPhoneNumber = "Phone number is required";
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.motherPhoneNumber)) {
        newErrors.motherPhoneNumber = "Phone number must be 10 digits";
        isValid = false;
      }

      // Email validation if provided
      if (formData.motherEmail && !/\S+@\S+\.\S+/.test(formData.motherEmail)) {
        newErrors.motherEmail = "Invalid email format";
        isValid = false;
      }
    } else if (tabValue === 3) {
      // Guardian details tab
      if (
        formData.guardianFirstName ||
        formData.guardianLastName ||
        formData.guardianPhoneNumber ||
        formData.guardianEmail
      ) {
        if (!formData.guardianFirstName.trim()) {
          newErrors.guardianFirstName = "First name is required";
          isValid = false;
        }

        if (!formData.guardianLastName.trim()) {
          newErrors.guardianLastName = "Last name is required";
          isValid = false;
        }

        if (!formData.guardianPhoneNumber.trim()) {
          newErrors.guardianPhoneNumber = "Phone number is required";
          isValid = false;
        } else if (!/^\d{10}$/.test(formData.guardianPhoneNumber)) {
          newErrors.guardianPhoneNumber = "Phone number must be 10 digits";
          isValid = false;
        }

        // Email validation if provided
        if (
          formData.guardianEmail &&
          !/\S+@\S+\.\S+/.test(formData.guardianEmail)
        ) {
          newErrors.guardianEmail = "Invalid email format";
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all tabs before submission
    const currentTab = tabValue;

    // Temporarily check all tabs
    let allTabsValid = true;
    for (let i = 0; i < 4; i++) {
      setTabValue(i);
      if (!validateForm()) {
        allTabsValid = false;
        break;
      }
    }

    // Reset to the original tab
    setTabValue(currentTab);

    if (allTabsValid) {
      onSubmit(formData);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="student-form-modal"
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
          width: 900,
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
            {isEditMode ? "Edit Student" : "Add New Student"}
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

        <Box>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "0.95rem",
                px: 3,
                py: 1.5,
                outline: "none",
              },
              "& .Mui-selected": {
                outline: "none",
              },
              "& .MuiTabs-indicator": {
                height: 3,
              },
            }}
          >
            <Tab label="Student" disableRipple />
            <Tab label="Father" disableRipple />
            <Tab label="Mother" disableRipple />
            <Tab label="Guardian" disableRipple />
          </Tabs>

          <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, pt: 3 }}>
            {/* Student Details Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                {/* Profile photo is now the first thing */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 220,
                        height: 220,
                        border: "1px dashed",
                        borderColor: "grey.300",
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 2,
                        overflow: "hidden",
                        backgroundColor: "grey.50",
                      }}
                    >
                      {profileImage ? (
                        <Box
                          component="img"
                          src={profileImage}
                          alt="Student Photo Preview"
                          sx={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <Typography
                          color="text.secondary"
                          align="center"
                          sx={{ px: 2 }}
                        >
                          No photo uploaded yet
                        </Typography>
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
                      startIcon={<CloudUploadIcon />}
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        textTransform: "none",
                        borderRadius: 0.5,
                        transition: "none",
                        outline: "none",
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      Upload Photo
                    </Button>
                  </Box>
                </Grid>

                {/* Form fields using the full width */}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
                        Enrollment Number
                      </FormLabel>
                      <TextField
                        name="enrollmentNo"
                        value={formData.enrollmentNo}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter enrollment number"
                        error={!!errors.enrollmentNo}
                        helperText={errors.enrollmentNo}
                        disabled={isEditMode}
                        size="small"
                        InputProps={{
                          sx: inputStyles,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
                        Phone Number
                      </FormLabel>
                      <TextField
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        placeholder="10-digit phone number"
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                        inputProps={{ maxLength: 10 }}
                        size="small"
                        InputProps={{
                          sx: inputStyles,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
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

                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
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

                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
                        Date of Birth
                      </FormLabel>
                      <TextField
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth}
                        size="small"
                        InputProps={{
                          sx: inputStyles,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
                        Gender
                      </FormLabel>
                      <TextField
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Gender"
                        error={!!errors.gender}
                        helperText={errors.gender}
                        size="small"
                        InputProps={{
                          sx: inputStyles,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
                        State
                      </FormLabel>
                      <FormControl
                        fullWidth
                        error={!!errors.state}
                        size="small"
                      >
                        <Select
                          name="state"
                          value={formData.state}
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

                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
                        City
                      </FormLabel>
                      <TextField
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter city name"
                        error={!!errors.city}
                        helperText={errors.city}
                        size="small"
                        InputProps={{
                          sx: inputStyles,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
                        Pin Code
                      </FormLabel>
                      <TextField
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        placeholder="6-digit pin code"
                        error={!!errors.pincode}
                        helperText={errors.pincode}
                        inputProps={{ maxLength: 6 }}
                        size="small"
                        InputProps={{
                          sx: inputStyles,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
                        Address Line 1
                      </FormLabel>
                      <TextField
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter address line 1"
                        error={!!errors.addressLine1}
                        helperText={errors.addressLine1}
                        size="small"
                        InputProps={{
                          sx: inputStyles,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
                        Address Line 2 (Optional)
                      </FormLabel>
                      <TextField
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter address line 2"
                        size="small"
                        InputProps={{
                          sx: inputStyles,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Father Details Tab - now using horizontal layout */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                    First Name
                  </FormLabel>
                  <TextField
                    name="fatherFirstName"
                    value={formData.fatherFirstName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter father's first name"
                    error={!!errors.fatherFirstName}
                    helperText={errors.fatherFirstName}
                    size="small"
                    InputProps={{
                      sx: inputStyles,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                    Last Name
                  </FormLabel>
                  <TextField
                    name="fatherLastName"
                    value={formData.fatherLastName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter father's last name"
                    error={!!errors.fatherLastName}
                    helperText={errors.fatherLastName}
                    size="small"
                    InputProps={{
                      sx: inputStyles,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                    Phone Number
                  </FormLabel>
                  <TextField
                    name="fatherPhoneNumber"
                    value={formData.fatherPhoneNumber}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="10-digit phone number"
                    error={!!errors.fatherPhoneNumber}
                    helperText={errors.fatherPhoneNumber}
                    inputProps={{ maxLength: 10 }}
                    size="small"
                    InputProps={{
                      sx: inputStyles,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                    Email Address
                  </FormLabel>
                  <TextField
                    name="fatherEmail"
                    type="email"
                    value={formData.fatherEmail}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter father's email address"
                    error={!!errors.fatherEmail}
                    helperText={errors.fatherEmail}
                    size="small"
                    InputProps={{
                      sx: inputStyles,
                    }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Mother Details Tab - now using horizontal layout */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                    First Name
                  </FormLabel>
                  <TextField
                    name="motherFirstName"
                    value={formData.motherFirstName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter mother's first name"
                    error={!!errors.motherFirstName}
                    helperText={errors.motherFirstName}
                    size="small"
                    InputProps={{
                      sx: inputStyles,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                    Last Name
                  </FormLabel>
                  <TextField
                    name="motherLastName"
                    value={formData.motherLastName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter mother's last name"
                    error={!!errors.motherLastName}
                    helperText={errors.motherLastName}
                    size="small"
                    InputProps={{
                      sx: inputStyles,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                    Phone Number
                  </FormLabel>
                  <TextField
                    name="motherPhoneNumber"
                    value={formData.motherPhoneNumber}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="10-digit phone number"
                    error={!!errors.motherPhoneNumber}
                    helperText={errors.motherPhoneNumber}
                    inputProps={{ maxLength: 10 }}
                    size="small"
                    InputProps={{
                      sx: inputStyles,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                    Email Address
                  </FormLabel>
                  <TextField
                    name="motherEmail"
                    type="email"
                    value={formData.motherEmail}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter mother's email address"
                    error={!!errors.motherEmail}
                    helperText={errors.motherEmail}
                    size="small"
                    InputProps={{
                      sx: inputStyles,
                    }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Guardian Details Tab - now using horizontal layout */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Guardian details are optional. Fill this section only if
                  different from parents.
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                    First Name
                  </FormLabel>
                  <TextField
                    name="guardianFirstName"
                    value={formData.guardianFirstName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter guardian's first name"
                    error={!!errors.guardianFirstName}
                    helperText={errors.guardianFirstName}
                    size="small"
                    InputProps={{
                      sx: inputStyles,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                    Last Name
                  </FormLabel>
                  <TextField
                    name="guardianLastName"
                    value={formData.guardianLastName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter guardian's last name"
                    error={!!errors.guardianLastName}
                    helperText={errors.guardianLastName}
                    size="small"
                    InputProps={{
                      sx: inputStyles,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                    Phone Number
                  </FormLabel>
                  <TextField
                    name="guardianPhoneNumber"
                    value={formData.guardianPhoneNumber}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="10-digit phone number"
                    error={!!errors.guardianPhoneNumber}
                    helperText={errors.guardianPhoneNumber}
                    inputProps={{ maxLength: 10 }}
                    size="small"
                    InputProps={{
                      sx: inputStyles,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                    Email Address
                  </FormLabel>
                  <TextField
                    name="guardianEmail"
                    type="email"
                    value={formData.guardianEmail}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter guardian's email address"
                    error={!!errors.guardianEmail}
                    helperText={errors.guardianEmail}
                    size="small"
                    InputProps={{
                      sx: inputStyles,
                    }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <Divider sx={{ my: 4 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                {tabValue > 0 && (
                  <Button
                    variant="outlined"
                    onClick={() => setTabValue(tabValue - 1)}
                    disableRipple
                    sx={{
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
                      },
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                  >
                    Previous
                  </Button>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={onClose}
                  disableRipple
                  sx={{
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
                    },
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  Cancel
                </Button>

                {tabValue < 3 ? (
                  <Button
                    variant="contained"
                    disableElevation
                    disableRipple
                    onClick={() => setTabValue(tabValue + 1)}
                    sx={{
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
                      },
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    disableRipple
                    sx={{
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
                      },
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                  >
                    {isEditMode ? "Update" : "Save"}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default StudentFormModal;
