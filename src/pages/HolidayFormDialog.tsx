import React, { useState, useEffect } from "react";
import {
  Modal,
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Holiday } from "../services/holidayService";
import { getAllActiveClasses } from "../services/classService";
import type { Class } from "../services/classService";

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

  useEffect(() => {
    if (open) {
      fetchActiveClasses();
    }
  }, [open]);

  useEffect(() => {
    setName(holiday?.name || "");
    setStartDate(holiday?.startDate || "");
    setEndDate(holiday?.endDate || holiday?.startDate || "");

    if (holiday?.classes) {
      const isAllClasses =
        holiday.classes.includes("All") ||
        (availableClasses.length > 0 &&
          availableClasses.every(
            (cls) =>
              holiday.classes.includes(cls.id) ||
              holiday.classes.some((c) => {
                if (typeof c === "object" && c !== null) return c.id === cls.id;
                return c === cls.id || c === cls.id.toString();
              })
          ));

      if (isAllClasses) {
        setClasses([{ id: -1, name: "All" }]);
      } else {
        const formattedClasses = holiday.classes.map((cls) => {
          if (typeof cls === "object" && cls !== null && "id" in cls) {
            return {
              id: cls.id,
              name: cls.name || cls.classname || `Class ${cls.id}`,
            };
          } else if (typeof cls === "number") {
            return { id: cls, name: `Class ${cls}` };
          } else if (typeof cls === "string" && /^\d+$/.test(cls)) {
            return { id: parseInt(cls, 10), name: `Class ${cls}` };
          }
          return { id: 0, name: String(cls) };
        });
        setClasses(formattedClasses);
      }
    } else {
      setClasses([]);
    }
  }, [holiday, open, availableClasses]);

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

  const handleClassChange = (event: any) => {
    const value = event.target.value;
    if (value.some((item: any) => item.id === -1)) {
      setClasses([{ id: -1, name: "All" }]);
    } else {
      setClasses(value);
    }
  };

  const handleSelectAll = () => {
    if (classes.some((cls) => cls.id === -1)) {
      setClasses([]);
    } else {
      setClasses([{ id: -1, name: "All" }]);
    }
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

    if (!classes.length) {
      newErrors.classes = "At least one class must be selected";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    let classIds;

    if (classes.some((cls) => cls.id === -1)) {
      classIds = ["All"];
    } else {
      classIds = classes.map((cls) => cls.id);
    }

    onSave({
      id: holiday?.id,
      name: name.trim(),
      startDate: startDate,
      endDate: endDate,
      classes: classIds,
      holidayName: name.trim(),
      start_date: startDate,
      end_date: endDate,
    });
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
          <IconButton onClick={onClose} sx={{ color: "white" }}>
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
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Classes *
            </Typography>
            <FormControl fullWidth size="small" error={!!errors.classes}>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <>
                  <Select
                    multiple
                    value={classes}
                    onChange={handleClassChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) =>
                      selected.some((item) => item.id === -1) ? (
                        "All Classes"
                      ) : (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip
                              key={value.id}
                              label={value.name}
                              size="small"
                            />
                          ))}
                        </Box>
                      )
                    }
                    sx={{ minHeight: 40 }}
                    required
                  >
                    <MenuItem
                      value={{ id: -1, name: "All" } as any}
                      onClick={handleSelectAll}
                    >
                      <Checkbox
                        checked={classes.some((cls) => cls.id === -1)}
                      />
                      <ListItemText primary="All Classes" />
                    </MenuItem>
                    {availableClasses.length > 0 ? (
                      availableClasses.map((cls) => (
                        <MenuItem
                          key={cls.id}
                          value={cls as any}
                          disabled={classes.some((c) => c.id === -1)}
                        >
                          <Checkbox
                            checked={
                              classes.some((c) => c.id === cls.id) ||
                              classes.some((c) => c.id === -1)
                            }
                          />
                          <ListItemText primary={cls.name} />
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No classes available</MenuItem>
                    )}
                  </Select>
                  {errors.classes && (
                    <FormHelperText>{errors.classes}</FormHelperText>
                  )}
                </>
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
