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
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Student } from "../services/studentService";
import { getStudents } from "../services/studentService";

interface AddStudentsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (studentIds: number[]) => void;
  sectionId: number;
}

const AddStudentsModal = ({
  open,
  onClose,
  onSubmit,
  sectionId,
}: AddStudentsModalProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      fetchStudents();
    }
  }, [open]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Fetch all students
      const response = await getStudents(0, 1000);
      if (response && Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setError("Failed to load students");
      }
    } catch (err) {
      setError("Error loading students");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    event: SelectChangeEvent<typeof selectedStudentIds>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedStudentIds(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // Handle students in section with same delete chip behavior
  const handleDeleteChip = (id: string, event: React.MouseEvent) => {
    // Stop the event propagation to prevent dropdown from opening
    event.stopPropagation();

    // Create a new array without the deleted item
    const newSelected = selectedStudentIds.filter(
      (studentId) => studentId !== id
    );
    setSelectedStudentIds(newSelected);
  };

  // Make sure we're handling the section student management properly
  const handleSubmit = () => {
    // Convert string array to number array for the section's students
    const numberIds = selectedStudentIds.map((id) => parseInt(id));
    onSubmit(numberIds);
  };

  const handleClose = () => {
    setSelectedStudentIds([]);
    onClose();
  };

  // Get student name for display in chip
  const getStudentFullName = (id: string) => {
    const student = students.find((s) => s.id.toString() === id);
    if (!student) return `Student ${id}`;
    return `${student.firstName} ${student.lastName}`;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-students-modal"
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
            Add Students to Section
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
            Select students to add to this section:
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={selectedStudentIds}
                  onChange={handleChange}
                  displayEmpty
                  input={<OutlinedInput id="select-multiple-students" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={getStudentFullName(value)}
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
                  disabled={students.length === 0}
                  sx={{ width: "100%" }}
                >
                  {students.length === 0 ? (
                    <MenuItem disabled>No students available</MenuItem>
                  ) : (
                    students.map((student) => (
                      <MenuItem key={student.id} value={student.id.toString()}>
                        {student.enrollmentNo || `ST-${student.id}`} -{" "}
                        {student.firstName} {student.lastName}
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
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={selectedStudentIds.length === 0 || loading}
              disableElevation
              sx={{ textTransform: "none" }}
            >
              Add {selectedStudentIds.length} Students
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default AddStudentsModal;
