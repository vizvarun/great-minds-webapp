import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import { useState, useRef } from "react";

interface BulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess: (file: File) => void;
  entityType: string; // Add entityType to make the component generic
  templateUrl?: string; // Optional URL for downloading the template
}

const BulkUploadModal = ({
  open,
  onClose,
  onUploadSuccess,
  entityType = "items", // Default to generic "items"
  templateUrl,
}: BulkUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format entity type for display (capitalize first letter)
  const displayEntityType =
    entityType.charAt(0).toUpperCase() + entityType.slice(1);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0] || null;

    if (!selectedFile) {
      return;
    }

    // Check if file is a CSV or Excel
    const validExtensions = [".csv", ".xls", ".xlsx"];
    const fileExtension = selectedFile.name
      .substring(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      setError("Please upload a valid CSV or Excel file");
      return;
    }

    setFile(selectedFile);
  };

  const handleDownloadTemplate = async () => {
    if (!templateUrl) return;

    try {
      const link = document.createElement("a");
      link.href = templateUrl;
      link.download = `${entityType.toLowerCase()}_template.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setError(`Failed to download template: ${error}`);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);

    try {
      // Send the actual file to the parent component for processing
      await onUploadSuccess(file);
      setUploading(false);
      setFile(null);
      onClose();
    } catch (err) {
      setError(
        "Failed to process file. Please check the format and try again."
      );
      setUploading(false);
    }
  };

  // Reset the file input when the modal is closed
  const handleClose = () => {
    setFile(null);
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="bulk-upload-modal"
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
          width: 500,
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
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "primary.light",
            color: "white",
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Bulk Upload {displayEntityType}
          </Typography>
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

        <Box sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Upload an Excel file containing {entityType.toLowerCase()} details.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Template download link section */}
          {templateUrl && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                mt: 2,
                mb: 3,
                py: 1,
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                borderRadius: 1,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, px: 4, pt: 2 }}
              >
                Not sure about the format? Use our template to ensure your data
                is correctly formatted.
              </Typography>
              <Button
                variant="text"
                onClick={handleDownloadTemplate}
                sx={{
                  textTransform: "none",
                  color: "primary.main",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "none",
                    textDecoration: "underline",
                  },
                }}
              >
                Download Template File
              </Button>
            </Box>
          )}

          <Box
            sx={{
              border: "1px dashed",
              borderColor: "grey.400",
              borderRadius: 1,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.50",
              mb: 2,
            }}
          >
            <input
              type="file"
              accept=".xls,.xlsx"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <CloudUploadIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />

            <Typography variant="body1" sx={{ mb: 1 }}>
              {file
                ? file.name
                : "Drag & drop your file here or click to browse"}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supports Excel files
            </Typography>

            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                textTransform: "none",
                borderRadius: 0.5,
                transition: "none",
                outline: "none",
                "&:hover": {
                  backgroundImage: "none",
                },
              }}
            >
              Select File
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

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
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              variant="contained"
              disableElevation
              disabled={!file || uploading}
              disableRipple
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
                },
                "&:focus": {
                  outline: "none",
                  boxShadow: "none",
                },
              }}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default BulkUploadModal;
