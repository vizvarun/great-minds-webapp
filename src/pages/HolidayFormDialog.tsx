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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Holiday {
  id?: number;
  name: string;
  date: string;
  endDate?: string;
  classes: string[];
}

const ALL_CLASSES = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11 - Science",
  "Class 11 - Commerce",
  "Class 12 - Science",
  "Class 12 - Commerce",
];

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
  const [date, setDate] = useState(holiday?.date || "");
  const [endDate, setEndDate] = useState(
    holiday?.endDate || holiday?.date || ""
  );
  const [classes, setClasses] = useState<string[]>(holiday?.classes || []);

  useEffect(() => {
    setName(holiday?.name || "");
    setDate(holiday?.date || "");
    setEndDate(holiday?.endDate || holiday?.date || "");
    setClasses(holiday?.classes || []);
  }, [holiday, open]);

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
    if (!name.trim() || !date || !endDate || classes.length === 0) return;
    onSave({
      id: holiday?.id,
      name: name.trim(),
      date,
      endDate,
      classes: classes.includes("All") ? ["All"] : classes,
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                {ALL_CLASSES.map((cls) => (
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
                ))}
              </Select>
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
                !name.trim() || !date || !endDate || classes.length === 0
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
