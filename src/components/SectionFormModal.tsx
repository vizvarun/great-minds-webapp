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
import { getTeachersBySection } from "../services/teacherService";
import type { Class } from "../services/classService";
import type { Teacher } from "../services/teacherService";
import type { Section } from "../services/sectionService";

interface SectionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (section: Partial<Section>) => void;
  section?: Section;
  isEditMode?: boolean;
  sectionId?: number; // Add sectionId prop
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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [teachersLoading, setTeachersLoading] = useState(false);

  // Fetch all classes and teachers when the modal opens
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch classes
        const classesResponse = await getAllActiveClasses();
        if (classesResponse && classesResponse.data) {
          setClasses(classesResponse.data);

          // Set default class selection if not in edit mode and we have classes
          if (!isEditMode && classesResponse.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              classid: classesResponse.data[0].id,
            }));
          }
        } else {
          setClasses([]);
        }

        // Fetch all teachers
        setTeachersLoading(true);
        // Pass the sectionId when available (either from prop or from section object)
        const sectionIdToUse = sectionId || (section ? section.id : undefined);
        const teachersResponse = await getTeachersBySection(sectionIdToUse);
        console.log("Teachers data:", teachersResponse); // Log teachers data for debugging
        setTeachers(teachersResponse || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setClasses([]);
        setTeachers([]);
      } finally {
        setLoading(false);
        setTeachersLoading(false);
      }
    };

    if (open) {
      // Only fetch when modal is opened
      fetchData();
    }
  }, [open, isEditMode, sectionId, section]);

  // Set initial form data when section prop changes
  useEffect(() => {
    if (section && isEditMode) {
      setFormData({
        ...section,
        // Add default values for new fields if they don't exist in the section object
        classTeacherId: section.classTeacherId || undefined,
        classAdminId: section.classAdminId || undefined,
      });
    } else if (classes.length > 0) {
      // Default to first class in the list for new sections
      setFormData({
        section: "",
        classid: classes[0].id,
        isactive: true,
        classTeacherId: undefined,
        classAdminId: undefined,
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

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Class Teacher
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    id="classTeacherId"
                    name="classTeacherId"
                    value={formData.classTeacherId || ""}
                    onChange={handleChange as any}
                    displayEmpty
                    disabled={teachersLoading}
                    endAdornment={
                      teachersLoading ? (
                        <CircularProgress size={20} sx={{ mr: 2 }} />
                      ) : null
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {teachers && teachers.length > 0 ? (
                      teachers.map((teacher) => (
                        <MenuItem key={teacher.id} value={teacher.id}>
                          {teacher.fullName ||
                            `${teacher.firstName || ""} ${
                              teacher.lastName || ""
                            }`.trim() ||
                            `Teacher ${teacher.id}`}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        {teachersLoading
                          ? "Loading teachers..."
                          : "No teachers available"}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Class Admin
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    id="classAdminId"
                    name="classAdminId"
                    value={formData.classAdminId || ""}
                    onChange={handleChange as any}
                    displayEmpty
                    disabled={teachersLoading}
                    endAdornment={
                      teachersLoading ? (
                        <CircularProgress size={20} sx={{ mr: 2 }} />
                      ) : null
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {teachers && teachers.length > 0 ? (
                      teachers.map((teacher) => (
                        <MenuItem key={teacher.id} value={teacher.id}>
                          {teacher.fullName ||
                            `${teacher.firstName || ""} ${
                              teacher.lastName || ""
                            }`.trim() ||
                            `Teacher ${teacher.id}`}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        {teachersLoading
                          ? "Loading teachers..."
                          : "No teachers available"}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
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
