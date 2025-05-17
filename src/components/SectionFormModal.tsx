import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Section } from "../services/sectionService";
import { getAllActiveClasses } from "../services/classService";
import type { Class } from "../services/classService";

interface SectionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (section: Partial<Section>) => void;
  section?: Section;
  isEditMode?: boolean;
}

const SectionFormModal = ({
  open,
  onClose,
  onSubmit,
  section,
  isEditMode = false,
}: SectionFormModalProps) => {
  const [formData, setFormData] = useState<Partial<Section>>({
    section: "",
    classid: 0,
    isactive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch classes for the dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const response = await getAllActiveClasses();
        // Ensure we use the correct data structure
        if (response && response.data) {
          setClasses(response.data);

          // Set default class selection if not in edit mode and we have classes
          if (!isEditMode && response.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              classid: response.data[0].id,
            }));
          }
        } else {
          setClasses([]);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      // Only fetch when modal is opened
      fetchClasses();
    }
  }, [open, isEditMode]);

  // Set initial form data when section prop changes
  useEffect(() => {
    if (section && isEditMode) {
      setFormData({
        ...section,
      });
    } else if (classes.length > 0) {
      // Default to first class in the list for new sections
      setFormData({
        section: "",
        classid: classes[0].id,
        isactive: true,
      });
    }
    setErrors({});
  }, [section, isEditMode, classes]);

  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });

      // Clear error when field is edited
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.section?.trim()) {
      newErrors.section = "Section name is required";
    }

    if (!formData.classid || formData.classid === 0) {
      newErrors.classid = "Class selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      aria-labelledby="section-form-modal"
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
          maxWidth: "90%",
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          outline: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "primary.light",
            color: "white",
            p: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {isEditMode ? "Edit Section" : "Add New Section"}
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

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.classid}>
            <InputLabel id="class-label">Class</InputLabel>
            <Select
              labelId="class-label"
              id="classid"
              name="classid"
              value={formData.classid || ""}
              onChange={handleChange as any}
              label="Class"
              disabled={isEditMode || loading} // Don't allow changing the class in edit mode or during loading
              displayEmpty
            >
              {loading ? (
                <MenuItem value="" disabled>
                  Loading classes...
                </MenuItem>
              ) : classes.length > 0 ? (
                classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.classname}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No classes available
                </MenuItem>
              )}
            </Select>
            {errors.classid && (
              <FormHelperText>{errors.classid}</FormHelperText>
            )}
          </FormControl>

          <TextField
            fullWidth
            name="section"
            label="Section Name"
            value={formData.section || ""}
            onChange={handleChange as any}
            error={!!errors.section}
            helperText={errors.section}
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                textTransform: "none",
                borderRadius: 0.5,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disableElevation
              sx={{
                textTransform: "none",
                borderRadius: 0.5,
                backgroundImage: "none",
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

export default SectionFormModal;
