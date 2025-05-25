// @ts-nocheck

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
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
import { useEffect, useState } from "react";

// Mock data for academic years
const mockAcademicYears = [
  { id: 1, label: "2023-2024" },
  { id: 2, label: "2022-2023" },
  { id: 3, label: "2021-2022" },
];

// Mock data for classes
const mockClasses = [
  { id: 1, name: "Class 1" },
  { id: 2, name: "Class 2" },
  { id: 3, name: "Class 3" },
  { id: 4, name: "Class 4" },
  { id: 5, name: "Class 5" },
  { id: 6, name: "Class 6" },
  { id: 7, name: "Class 7" },
  { id: 8, name: "Class 8" },
  { id: 9, name: "Class 9" },
  { id: 10, name: "Class 10" },
];

// Mock data for fees structure
interface FeesStructureItem {
  id: number;
  term: string;
  amount: number;
  classId: number;
  academicYearId: number;
}

const mockFeesStructureData: FeesStructureItem[] = [
  {
    id: 1,
    term: "First Quarter",
    amount: 10000,
    classId: 1,
    academicYearId: 1,
  },
  {
    id: 2,
    term: "Second Quarter",
    amount: 10000,
    classId: 1,
    academicYearId: 1,
  },
  {
    id: 3,
    term: "Third Quarter",
    amount: 10000,
    classId: 1,
    academicYearId: 1,
  },
  {
    id: 4,
    term: "Fourth Quarter",
    amount: 10000,
    classId: 1,
    academicYearId: 1,
  },
  {
    id: 5,
    term: "First Quarter",
    amount: 12000,
    classId: 2,
    academicYearId: 1,
  },
  {
    id: 6,
    term: "Second Quarter",
    amount: 12000,
    classId: 2,
    academicYearId: 1,
  },
  { id: 7, term: "First Half", amount: 15000, classId: 3, academicYearId: 1 },
  { id: 8, term: "Second Half", amount: 15000, classId: 3, academicYearId: 1 },
  { id: 9, term: "Annual", amount: 30000, classId: 4, academicYearId: 1 },
  {
    id: 10,
    term: "First Quarter",
    amount: 9000,
    classId: 1,
    academicYearId: 2,
  },
  {
    id: 11,
    term: "Second Quarter",
    amount: 9000,
    classId: 1,
    academicYearId: 2,
  },
  {
    id: 12,
    term: "Third Quarter",
    amount: 9000,
    classId: 1,
    academicYearId: 2,
  },
  {
    id: 13,
    term: "Fourth Quarter",
    amount: 9000,
    classId: 1,
    academicYearId: 2,
  },
  {
    id: 14,
    term: "First Quarter",
    amount: 13000,
    classId: 5,
    academicYearId: 1,
  },
  {
    id: 15,
    term: "Second Quarter",
    amount: 13000,
    classId: 5,
    academicYearId: 1,
  },
  {
    id: 16,
    term: "Third Quarter",
    amount: 13000,
    classId: 5,
    academicYearId: 1,
  },
  { id: 17, term: "First Half", amount: 20000, classId: 6, academicYearId: 1 },
  { id: 18, term: "Second Half", amount: 20000, classId: 6, academicYearId: 1 },
];

const FeesStructure = () => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handle filter changes
  const handleYearChange = (event: SelectChangeEvent) => {
    setSelectedYear(event.target.value as string);
    setPage(0);
  };

  const handleClassChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value as string);
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleAddFeesStructure = () => {
    console.log("Add fees structure clicked");
    // Implement add fees structure functionality
  };

  const handleViewDetails = (id: number) => {
    console.log("View details for fees structure", id);
    // Implement view details functionality
  };

  // Pagination handlers
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter and search fees structure data
  const filteredData = mockFeesStructureData.filter((item) => {
    const yearMatch = selectedYear
      ? item.academicYearId === parseInt(selectedYear)
      : true;
    const classMatch = selectedClass
      ? item.classId === parseInt(selectedClass)
      : true;
    const searchMatch = searchQuery
      ? item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.amount.toString().includes(searchQuery)
      : true;

    return yearMatch && classMatch && searchMatch;
  });

  // Format currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const showTable = selectedYear && selectedClass;

  // Add custom CSS for tooltips
  useEffect(() => {
    // Add custom CSS to control tooltip positioning
    const style = document.createElement('style');
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
          Fees Structure
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            onClick={handleAddFeesStructure}
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
            Add Fees Structure
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Academic Year
              </Typography>
            </Box>
            <FormControl fullWidth size="medium" sx={{ minWidth: "100%" }}>
              <Select
                value={selectedYear}
                displayEmpty
                onChange={handleYearChange}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      width: "auto",
                      minWidth: "100%",
                    },
                  },
                }}
                sx={{
                  transition: "none",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select Academic Year</em>
                </MenuItem>
                {mockAcademicYears.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Class
              </Typography>
            </Box>
            <FormControl fullWidth size="medium" sx={{ minWidth: "100%" }}>
              <Select
                value={selectedClass}
                displayEmpty
                onChange={handleClassChange}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      width: "auto",
                      minWidth: "100%",
                    },
                  },
                }}
                sx={{
                  transition: "none",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select Class</em>
                </MenuItem>
                {mockClasses.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Table Section */}
      {showTable ? (
        <>
          <Box sx={{ mb: 2 }}>
            <TextField
              placeholder="Search by term or amount..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: 400,
                transition: "none",
                "& .MuiOutlinedInput-root": {
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="body1" fontWeight={500}>
              Fees Structure for:{" "}
            </Typography>
            <Chip
              label={
                mockClasses.find((c) => c.id === parseInt(selectedClass))?.name
              }
              color="primary"
              size="small"
              sx={{ ml: 1, mr: 1, fontWeight: 500 }}
            />
            <Typography variant="body1" fontWeight={500}>
              Academic Year:{" "}
            </Typography>
            <Chip
              label={
                mockAcademicYears.find((y) => y.id === parseInt(selectedYear))
                  ?.label
              }
              color="primary"
              size="small"
              sx={{ ml: 1, fontWeight: 500 }}
            />
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            variant="outlined"
            sx={{
              flex: 1,
              overflow: "auto",
              borderRadius: 0.5,
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: "grey.50", width: "50%" }}
                  >
                    Term
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: "grey.50", width: "30%" }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, bgcolor: "grey.50", width: "20%" }}
                    align="center"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.02)",
                          },
                          transition: "none",
                        }}
                      >
                        <TableCell>{row.term}</TableCell>
                        <TableCell>{formatAmount(row.amount)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            className="custom-tooltip"
                            data-tooltip="View Details"
                            size="small"
                            onClick={() => handleViewDetails(row.id)}
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
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      No fees structure data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25]}
            count={filteredData.length}
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
        </>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Please select an academic year and class to view fees structure.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FeesStructure;
