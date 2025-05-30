//@ts-nocheck

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import HolidayFormDialog from "./HolidayFormDialog";
import {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  downloadHolidays,
} from "../services/holidayService";
import type { Holiday } from "../services/holidayService";

// Helper function to get day of the week from date
const getDayOfWeek = (dateString: string): string => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(dateString);
  return days[date.getDay()];
};

// Helper function to format date for display
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Updated helper function to format duration to show range properly
const formatDuration = (startDate: string, endDate: string): string => {
  if (!startDate) return "-";
  if (!endDate || startDate === endDate) return formatDate(startDate);

  // Show as range if end date is different from start date
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

// Updated function to format day of the week to show range for multi-day holidays
const formatDay = (startDate: string, endDate: string): string => {
  if (!startDate) return "-";

  const startDay = getDayOfWeek(startDate);

  // If no end date or same date, just return the day of the start date
  if (!endDate || startDate === endDate) return startDay;

  // For multi-day holidays, calculate all days in between
  const start = new Date(startDate);
  const end = new Date(endDate);

  // If the difference is just one day, show both days
  if ((end.getTime() - start.getTime()) / (1000 * 3600 * 24) <= 1) {
    const endDay = getDayOfWeek(endDate);
    return startDay === endDay ? startDay : `${startDay} - ${endDay}`;
  }

  // For longer periods, show "Multiple Days" or the specific range
  // If spanning a week or more, show "Multiple Days"

  // Otherwise show the specific range
  const endDay = getDayOfWeek(endDate);
  return `${startDay} - ${endDay}`;
};

// Completely rewritten function to properly handle class data structure
const formatClasses = (classes: any[]): JSX.Element => {
  // Handle empty/undefined classes
  if (!classes || !Array.isArray(classes) || classes.length === 0) {
    return (
      <Chip
        label="No classes assigned"
        size="small"
        color="default"
        sx={{ height: 24, fontSize: "0.75rem" }}
      />
    );
  }

  // Special case for "All Classes"
  if (classes.length === 1) {
    const firstClass = classes[0];
    if (
      firstClass === "All" ||
      (typeof firstClass === "object" &&
        (firstClass.id === "All" ||
          firstClass.name === "All" ||
          firstClass.classname === "All"))
    ) {
      return (
        <Chip
          label="All Classes"
          size="small"
          color="primary"
          sx={{ height: 24, fontSize: "0.75rem" }}
        />
      );
    }
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {classes.map((cls, index) => {
        // Determine the display label and key based on data structure
        let label;
        let key;

        if (typeof cls === "string") {
          label = cls;
          key = `class-${index}`;
        } else if (typeof cls === "object" && cls !== null) {
          // Try all possible property names for the class name
          label =
            cls.classname ||
            cls.name ||
            cls.className ||
            cls.class_name ||
            cls.class ||
            `Class ${cls.id || index}`;

          // Use id if available, otherwise use index
          key = cls.id ? `class-${cls.id}` : `class-${index}`;
        } else {
          // Fallback for unexpected data type
          label = `Class ${index + 1}`;
          key = `class-${index}`;
        }

        return (
          <Chip
            key={key}
            label={label}
            size="small"
            sx={{ height: 24, fontSize: "0.75rem", transition: "none" }}
          />
        );
      })}
    </Box>
  );
};

const Holidays = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [editHoliday, setEditHoliday] = useState<Holiday | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState<Holiday | null>(null);
  const [loading, setLoading] = useState(true);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
    timestamp: Date.now(),
  });

  // Fetch holidays when component mounts
  useEffect(() => {
    fetchHolidays();
  }, []);

  // Add custom CSS for tooltips
  useEffect(() => {
    // Add custom CSS to control tooltip positioning
    const style = document.createElement("style");
    style.innerHTML = `
      .custom-tooltip {
        position: relative;
      }
      .custom-tooltip::before {
        content: attr(data-tooltip);
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        padding: 5px 8px;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.75);
        color: white;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s;
        z-index: 1000;
      }
      .custom-tooltip:hover::before {
        opacity: 1;
        visibility: visible;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const data = await getHolidays();
      setHolidays(data);
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to load holidays",
        severity: "error",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter holidays based on search query
  const filteredHolidays = holidays
    .filter(
      (holiday) =>
        holiday.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatDate(holiday.startDate)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        formatDay(holiday.startDate, holiday.endDate)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleAddHoliday = () => {
    setEditHoliday(null);
    setOpenEditDialog(true);
  };

  const handleEditHolidayOpen = (holiday: Holiday) => {
    setEditHoliday(holiday);
    setOpenEditDialog(true);
  };

  const handleEditHolidayClose = () => {
    setOpenEditDialog(false);
  };

  const handleDeleteHolidayOpen = (holiday: Holiday) => {
    setHolidayToDelete(holiday);
    setOpenDeleteDialog(true);
  };

  const handleDeleteHolidayClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    if (holidayToDelete) {
      try {
        setLoading(true);
        await deleteHoliday(holidayToDelete.id!);

        setNotification({
          open: true,
          message: "Holiday deleted successfully",
          severity: "success",
          timestamp: Date.now(),
        });

        // Fetch updated list instead of just updating the local state
        await fetchHolidays();
      } catch (error) {
        setNotification({
          open: true,
          message: "Failed to delete holiday",
          severity: "error",
          timestamp: Date.now(),
        });
        setLoading(false);
      } finally {
        setOpenDeleteDialog(false);
      }
    }
  };

  const handleSaveHoliday = async (holiday: Holiday) => {
    try {
      // Start showing loader
      setLoading(true);

      if (editHoliday) {
        // Edit existing holiday
        await updateHoliday({
          ...holiday,
          id: editHoliday.id,
        });

        setNotification({
          open: true,
          message: "Holiday updated successfully",
          severity: "success",
          timestamp: Date.now(),
        });
      } else {
        // Add new holiday
        await createHoliday(holiday);

        setNotification({
          open: true,
          message: "Holiday added successfully",
          severity: "success",
          timestamp: Date.now(),
        });
      }

      setOpenEditDialog(false);

      // Fetch the updated list of holidays
      await fetchHolidays();
    } catch (error) {
      setNotification({
        open: true,
        message: editHoliday
          ? "Failed to update holiday"
          : "Failed to add holiday",
        severity: "error",
        timestamp: Date.now(),
      });
      setLoading(false); // Stop showing loader if there's an error
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Add handler for downloading holidays
  const handleDownloadHolidays = async () => {
    try {
      // Show loading notification
      setNotification({
        open: true,
        message: "Downloading holidays data...",
        severity: "info",
        timestamp: Date.now(),
      });

      // Call the API to get the Excel file as blob
      const blob = await downloadHolidays();

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a hidden link element and trigger download with .xlsx extension
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `holidays.xlsx`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);

      // Show success notification
      setNotification({
        open: true,
        message: "Holidays data downloaded successfully",
        severity: "success",
        timestamp: Date.now(),
      });
    } catch (error) {
      // Show error notification
      setNotification({
        open: true,
        message: "Failed to download holidays data",
        severity: "error",
        timestamp: Date.now(),
      });
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 0.5,
        border: 1,
        borderColor: "grey.200",
        height: "calc(100% - 16px)", // Account for the parent padding
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent the Paper component from scrolling
      }}
    >
      {/* Fixed Header Section */}
      <Box sx={{ mb: 3, flexShrink: 0 }}>
        <Typography
          variant="h5"
          gutterBottom
          mb={2}
          sx={{ fontWeight: 500, color: "text.primary" }}
        >
          Holidays
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search holidays..."
            variant="outlined"
            size="medium"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              minWidth: 250,
              flex: 1,
              maxWidth: 400,
              outline: "none",
              "&:focus": {
                outline: "none",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
              onClick={handleAddHoliday}
              sx={{
                textTransform: "none",
                borderRadius: 0.5,
                transition: "none",
                backgroundImage: "none",
                background: "primary.main",
                boxShadow: "none",
                "&:hover": {
                  backgroundImage: "none",
                  background: "primary.main",
                  opacity: 0.9,
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              Add Holiday
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadHolidays}
              sx={{
                textTransform: "none",
                borderRadius: 0.5,
                transition: "none",
                outline: "none",
                "&:hover": {
                  bgcolor: "transparent",
                  borderColor: "primary.main",
                  outline: "none",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              Download
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Scrollable Table Container */}
      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{
          borderRadius: 0.5,
          flex: 1,
          overflow: "auto",
          height: "100%",
          maxHeight: "calc(100% - 120px)",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Table stickyHeader sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "20%" }}
                >
                  Duration
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "15%" }}
                >
                  Day
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "25%" }}
                >
                  Holiday
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "25%" }}
                >
                  Classes
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, bgcolor: "grey.50", width: "15%" }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHolidays
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((holiday) => (
                  <TableRow
                    key={holiday.id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                      transition: "none",
                    }}
                  >
                    <TableCell>
                      {formatDuration(holiday.startDate, holiday.endDate)}
                    </TableCell>
                    <TableCell>
                      {formatDay(holiday.startDate, holiday.endDate)}
                    </TableCell>
                    <TableCell>{holiday.name || "-"}</TableCell>
                    <TableCell>{formatClasses(holiday.classes)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <IconButton
                          className="custom-tooltip"
                          data-tooltip="Edit Holiday"
                          size="small"
                          onClick={() => handleEditHolidayOpen(holiday)}
                          color="primary"
                          sx={{
                            transition: "none",
                            outline: "none",
                            "&:hover": {
                              bgcolor: "rgba(25, 118, 210, 0.04)",
                            },
                            "&:focus": {
                              outline: "none",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          className="custom-tooltip"
                          data-tooltip="Delete Holiday"
                          size="small"
                          onClick={() => handleDeleteHolidayOpen(holiday)}
                          color="error"
                          sx={{
                            transition: "none",
                            outline: "none",
                            "&:hover": {
                              bgcolor: "rgba(211, 47, 47, 0.04)",
                            },
                            "&:focus": {
                              outline: "none",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredHolidays.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    No holidays found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Fixed Pagination Section */}
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        count={filteredHolidays.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          flexShrink: 0,
          borderTop: 1,
          borderColor: "grey.200",
          mt: 1,
          "& .MuiButtonBase-root": {
            transition: "none",
            "&:hover": {
              bgcolor: "transparent",
              opacity: 0.8,
            },
          },
        }}
      />

      {/* Edit Holiday Dialog */}
      <HolidayFormDialog
        open={openEditDialog}
        onClose={handleEditHolidayClose}
        onSave={handleSaveHoliday as (holiday: Holiday) => void}
        holiday={editHoliday as Holiday}
      />

      {/* Delete Confirmation Modal */}
      {openDeleteDialog && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: 400,
              maxWidth: "95%",
              borderRadius: 2,
              p: 3,
              outline: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Confirm Deletion
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
                Are you sure you want to delete{" "}
                <strong>{holidayToDelete?.name}</strong>? This action cannot be
                undone.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleDeleteHolidayClose}
                  sx={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleConfirmDelete}
                  sx={{ flex: 1 }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        key={notification.timestamp}
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="standard"
          sx={{
            width: "100%",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            border: "1px solid",
            borderColor:
              notification.severity === "success"
                ? "rgba(46, 125, 50, 0.2)"
                : notification.severity === "info"
                ? "rgba(2, 136, 209, 0.2)"
                : notification.severity === "warning"
                ? "rgba(237, 108, 2, 0.2)"
                : "rgba(211, 47, 47, 0.2)",
            borderRadius: 1,
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Holidays;
