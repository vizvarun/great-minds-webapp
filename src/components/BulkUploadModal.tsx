import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Paper,
  Typography,
  Link,
} from "@mui/material";
import { useState, useRef } from "react";

interface BulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess: (data: any[]) => void;
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

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);

    try {
      // Mock successful file parsing
      // In a real application, you would use a library like Papa Parse for CSV
      // or xlsx for Excel files to parse the uploaded file

      setTimeout(() => {
        // Mock data that would come from parsing the file
        const mockUploadedData = [
          {
            id: "MOCK001",
            firstName: "Jane",
            lastName: "Doe",
            // Other generic fields
          },
          {
            id: "MOCK002",
            firstName: "John",
            lastName: "Smith",
            // Other generic fields
          },
          // Add more mock data as needed
        ];

        onUploadSuccess(mockUploadedData);
        setUploading(false);
        setFile(null);
        onClose();
      }, 1000);
    } catch (err) {
      setError(
        "Failed to process file. Please check the format and try again."
      );
      setUploading(false);
    }
  };

  // Handle template download
  const handleDownloadTemplate = () => {
    // If template URL is provided, use that for download
    if (templateUrl) {
      window.open(templateUrl, "_blank");
    } else {
      // Mock download behavior
      console.log(`Downloading ${entityType} template...`);
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
            Upload a CSV or Excel file containing {entityType.toLowerCase()}{" "}
            details.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
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
              mb: 3,
            }}
          >
            <input
              type="file"
              accept=".csv,.xls,.xlsx"
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
              Supports CSV and Excel files
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
