//@ts-nocheck

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import type { Class } from "../services/classService";
import { getAllActiveClasses } from "../services/classService";
import type { Holiday } from "../services/holidayService";

interface HolidayFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (holiday: Holiday) => void;
  holiday: Holiday | null;
}

interface ClassItem {
  id: number;
  name: string;
}

const HolidayFormDialog: React.FC<HolidayFormDialogProps> = ({
  open,
  onClose,
  onSave,
  holiday,
}) => {
  const [name, setName] = useState(holiday?.name || "");
  const [startDate, setStartDate] = useState(holiday?.startDate || "");
  const [endDate, setEndDate] = useState(
    holiday?.endDate || holiday?.startDate || ""
  );
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [availableClasses, setAvailableClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    startDate?: string;
    endDate?: string;
    classes?: string;
  }>({});
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  console.log("holiday", JSON.stringify(holiday));
  useEffect(() => {
    if (open) {
      fetchActiveClasses();
    }
  }, [open]);

  useEffect(() => {
    // Reset form fields
    setName(holiday?.name || "");
    setStartDate(holiday?.startDate || "");
    setEndDate(holiday?.endDate || holiday?.startDate || "");

    // Only process holiday classes if we have both holiday data and available classes
    if (holiday?.classes && availableClasses.length > 0) {
      processHolidayClasses(holiday.classes, availableClasses);
    } else {
      setSelectedClasses([]);
    }
  }, [holiday, availableClasses]);

  const fetchActiveClasses = async () => {
    setLoading(true);
    try {
      const response = await getAllActiveClasses();
      if (response && response.data) {
        const classItems = response.data.map((cls: Class) => ({
          id: cls.id,
          name: cls.classname || cls.name || `Class ${cls.id}`,
        }));
        setAvailableClasses(classItems);

        // After fetching classes, re-process holiday classes if in edit mode
        if (holiday?.classes && holiday.id) {
          processHolidayClasses(holiday.classes, classItems);
        }
      } else {
        setAvailableClasses([]);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setAvailableClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to process holiday classes and match them with available classes
  const processHolidayClasses = (
    holidayClasses: any[],
    availableClasses: ClassItem[]
  ) => {
    // Check for "All" class
    if (
      holidayClasses.includes("All") ||
      (Array.isArray(holidayClasses) &&
        holidayClasses.length > 0 &&
        typeof holidayClasses[0] === "object" &&
        (holidayClasses[0]?.name === "All" || holidayClasses[0]?.id === "All"))
    ) {
      setSelectedClasses(["All"]);
      return;
    }

    // Extract all class IDs from availableClasses
    const availableClassIds = availableClasses.map((cls) => cls.id.toString());

    // Extract all class IDs from holidayClasses
    const holidayClassIds = holidayClasses.map((cls) => {
      if (typeof cls === "object" && cls !== null) {
        return (cls.id || cls.classId || "").toString();
      }
      return cls.toString();
    });

    // If all available classes are selected OR we have IDs for all classes
    if (
      // Check if all available class IDs are present in holiday classes
      availableClassIds.length > 0 &&
      (holidayClassIds.length === availableClassIds.length ||
        availableClassIds.every((id) => holidayClassIds.includes(id)))
    ) {
      setSelectedClasses(["All"]);
      return;
    }

    // Otherwise process individual classes
    const classIds = holidayClasses
      .map((cls) => {
        // Case 1: If class is an object with id property
        if (typeof cls === "object" && cls !== null) {
          const classId = cls.id || cls.classId;
          if (classId) return classId.toString();

          // If no direct ID, try to match by name
          const className = cls.name || cls.classname;
          if (className) {
            const matchedClass = availableClasses.find(
              (ac) => ac.name === className
            );
            if (matchedClass) return matchedClass.id.toString();
          }
        }
        // Case 2: If class is a string (could be an ID or a class name)
        else if (typeof cls === "string") {
          // Check if it's already an ID (numeric string)
          if (/^\d+$/.test(cls)) return cls;

          // Otherwise, it's likely a class name - try to match it with available classes
          const matchedClass = availableClasses.find(
            (ac) =>
              ac.name === cls ||
              ac.name?.toLowerCase() === cls.toLowerCase() ||
              ac.classname === cls
          );

          if (matchedClass) return matchedClass.id.toString();
        }

        return cls ? cls.toString() : null;
      })
      .filter(Boolean);

    setSelectedClasses(classIds);
  };

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      startDate?: string;
      endDate?: string;
      classes?: string;
    } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Holiday name is required";
      isValid = false;
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }

    if (!endDate) {
      newErrors.endDate = "End date is required";
      isValid = false;
    } else if (
      startDate &&
      endDate &&
      new Date(endDate) < new Date(startDate)
    ) {
      newErrors.endDate = "End date cannot be before start date";
      isValid = false;
    }

    if (!selectedClasses.length) {
      newErrors.classes = "At least one class must be selected";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const holidayData = {
      id: holiday?.id,
      name: name.trim(),
      startDate: startDate,
      endDate: endDate,
      classes: selectedClasses.includes("All")
        ? ["All"] // Ensure we send "All" as a string when All Classes is selected
        : selectedClasses.map((classId) => {
            const classObj = availableClasses.find(
              (c) => c.id?.toString() === classId
            );

            // Return the class object if found, otherwise just the ID
            return classObj || classId;
          }),
      holidayName: name.trim(),
      start_date: startDate,
      end_date: endDate,
    };

    console.log("Submitting holiday data:", holidayData);
    onSave(holidayData);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="holiday-form-modal"
      BackdropProps={{ sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 400,
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
            borderBottom: 1,
            borderColor: "grey.100",
            bgcolor: "primary.light",
            color: "white",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {holiday ? "Edit Holiday" : "Add Holiday"}
          </Typography>
          <IconButton 
            className="custom-tooltip" 
            data-tooltip="Close"
            onClick={onClose} 
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Holiday Name *
            </Typography>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              placeholder="Enter holiday name"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Start Date *
              </Typography>
              <TextField
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                error={!!errors.startDate}
                helperText={errors.startDate}
                required
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                End Date *
              </Typography>
              <TextField
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                error={!!errors.endDate}
                helperText={errors.endDate}
                required
              />
            </Box>
          </Box>
          <Box>
            <FormControl fullWidth margin="dense" error={!!errors.classes}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Classes *
              </Typography>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: errors.classes
                    ? "error.main"
                    : "rgba(0, 0, 0, 0.23)",
                  borderRadius: 1,
                  p: 1,
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    borderRadius: 1,
                    cursor: "pointer",
                    mb: 1,
                    bgcolor: selectedClasses.includes("All")
                      ? "rgba(25, 118, 210, 0.08)"
                      : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                  onClick={() => {
                    if (selectedClasses.includes("All")) {
                      setSelectedClasses([]);
                    } else {
                      setSelectedClasses(["All"]);
                    }

                    if (errors.classes) {
                      setErrors({ ...errors, classes: undefined });
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      border: "1px solid",
                      borderColor: selectedClasses.includes("All")
                        ? "primary.main"
                        : "rgba(0, 0, 0, 0.23)",
                      borderRadius: 0.5,
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: selectedClasses.includes("All")
                        ? "primary.main"
                        : "transparent",
                    }}
                  >
                    {selectedClasses.includes("All") && (
                      <Box
                        component="span"
                        sx={{ color: "white", fontSize: "0.8rem" }}
                      >
                        ✓
                      </Box>
                    )}
                  </Box>
                  <Typography sx={{ fontStyle: "italic" }}>
                    All Classes
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                {availableClasses.map((classItem) => {
                  const classId = classItem.id?.toString() || "";
                  const className = classItem.name || `Class ${classId}`;
                  const isSelected = selectedClasses.includes(classId);

                  return (
                    <Box
                      key={classId}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        borderRadius: 1,
                        cursor: selectedClasses.includes("All")
                          ? "not-allowed"
                          : "pointer",
                        mb: 0.5,
                        bgcolor:
                          isSelected && !selectedClasses.includes("All")
                            ? "rgba(25, 118, 210, 0.08)"
                            : "transparent",
                        opacity: selectedClasses.includes("All") ? 0.5 : 1,
                        "&:hover": {
                          bgcolor: selectedClasses.includes("All")
                            ? "transparent"
                            : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                      onClick={() => {
                        if (selectedClasses.includes("All")) return;

                        setSelectedClasses((prevSelected) => {
                          if (prevSelected.includes(classId)) {
                            return prevSelected.filter((id) => id !== classId);
                          } else {
                            return [...prevSelected, classId];
                          }
                        });

                        if (errors.classes) {
                          setErrors({ ...errors, classes: undefined });
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: "1px solid",
                          borderColor:
                            isSelected || selectedClasses.includes("All")
                              ? "primary.main"
                              : "rgba(0, 0, 0, 0.23)",
                          borderRadius: 0.5,
                          mr: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor:
                            isSelected || selectedClasses.includes("All")
                              ? "primary.main"
                              : "transparent",
                        }}
                      >
                        {(isSelected || selectedClasses.includes("All")) && (
                          <Box
                            component="span"
                            sx={{ color: "white", fontSize: "0.8rem" }}
                          >
                            ✓
                          </Box>
                        )}
                      </Box>
                      <Typography>{className}</Typography>
                    </Box>
                  );
                })}
                {availableClasses.length === 0 && (
                  <Box sx={{ p: 1, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      {loading ? "Loading classes..." : "No classes available"}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                {selectedClasses.includes("All") ? (
                  <Chip
                    label="All Classes"
                    color="primary"
                    size="small"
                    onDelete={() => setSelectedClasses([])}
                  />
                ) : (
                  selectedClasses.map((classId) => {
                    const classObj = availableClasses.find(
                      (c) => c.id?.toString() === classId
                    );
                    const label = classObj
                      ? classObj.name || `Class ${classId}`
                      : `Class ${classId}`;

                    return (
                      <Chip
                        key={classId}
                        label={label}
                        size="small"
                        onDelete={() => {
                          setSelectedClasses((prev) =>
                            prev.filter((id) => id !== classId)
                          );
                        }}
                      />
                    );
                  })
                )}
              </Box>
              {errors.classes && (
                <FormHelperText error>{errors.classes}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{ textTransform: "none", borderRadius: 0.5 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handleSave}
              sx={{
                textTransform: "none",
                backgroundImage: "none",
                borderRadius: 0.5,
                transition: "none",
                background: "primary.main",
                "&:hover": {
                  backgroundImage: "none",
                  background: "primary.main",
                  opacity: 0.9,
                },
              }}
            >
              {holiday ? "Update" : "Add"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default HolidayFormDialog;
