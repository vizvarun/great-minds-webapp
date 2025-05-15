import { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  IconButton,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Mock data for holidays
interface Holiday {
  id: number;
  date: string; // ISO format
  name: string;
  classes: string[]; // List of classes affected
}

const mockHolidays: Holiday[] = [
  { id: 1, date: "2023-01-26", name: "Republic Day", classes: ["All"] },
  { id: 2, date: "2023-08-15", name: "Independence Day", classes: ["All"] },
  { id: 3, date: "2023-10-02", name: "Gandhi Jayanti", classes: ["All"] },
  { id: 4, date: "2023-10-24", name: "Dussehra", classes: ["All"] },
  { id: 5, date: "2023-11-12", name: "Diwali", classes: ["All"] },
  { id: 6, date: "2023-12-25", name: "Christmas", classes: ["All"] },
  {
    id: 7,
    date: "2023-09-05",
    name: "Teachers' Day",
    classes: ["Class 6", "Class 7", "Class 8"],
  },
  {
    id: 8,
    date: "2023-11-14",
    name: "Children's Day",
    classes: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"],
  },
  { id: 9, date: "2023-04-14", name: "Dr. Ambedkar Jayanti", classes: ["All"] },
  { id: 10, date: "2023-05-01", name: "Labor Day", classes: ["All"] },
  {
    id: 11,
    date: "2023-08-29",
    name: "Sports Day",
    classes: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"],
  },
  { id: 12, date: "2023-09-15", name: "Mid-Term Break", classes: ["All"] },
  { id: 13, date: "2024-01-01", name: "New Year", classes: ["All"] },
  { id: 14, date: "2023-03-08", name: "Holi", classes: ["All"] },
  { id: 15, date: "2023-04-07", name: "Good Friday", classes: ["All"] },
  {
    id: 16,
    date: "2023-12-20",
    name: "Annual Day Function",
    classes: [
      "Class 11 - Science",
      "Class 11 - Commerce",
      "Class 12 - Science",
      "Class 12 - Commerce",
    ],
  },
  {
    id: 17,
    date: "2024-02-14",
    name: "Science Exhibition",
    classes: [
      "Class 9",
      "Class 10",
      "Class 11 - Science",
      "Class 12 - Science",
    ],
  },
  { id: 18, date: "2023-12-05", name: "Class Picnic", classes: ["Class 8"] },
];

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

const Holidays = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter holidays based on search query
  const filteredHolidays = mockHolidays
    .filter(
      (holiday) =>
        holiday.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatDate(holiday.date)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        getDayOfWeek(holiday.date)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date

  const handleChangePage = (event: unknown, newPage: number) => {
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
    console.log("Add holiday clicked");
    // Implement add holiday functionality
  };

  const handleEditHoliday = (id: number) => {
    console.log("Edit holiday", id);
    // Implement edit holiday functionality
  };

  const handleDeleteHoliday = (id: number) => {
    console.log("Delete holiday", id);
    // Implement delete holiday functionality
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
        <Table stickyHeader sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              <TableCell
                sx={{ fontWeight: 600, bgcolor: "grey.50", width: "15%" }}
              >
                Date
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
                sx={{ fontWeight: 600, bgcolor: "grey.50", width: "30%" }}
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
                  <TableCell>{formatDate(holiday.date)}</TableCell>
                  <TableCell>{getDayOfWeek(holiday.date)}</TableCell>
                  <TableCell>{holiday.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {holiday.classes.length === 1 &&
                      holiday.classes[0] === "All" ? (
                        <Chip
                          label="All Classes"
                          size="small"
                          color="primary"
                          sx={{
                            height: 24,
                            fontSize: "0.75rem",
                            transition: "none",
                          }}
                        />
                      ) : (
                        holiday.classes.map((cls, index) => (
                          <Chip
                            key={index}
                            label={cls}
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: "0.75rem",
                              transition: "none",
                            }}
                          />
                        ))
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditHoliday(holiday.id)}
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
                        size="small"
                        onClick={() => handleDeleteHoliday(holiday.id)}
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
      </TableContainer>

      {/* Fixed Pagination Section */}
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
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
    </Paper>
  );
};

export default Holidays;
