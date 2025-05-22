//@ts-nocheck

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import type { Student } from "../services/studentService";
import { getStudentsBySection } from "../services/studentService";

interface SectionStudentsManagerProps {
  sectionId: number;
  onAdd: (studentIds: number[]) => void;
  onRemove: (studentId: number) => void;
}

const SectionStudentsManager = ({
  sectionId,
  onAdd,
  onRemove,
}: SectionStudentsManagerProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  useEffect(() => {
    fetchSectionStudents();
  }, [sectionId]);

  const fetchSectionStudents = async () => {
    if (!sectionId) return;

    setLoading(true);
    try {
      const response = await getStudentsBySection(sectionId);
      if (response && response.students) {
        setStudents(response.students);
      }
    } catch (err) {
      console.error("Error fetching section students:", err);
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
    setSelectedStudentIds(typeof value === "string" ? value.split(",") : value);
  };

  const handleDeleteChip = (id: string, event: React.MouseEvent) => {
    // Stop the event propagation to prevent dropdown from opening
    event.stopPropagation();

    // Create a new array without the deleted item
    const newSelected = selectedStudentIds.filter(
      (studentId) => studentId !== id
    );
    setSelectedStudentIds(newSelected);
  };

  const handleRemoveStudent = (studentId: number) => {
    onRemove(studentId);
    fetchSectionStudents(); // Refresh the list after removal
  };

  const getStudentFullName = (id: string) => {
    const student = students.find((s) => s.id.toString() === id);
    if (!student) return `Student ${id}`;
    return `${student.firstName} ${student.lastName}`;
  };

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 1, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Students in Section
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : students.length > 0 ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {students.map((student) => (
            <Chip
              key={student.id}
              label={`${student.firstName} ${student.lastName}`}
              onDelete={(event) => {
                event.stopPropagation();
                handleRemoveStudent(student.id);
              }}
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
      ) : (
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          No students assigned to this section yet.
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        Add Students
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select
          multiple
          value={selectedStudentIds}
          onChange={handleChange}
          displayEmpty
          input={<OutlinedInput />}
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
          placeholder="Select students to add"
          size="small"
        >
          <MenuItem disabled value="">
            <em>Select students</em>
          </MenuItem>
          {/* Students would be populated here from an API call */}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedStudentIds.length === 0}
          onClick={() => {
            onAdd(selectedStudentIds.map((id) => parseInt(id)));
            setSelectedStudentIds([]);
          }}
          disableElevation
          sx={{ textTransform: "none" }}
        >
          Add Selected Students
        </Button>
      </Box>
    </Paper>
  );
};

export default SectionStudentsManager;
