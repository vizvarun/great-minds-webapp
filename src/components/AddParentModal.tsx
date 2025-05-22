//@ts-nocheck

import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonIcon from "@mui/icons-material/Person";
import api from "../services/api";
import AuthService from "../services/auth"; // Add missing import for AuthService
import {
  getParentsForStudent,
  validateMobileNumber,
  createParent,
  linkParent,
  updateParent,
  type Parent,
} from "../services/parentService";

interface AddParentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { relationship: string; mobileNumber: string }) => void;
  studentId: number;
  studentName?: string;
}

const relationships = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "guardian", label: "Guardian" },
];

const AddParentModal = ({
  open,
  onClose,
  onSubmit,
  studentId,
  studentName = "Student",
}: AddParentModalProps) => {
  const [relationship, setRelationship] = useState("father");
  const [isValidating, setIsValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [existingParents, setExistingParents] = useState<Parent[]>([]);
  const [currentParent, setCurrentParent] = useState<Parent | null>(null);
  const [validatedUserId, setValidatedUserId] = useState<number | null>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [serverFilename, setServerFilename] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"validate" | "create" | "edit">("validate");
  const [fieldsModified, setFieldsModified] = useState(false);

  useEffect(() => {
    if (open && studentId) {
      fetchParents();
    } else {
      resetForm();
    }
  }, [open, studentId]);

  useEffect(() => {
    if (existingParents.length > 0) {
      const parent = existingParents.find((p) => p.parenttype === relationship);
      if (parent) {
        setCurrentParent(parent);
        setMode("edit");
        populateFormWithParent(parent);
      } else {
        setCurrentParent(null);
        setMode("validate");
        resetFormFields();
      }
    }
  }, [relationship, existingParents]);

  const fetchParents = async () => {
    setIsLoading(true);
    try {
      const parents = await getParentsForStudent(studentId);
      setExistingParents(parents);

      const parent = parents.find((p) => p.parenttype === relationship);
      if (parent) {
        setCurrentParent(parent);
        setMode("edit");
        populateFormWithParent(parent);
      } else {
        setCurrentParent(null);
        setMode("validate");
      }
    } catch (error) {
      console.error("Error fetching parents:", error);
      setError("Failed to load parent information");
    } finally {
      setIsLoading(false);
    }
  };

  const populateFormWithParent = (parent: Parent) => {
    setMobileNumber(parent.mobileno || "");
    setFirstName(parent.firstname || "");
    setMiddleName(parent.middlename || "");
    setLastName(parent.lastname || "");
    setEmail(parent.email || "");
    setProfileImage(parent.profilepic || null);
    setServerFilename(parent.profilepic || null);
  };

  const resetFormFields = () => {
    setMobileNumber("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setEmail("");
    setProfileImage(null);
    setServerFilename(null);
    setValidatedUserId(null);
    setError("");
    setSuccessMessage("");
    setFieldsModified(false);
  };

  const resetForm = () => {
    resetFormFields();
    setRelationship("father");
    setMode("validate");
    setExistingParents([]);
    setCurrentParent(null);
  };

  const handleRelationshipChange = (event) => {
    setRelationship(event.target.value);
    setError("");
    setSuccessMessage("");
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "mobileNumber") {
      if (value === "" || /^[0-9\b]+$/.test(value)) {
        setMobileNumber(value);
        setError("");
        if (mode === "create" && validatedUserId) {
          setFieldsModified(true);
        }
      }
    } else {
      switch (field) {
        case "firstName":
          setFirstName(value);
          break;
        case "middleName":
          setMiddleName(value);
          break;
        case "lastName":
          setLastName(value);
          break;
        case "email":
          setEmail(value);
          break;
        default:
          break;
      }

      if (mode === "create" && validatedUserId) {
        setFieldsModified(true);
      }
    }
  };

  const validateMobileNumberHandler = async () => {
    if (!mobileNumber.trim() || !/^\d{10}$/.test(mobileNumber)) {
      setError("Mobile number must be 10 digits");
      return;
    }

    setIsValidating(true);
    setError("");
    setFieldsModified(false);

    try {
      const validationResult = await validateMobileNumber(mobileNumber);

      const userData = validationResult?.data?.user || validationResult?.user;

      if (userData) {
        const userId = userData.userId;
        setValidatedUserId(userId);

        setFirstName(userData.firstName || "");
        setMiddleName(userData.middleName || "");
        setLastName(userData.lastName || "");
        setEmail(userData.email || "");

        if (userData.profilepic) {
          setProfileImage(userData.profilepic);
          setServerFilename(userData.profilepic);
        }

        setMode("create");

        if (userId && userId > 0) {
          setSuccessMessage("User found. You can edit details if needed.");
        } else {
          setSuccessMessage(
            "Mobile number validated. Please complete the form."
          );
        }
      } else {
        setValidatedUserId(null);
        setMode("create");
        setSuccessMessage("Mobile number validated. Please complete the form.");
      }
    } catch (err) {
      console.error("Error validating mobile number:", err);
      setError("Failed to validate mobile number");
      setMode("create");
    } finally {
      setIsValidating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setProfileImage(result);
      };
      reader.readAsDataURL(file);

      try {
        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post(
          "/upload/folder?folder=parents",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data && response.data.filename) {
          const filename = response.data.filename;
          setServerFilename(filename);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!validatedUserId) return;

    setIsSaving(true);
    setError("");

    try {
      // Get current user ID for the query parameter
      const currentUserId = AuthService.getUserId() || 0;

      // Format request body according to API requirements
      const userData = {
        mobileno: mobileNumber,
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName || "",
        email: email || "",
        createdby: currentUserId,
        profilepic: serverFilename || null,
      };

      // Use the correct API endpoint format with query parameter
      const response = await api.put(
        `/user/user_id?user_id=${currentUserId}`,
        userData
      );

      if (response.status === 200) {
        setSuccessMessage("User details updated successfully");
        setFieldsModified(false);
      } else {
        setError("Failed to update user details");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobileNumber || !firstName) {
      setError("Mobile number and first name are required");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const parentData = {
        mobileno: mobileNumber,
        first_name: firstName,
        middle_name: middleName || "",
        last_name: lastName || "",
        email: email || "",
        profilepic: serverFilename || null,
      };

      let success = false;

      if (mode === "edit" && currentParent) {
        success = await updateParent(currentParent.id, parentData);
        if (success) {
          setSuccessMessage(
            `${getRelationshipLabel()} information updated successfully`
          );
        }
      } else if (mode === "create") {
        if (validatedUserId) {
          success = await linkParent(studentId, validatedUserId, relationship);
          if (success) {
            setSuccessMessage(`${getRelationshipLabel()} linked successfully`);
          }
        } else {
          success = await createParent(studentId, relationship, parentData);
          if (success) {
            setSuccessMessage(`${getRelationshipLabel()} added successfully`);
          }
        }
      }

      if (success) {
        fetchParents();
        onSubmit({
          relationship,
          mobileNumber,
        });
      } else {
        setError("Failed to save parent information");
      }
    } catch (err) {
      console.error("Error saving parent:", err);
      setError("Failed to save parent information");
    } finally {
      setIsSaving(false);
    }
  };

  const getRelationshipLabel = () => {
    const rel = relationships.find((r) => r.value === relationship);
    return rel ? rel.label : "Parent";
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleClearForm = () => {
    resetFormFields();
    setMode("validate");
    setValidatedUserId(null);
  };

  const handleUnlinkParent = async () => {
    if (!currentParent || !studentId) {
      setError("Missing required information to unlink parent");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const userId = AuthService.getUserId() || 0;
      const endpoint = `/students/parent/remove?user_id=${userId}&student_id=${studentId}&parent_id=${currentParent.id}`;

      const response = await api.delete(endpoint);

      if (response.status === 200 || response.status === 204) {
        setSuccessMessage(`${getRelationshipLabel()} unlinked successfully`);
        resetFormFields();
        fetchParents();
        setMode("validate");
      } else {
        setError("Failed to unlink parent");
      }
    } catch (error) {
      console.error("Error unlinking parent:", error);
      setError("Failed to unlink parent");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-parent-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 600,
          maxWidth: "95%",
          maxHeight: "95%",
          overflow: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
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
          <Box>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              {currentParent
                ? `Edit ${getRelationshipLabel()}`
                : `Add ${getRelationshipLabel()}`}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 0.5, opacity: 0.9 }}>
              {studentName}
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
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

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            <Box sx={{ mb: 3 }}>
              <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                Relationship
              </FormLabel>
              <FormControl fullWidth size="small">
                <Select
                  value={relationship}
                  onChange={handleRelationshipChange}
                  sx={{ width: "100%" }}
                >
                  {relationships.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                Mobile Number*
              </FormLabel>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <TextField
                  fullWidth
                  value={mobileNumber}
                  onChange={handleChange("mobileNumber")}
                  placeholder="10-digit mobile number"
                  error={!!error && error.includes("mobile")}
                  size="small"
                  inputProps={{ maxLength: 10 }}
                  disabled={mode !== "validate" || isValidating}
                  InputProps={{
                    endAdornment:
                      mode === "validate" ? (
                        <InputAdornment position="end">
                          <Button
                            onClick={validateMobileNumberHandler}
                            disabled={
                              isValidating ||
                              !mobileNumber ||
                              mobileNumber.length !== 10
                            }
                            size="small"
                            variant="outlined"
                            sx={{
                              textTransform: "none",
                              minWidth: "70px",
                              height: "32px",
                              fontSize: "0.75rem",
                              borderRadius: 0.5,
                              borderColor: "grey.300",
                              color: "text.primary",
                              "&:hover": {
                                borderColor: "grey.400",
                                bgcolor: "transparent",
                              },
                            }}
                          >
                            {isValidating ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              "Validate"
                            )}
                          </Button>
                        </InputAdornment>
                      ) : undefined,
                  }}
                />

                {mode === "create" && (
                  <Button
                    onClick={handleClearForm}
                    size="small"
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      height: "32px",
                      fontSize: "0.75rem",
                      borderRadius: 0.5,
                      borderColor: "grey.300",
                      color: "text.primary",
                      minWidth: "auto",
                      whiteSpace: "nowrap",
                      px: 2,
                      "&:hover": {
                        borderColor: "grey.400",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    Clear
                  </Button>
                )}

                {currentParent && mode === "edit" && (
                  <Button
                    onClick={handleUnlinkParent}
                    size="small"
                    variant="outlined"
                    color="error"
                    disabled={isSaving}
                    sx={{
                      textTransform: "none",
                      height: "32px",
                      fontSize: "0.75rem",
                      borderRadius: 0.5,
                      minWidth: "auto",
                      whiteSpace: "nowrap",
                      px: 2,
                      "&:hover": {
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    Unlink
                  </Button>
                )}
              </Box>
            </Box>

            {(mode === "create" || mode === "edit") && (
              <>
                <Grid container spacing={2}>
                  <Box sx={{ mb: 3 }}>
                    <FormLabel
                      sx={{ mb: 1, display: "block", fontWeight: 500 }}
                    >
                      Profile Photo
                    </FormLabel>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "50%",
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          bgcolor: "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                          position: "relative",
                        }}
                      >
                        {isUploading && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(255,255,255,0.7)",
                              zIndex: 1,
                            }}
                          >
                            <Typography variant="caption">
                              Uploading...
                            </Typography>
                          </Box>
                        )}
                        {profileImage ? (
                          <Box
                            component="img"
                            src={profileImage}
                            alt="Parent"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <PersonIcon
                            sx={{ fontSize: 50, color: "grey.300" }}
                          />
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
                        startIcon={<CloudUploadIcon fontSize="small" />}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        sx={{
                          textTransform: "none",
                          fontSize: "0.75rem",
                          py: 0.5,
                          borderRadius: 1,
                          borderColor: "grey.300",
                        }}
                      >
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                    </Box>
                  </Box>

                  <Grid item sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        mb: 3,
                      }}
                    >
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
                        First Name*
                      </FormLabel>
                      <TextField
                        fullWidth
                        value={firstName}
                        onChange={handleChange("firstName")}
                        placeholder="First name"
                        size="small"
                        required
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
                        Middle Name
                      </FormLabel>
                      <TextField
                        fullWidth
                        value={middleName}
                        onChange={handleChange("middleName")}
                        placeholder="Middle name (optional)"
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <FormLabel
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
                        Last Name
                      </FormLabel>
                      <TextField
                        fullWidth
                        value={lastName}
                        onChange={handleChange("lastName")}
                        placeholder="Last name (optional)"
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <FormLabel sx={{ mb: 1, display: "block", fontWeight: 500 }}>
                    Email
                  </FormLabel>
                  <TextField
                    fullWidth
                    type="email"
                    value={email}
                    onChange={handleChange("email")}
                    placeholder="Email address (optional)"
                    size="small"
                  />
                </Box>

                {mode === "create" && validatedUserId ? (
                  <Box sx={{ textAlign: "right", mb: 2 }}>
                    <Button
                      onClick={handleUpdateUser}
                      variant="outlined"
                      color="primary"
                      size="small"
                      disabled={isSaving}
                      sx={{
                        textTransform: "none",
                        height: "32px",
                        fontSize: "0.75rem",
                        borderRadius: 0.5,
                        borderColor: "primary.main",
                        color: "primary.main",
                        minWidth: "auto",
                        whiteSpace: "nowrap",
                        px: 2,
                        "&:hover": {
                          borderColor: "primary.dark",
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      {isSaving ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        "Update User"
                      )}
                    </Button>
                  </Box>
                ) : (
                  <></>
                )}
              </>
            )}

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={isSaving}
                sx={{
                  textTransform: "none",
                  borderRadius: 0.5,
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  isSaving ||
                  (mode === "validate" && !currentParent) ||
                  (mode === "create" && validatedUserId && fieldsModified)
                }
                disableElevation
                sx={{
                  textTransform: "none",
                  borderRadius: 0.5,
                  backgroundImage: "none",
                }}
              >
                {isSaving ? (
                  <CircularProgress size={24} color="inherit" />
                ) : currentParent ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Modal>
  );
};

export default AddParentModal;
