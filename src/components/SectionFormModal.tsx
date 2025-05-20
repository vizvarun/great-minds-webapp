import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getAllActiveClasses } from "../services/classService";
import { getActiveEmployees } from "../services/teacherService";
import type { Class } from "../services/classService";
import type { Teacher } from "../services/teacherService";
import type { Section } from "../services/sectionService";

interface SectionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (section: Partial<Section>) => void;
  section?: Section;
  isEditMode?: boolean;
  sectionId?: number;
  defaultClassId?: number; // Add this new prop
}

interface ExtendedSection extends Section {
  classTeacherId?: number;
  classAdminId?: number;
}

const SectionFormModal = ({
  open,
  onClose,
  onSubmit,
  section,
  isEditMode = false,
  sectionId,
  defaultClassId,
}: SectionFormModalProps) => {
  const [formData, setFormData] = useState<Partial<ExtendedSection>>({
    section: "",
    classid: 0,
    isactive: true,
    classTeacherId: undefined,
    classAdminId: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [classes, setClasses] = useState<Class[]>([]);
  const [employees, setEmployees] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(false);

  // Fetch all classes and employees when the modal opens
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch classes
        const classesResponse = await getAllActiveClasses();
        if (classesResponse && classesResponse.data) {
          setClasses(classesResponse.data);

          // Set default class selection if not in edit mode
          if (!isEditMode) {
            // Use the defaultClassId if provided, otherwise use first class
            const classIdToUse =
              defaultClassId ||
              (classesResponse.data.length > 0
                ? classesResponse.data[0].id
                : 0);

            setFormData((prev) => ({
              ...prev,
              classid: classIdToUse,
            }));
          }
        } else {
          setClasses([]);
        }

        // For section form, we'll disable employee selection since we'll only allow deletion
        // of teachers and students inside section view
        setEmployees([]);
        setEmployeesLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setClasses([]);
        setEmployees([]);
      } finally {
        setLoading(false);
        setEmployeesLoading(false);
      }
    };

    if (open) {
      // Only fetch when modal is opened
      fetchData();
    }
  }, [open, isEditMode, defaultClassId]); // Add defaultClassId to dependencies

  // Set initial form data when section prop changes
  useEffect(() => {
    if (section && isEditMode) {
      setFormData({
        ...section,
        // Use existing values if available in the section object
        classTeacherId: section.classTeacherId,
        classAdminId: section.classAdminId,
      });
    } else if (classes.length > 0) {
      // Default to provided default class ID or first class in the list for new sections
      const classIdToUse = defaultClassId || classes[0].id;

      setFormData({
        section: "",
        classid: classIdToUse,
        isactive: true,
        classTeacherId: undefined,
        classAdminId: undefined,
      });
    }
    setErrors({});
  }, [section, isEditMode, classes, defaultClassId]); // Add defaultClassId to dependencies

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
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Class
                </Typography>
                <FormControl fullWidth error={!!errors.classid} size="small">
                  <Select
                    id="classid"
                    name="classid"
                    value={formData.classid || ""}
                    onChange={handleChange as any}
                    disabled={isEditMode || loading}
                    displayEmpty
                    sx={{ width: "100%" }}
                  >
                    {classes.length > 0 ? (
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
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Section Name
                </Typography>
                <TextField
                  fullWidth
                  name="section"
                  placeholder="Enter section name"
                  value={formData.section || ""}
                  onChange={handleChange as any}
                  error={!!errors.section}
                  helperText={errors.section}
                  size="small"
                />
              </Box>

              {/* Remove Class Teacher and Class Admin fields since they'll be managed in section view */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                >
                  Note: Teachers and students can be managed after creating the
                  section
                </Typography>
              </Box>

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
            </>
          )}
        </Box>
      </Paper>
    </Modal>
  );
};

export default SectionFormModal;
