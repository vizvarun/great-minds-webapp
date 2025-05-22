//@ts-nocheck

import CloseIcon from "@mui/icons-material/Close";
import type { SelectChangeEvent } from "@mui/material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Teacher } from "../services/teacherService";
import { getActiveEmployees } from "../services/teacherService";

interface AddTeacherModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (teacherIds: number[]) => void;
  sectionId: number;
  existingTeachers?: Teacher[]; // Added prop for existing teachers
}

const AddTeacherModal = ({
  open,
  onClose,
  onSubmit,
  sectionId,
  existingTeachers = [], // Default to empty array
}: AddTeacherModalProps) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);

  // Create a set of existing teacher IDs for efficient lookup
  const existingTeacherIds = new Set(existingTeachers.map((t) => t.id));

  useEffect(() => {
    // Reset selected teacher IDs when modal opens or closes
    setSelectedTeacherIds([]);

    if (open) {
      fetchTeachers();
    }
  }, [open]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const teacherList = await getActiveEmployees();
      if (teacherList && Array.isArray(teacherList)) {
        // Filter out teachers that are already in the section
        const filteredTeachers = teacherList.filter(
          (teacher) => !existingTeacherIds.has(teacher.id)
        );
        setTeachers(filteredTeachers);
      } else {
        setError("Failed to load teachers");
      }
    } catch (err) {
      setError("Error loading teachers");
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    event: SelectChangeEvent<typeof selectedTeacherIds>
  ) => {
    const {
      target: { value },
    } = event;

    setSelectedTeacherIds(typeof value === "string" ? value.split(",") : value);
  };

  const handleDeleteChip = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedTeacherIds(
      selectedTeacherIds.filter((teacherId) => teacherId !== id)
    );
  };

  const handleSubmit = () => {
    if (selectedTeacherIds.length > 0) {
      const numberIds = selectedTeacherIds.map((id) => parseInt(id));
      onSubmit(numberIds);
      setSelectedTeacherIds([]);
    }
  };

  const handleClose = () => {
    setSelectedTeacherIds([]);
    onClose();
  };

  const getTeacherFullName = (id: string) => {
    const teacher = teachers.find((t) => t.id.toString() === id);
    if (!teacher) return `Teacher ${id}`;
    return teacher.fullName || `${teacher.firstName} ${teacher.lastName}`;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-teacher-modal"
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
          outline: "none",
          display: "flex",
          flexDirection: "column",
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
            Add Teachers to Section
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
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select teachers to add to this section:
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Select Teachers
              </Typography>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={selectedTeacherIds}
                  onChange={handleChange}
                  displayEmpty
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={getTeacherFullName(value)}
                          onDelete={(event) =>
                            handleDeleteChip(value, event as React.MouseEvent)
                          }
                          onMouseDown={(event) => event.stopPropagation()}
                          sx={{
                            "& .MuiChip-deleteIcon": {
                              color: "rgba(0, 0, 0, 0.4)",
                              "&:hover": {
                                color: "rgba(0, 0, 0, 0.7)",
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  disabled={teachers.length === 0}
                  sx={{ width: "100%" }}
                >
                  {teachers.length === 0 ? (
                    <MenuItem disabled>
                      {existingTeacherIds.size > 0
                        ? "All available teachers are already assigned to this section"
                        : "No teachers available"}
                    </MenuItem>
                  ) : (
                    teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.fullName ||
                          `${teacher.firstName} ${teacher.lastName}`}
                        {teacher.designation && ` - ${teacher.designation}`}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                textTransform: "none",
                borderRadius: 0.5,
                transition: "none",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={selectedTeacherIds.length === 0 || loading}
              disableElevation
              sx={{
                textTransform: "none",
                borderRadius: 0.5,
                transition: "none",
                backgroundImage: "none",
                background: "primary.main",
                "&:hover": {
                  backgroundImage: "none",
                  background: "primary.main",
                  opacity: 0.9,
                },
              }}
            >
              Add {selectedTeacherIds.length}{" "}
              {selectedTeacherIds.length === 1 ? "Teacher" : "Teachers"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default AddTeacherModal;
