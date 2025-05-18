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
  const [classes, setClasses] = useState<string[]>(holiday?.classes || []);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch available classes when the dialog opens
  useEffect(() => {
    if (open) {
      fetchActiveClasses();
    }
  }, [open]);

  // Reset form data when holiday prop changes
  useEffect(() => {
    setName(holiday?.name || "");
    setStartDate(holiday?.startDate || "");
    setEndDate(holiday?.endDate || holiday?.startDate || "");
    setClasses(holiday?.classes || []);
  }, [holiday, open]);

  const fetchActiveClasses = async () => {
    setLoading(true);
    try {
      const response = await getAllActiveClasses();
      if (response && response.data) {
        // Extract class names from the API response
        const classNames = response.data.map(
          (cls: Class) => cls.classname || cls.name
        );
        setAvailableClasses(classNames);
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
    if (value.includes("All")) {
      setClasses(["All"]);
    } else {
      setClasses(value);
    }
  };

  const handleSelectAll = () => {
    if (classes.includes("All")) {
      setClasses([]);
    } else {
      setClasses(["All"]);
    }
  };

  const handleSave = () => {
    if (!name.trim() || !startDate || !endDate || classes.length === 0) return;

    onSave({
      id: holiday?.id,
      name: name.trim(),
      startDate: startDate,
      endDate: endDate,
      classes: classes.includes("All") ? ["All"] : classes,
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
        {/* Title Bar */}
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
        {/* Form Fields */}
        <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Holiday Name
            </Typography>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              placeholder="Enter holiday name"
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Start Date
              </Typography>
              <TextField
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                End Date
              </Typography>
              <TextField
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Classes
            </Typography>
            <FormControl fullWidth size="small">
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
                <Select
                  multiple
                  value={classes}
                  onChange={handleClassChange}
                  input={<OutlinedInput />}
                  renderValue={(selected) =>
                    selected.includes("All") ? (
                      "All Classes"
                    ) : (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )
                  }
                  sx={{ minHeight: 40 }}
                >
                  <MenuItem value="All" onClick={handleSelectAll}>
                    <Checkbox checked={classes.includes("All")} />
                    <ListItemText primary="All Classes" />
                  </MenuItem>
                  {availableClasses.length > 0 ? (
                    availableClasses.map((cls) => (
                      <MenuItem
                        key={cls}
                        value={cls}
                        disabled={classes.includes("All")}
                      >
                        <Checkbox
                          checked={
                            classes.indexOf(cls) > -1 || classes.includes("All")
                          }
                        />
                        <ListItemText primary={cls} />
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No classes available</MenuItem>
                  )}
                </Select>
              )}
            </FormControl>
          </Box>
          {/* Action Buttons */}
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
              disabled={
                !name.trim() || !startDate || !endDate || classes.length === 0
              }
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
