import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const SchoolProfile = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    schoolName: "Great Minds School",
    address: "",
  });

  // State for image upload
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // State for success notification
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would normally send the data to an API
    console.log("Form submitted:", { formData, imageFile });

    // Show success notification
    setNotification({
      open: true,
      message: "School profile updated successfully!",
      severity: "success",
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
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
        overflow: "auto",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 500, color: "text.primary" }}>
        School Profile
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1 }}>
        <Grid container spacing={4}>
          {/* Left side - Logo upload */}
          <Grid item xs={12} md={4} width={"30%"}>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                School Logo
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  border: "1px dashed",
                  borderColor: "grey.300",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  my: 2,
                  overflow: "hidden",
                  backgroundColor: "grey.50",
                }}
              >
                {selectedImage ? (
                  <Box
                    component="img"
                    src={selectedImage}
                    alt="School Logo Preview"
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
                    No logo uploaded yet.
                    <br />
                    Please upload your school logo.
                  </Typography>
                )}
              </Box>

              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: 0.5,
                  backgroundImage: "none",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundImage: "none",
                    opacity: 0.9,
                  },
                }}
              >
                Upload Logo
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
                sx={{ mt: 1 }}
              >
                Recommended: 300x300 pixels, PNG or JPEG format
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8} width={"65%"}>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: 3,
                height: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                School Information
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  width: "100%",
                  px: 0,
                  mx: 0,
                  my: 2,
                }}
              >
                <Box sx={{ width: "100%", px: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, ml: 0.5 }}
                  >
                    School Name
                  </Typography>
                  <TextField
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    placeholder="Enter school name"
                    label="" // Remove overlapping label
                    sx={{ width: "100%" }}
                    inputProps={{ style: { width: "100%" } }}
                  />
                </Box>

                <Box sx={{ width: "100%", px: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, ml: 0.5 }}
                  >
                    Address
                  </Typography>
                  <TextField
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    placeholder="Enter complete school address"
                    multiline
                    rows={4}
                    label="" // Remove overlapping label
                    sx={{ width: "100%" }}
                    inputProps={{ style: { width: "100%" } }}
                  />
                </Box>
              </Box>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disableElevation
                sx={{
                  textTransform: "none",
                  borderRadius: 0.5,
                  py: 1,
                  px: 4,
                  backgroundImage: "none",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundImage: "none",
                    opacity: 0.9,
                  },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="standard"
          sx={{
            width: "100%",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            border: "1px solid",
            borderColor: "rgba(46, 125, 50, 0.2)",
            borderRadius: 1,
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default SchoolProfile;
