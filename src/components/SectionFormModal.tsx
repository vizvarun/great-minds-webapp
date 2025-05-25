//@ts-nocheck

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
  const [isFormValid, setIsFormValid] = useState(false);

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

        // Fetch all employees for teacher dropdowns
        setEmployeesLoading(true);
        const employeesResponse = await getActiveEmployees();
        if (employeesResponse && Array.isArray(employeesResponse)) {
          setEmployees(employeesResponse);
        } else {
          setEmployees([]);
        }
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

  // Update the form validation effect to check for teacher and admin selections
  useEffect(() => {
    // Form is valid when section name, class ID, class teacher, and class admin are provided
    const valid =
      !!formData.section?.trim() &&
      !!formData.classid &&
      formData.classid !== 0 &&
      !!formData.classTeacherId &&
      !!formData.classAdminId;

    setIsFormValid(valid);
  }, [
    formData.section,
    formData.classid,
    formData.classTeacherId,
    formData.classAdminId,
  ]); // Add dependencies

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

    // Add validation for class teacher and admin
    if (!formData.classTeacherId) {
      newErrors.classTeacherId = "Class teacher selection is required";
    }

    if (!formData.classAdminId) {
      newErrors.classAdminId = "Class admin selection is required";
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

  // Filter employees for dropdown options
  const getFilteredTeacherOptions = () => {
    return employees.filter(
      (employee) => employee.id !== formData.classAdminId
    );
  };

  const getFilteredAdminOptions = () => {
    return employees.filter(
      (employee) => employee.id !== formData.classTeacherId
    );
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

              {/* Class Teacher dropdown */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Class Teacher*
                </Typography>
                <FormControl
                  fullWidth
                  size="small"
                  error={!!errors.classTeacherId}
                >
                  <Select
                    id="classTeacherId"
                    name="classTeacherId"
                    value={formData.classTeacherId || ""}
                    onChange={handleChange as any}
                    displayEmpty
                    disabled={employeesLoading}
                    endAdornment={
                      employeesLoading ? (
                        <CircularProgress size={20} sx={{ mr: 2 }} />
                      ) : null
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {getFilteredTeacherOptions().length > 0 ? (
                      getFilteredTeacherOptions().map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                          {employee.fullName ||
                            `${employee.firstName || ""} ${
                              employee.lastName || ""
                            }`.trim() ||
                            `Employee ${employee.id}`}
                          {employee.designation && ` - ${employee.designation}`}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        {employeesLoading
                          ? "Loading employees..."
                          : "No employees available"}
                      </MenuItem>
                    )}
                  </Select>
                  {errors.classTeacherId && (
                    <FormHelperText>{errors.classTeacherId}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              {/* Class Admin dropdown */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Class Admin*
                </Typography>
                <FormControl
                  fullWidth
                  size="small"
                  error={!!errors.classAdminId}
                >
                  <Select
                    id="classAdminId"
                    name="classAdminId"
                    value={formData.classAdminId || ""}
                    onChange={handleChange as any}
                    displayEmpty
                    disabled={employeesLoading}
                    endAdornment={
                      employeesLoading ? (
                        <CircularProgress size={20} sx={{ mr: 2 }} />
                      ) : null
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {getFilteredAdminOptions().length > 0 ? (
                      getFilteredAdminOptions().map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                          {employee.fullName ||
                            `${employee.firstName || ""} ${
                              employee.lastName || ""
                            }`.trim() ||
                            `Employee ${employee.id}`}
                          {employee.designation && ` - ${employee.designation}`}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        {employeesLoading
                          ? "Loading employees..."
                          : "No employees available"}
                      </MenuItem>
                    )}
                  </Select>
                  {errors.classAdminId && (
                    <FormHelperText>{errors.classAdminId}</FormHelperText>
                  )}
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
                  disabled={!isFormValid} // Disable button unless form is valid
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
