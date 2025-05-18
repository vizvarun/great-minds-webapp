import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getTeachersBySection } from "../services/teacherService";
import type { Teacher } from "../services/teacherService";

const SectionTeachers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sectionId, className, sectionName } = location.state || {};

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      if (!sectionId) {
        setError("Section ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const teachersData = await getTeachersBySection(sectionId);
        setTeachers(teachersData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        setError("Failed to load teachers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [sectionId]);

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (teacher.fullName &&
        teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      teacher.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page (sections)
  };

  const handleAddTeacher = () => {
    console.log("Add teacher clicked for section", sectionId);
    // Implement add teacher functionality
  };

  const handleDeleteTeacher = (id: number) => {
    console.log("Delete teacher", id);
    // Implement delete teacher functionality
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 0.5,
        border: 1,
        borderColor: "grey.200",
        height: "calc(100% - 16px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          variant="text"
          sx={{
            mr: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
            outline: "none",
            "&:focus": {
              outline: "none",
            },
          }}
        >
          Back
        </Button>
        <Typography
          variant="h5"
          sx={{ fontWeight: 500, color: "text.primary" }}
        >
          Teachers - {className} {sectionName}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Search and Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          placeholder="Search teachers..."
          variant="outlined"
          size="medium"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            minWidth: 250,
            flex: 1,
            maxWidth: 400,
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
          onClick={handleAddTeacher}
          sx={{
            textTransform: "none",
            borderRadius: 0.5,
            backgroundImage: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundImage: "none",
              opacity: 0.9,
            },
          }}
        >
          Add Teacher
        </Button>
      </Box>

      {/* Teachers Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{
          borderRadius: 0.5,
          flex: 1,
          overflow: "auto",
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
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 4,
            }}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                  Designation
                </TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                  Email
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
              {filteredTeachers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((teacher) => (
                  <TableRow
                    key={teacher.id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  >
                    <TableCell>
                      {teacher.fullName ||
                        `${teacher.firstName || ""} ${
                          teacher.lastName || ""
                        }`.trim() ||
                        "-"}
                    </TableCell>
                    <TableCell>{teacher.designation || "-"}</TableCell>
                    <TableCell>{teacher.email || "-"}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteTeacher(teacher.id)}
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
              {filteredTeachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    No teachers found for this section.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        count={filteredTeachers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          flexShrink: 0,
          borderTop: 1,
          borderColor: "grey.200",
          mt: 1,
        }}
      />
    </Paper>
  );
};

export default SectionTeachers;
