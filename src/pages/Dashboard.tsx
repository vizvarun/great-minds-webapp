// @ts-nocheck
import {
  Typography,
  Paper,
  Box,
  Card,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Stack,
  Chip,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import CakeIcon from "@mui/icons-material/Cake";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EventIcon from "@mui/icons-material/Event";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AuthService from "../services/auth";

// Mock data - unchanged
const attendanceData = [85, 78, 92, 88, 76, 89, 94];
const classPerformance = [
  { name: "Class I", avg: 87 },
  { name: "Class II", avg: 82 },
  { name: "Class III", avg: 91 },
  { name: "Class IV", avg: 79 },
  { name: "Class V", avg: 84 },
];
const birthdayStudents = [
  {
    id: 1,
    name: "Aarav Sharma",
    class: "X-A",
    roll: 15,
    photoUrl: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 2,
    name: "Priya Patel",
    class: "VIII-B",
    roll: 23,
    photoUrl: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Vikram Singh",
    class: "XII-C",
    roll: 7,
    photoUrl: "https://i.pravatar.cc/150?img=8",
  },
];
const recentActivities = [
  {
    id: 1,
    text: "Annual Sports Day registration opened",
    date: "Today",
    type: "event",
  },
  {
    id: 2,
    text: "Science exhibition scheduled for next month",
    date: "Yesterday",
    type: "announcement",
  },
  {
    id: 3,
    text: "Parent-teacher meeting on Friday",
    date: "2 days ago",
    type: "meeting",
  },
  {
    id: 4,
    text: "New curriculum update released",
    date: "3 days ago",
    type: "update",
  },
];

const Dashboard = () => {
  const theme = useTheme();
  const [schoolData, setSchoolData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Load data from localStorage on component mount
  useEffect(() => {
    const profile = AuthService.getCachedUserProfile();
    const dashboard = AuthService.getDashboardData();
    setSchoolData(profile);
    setDashboardData(dashboard);
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 1,
        border: 1,
        borderColor: theme.palette.divider,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header with hero section */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "40%",
            height: "100%",
            opacity: 0.1,
            background:
              'url("https://img.freepik.com/free-vector/abstract-white-shapes-background_79603-1362.jpg?w=1380") no-repeat center center',
            backgroundSize: "cover",
          }}
        ></Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 3,
            mb: 2,
          }}
        >
          {/* School Logo */}
          {schoolData?.logo || schoolData?.schoolLogo ? (
            <Avatar
              src={schoolData?.logo || schoolData?.schoolLogo}
              alt="School Logo"
              sx={{
                width: 80,
                height: 80,
                bgcolor: "white",
                boxShadow: "0 0 0 4px rgba(255,255,255,0.2)",
                p: 1,
              }}
              variant="rounded"
            />
          ) : (
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
              variant="rounded"
            >
              {schoolData?.name?.charAt(0) || "S"}
            </Avatar>
          )}

          <Box>
            <Typography variant="h4" fontWeight="bold">
              {schoolData?.name || "Great Minds School"}
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                opacity: 0.9,
              }}
            >
              Welcome to your school dashboard
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            mt: 3,
            gap: 5,
          }}
        >
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              Total Students
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {dashboardData?.total_students || 0}
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              Total Teachers
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {dashboardData?.total_teachers || 0}
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              Gender Ratio
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {dashboardData?.total_male_students || 0} :{" "}
              {dashboardData?.total_female_students || 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 3,
        }}
      >
        {/* Bottom Row with Birthdays and Activities */}
        <Grid container spacing={3}>
          {/* Today's Birthdays */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                minWidth: 400,
                flex: 1,
              }}
            >
              <Box sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: theme.palette.error.light }}>
                      <CakeIcon sx={{ color: theme.palette.error.main }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Today's Birthdays
                    </Typography>
                  </Stack>
                </Box>
              </Box>

              <Divider />

              {birthdayStudents.length > 0 ? (
                <TableContainer sx={{ flex: 1 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>
                          Student
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>
                          Class
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>
                          Roll No.
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {birthdayStudents.map((student) => (
                        <TableRow key={student.id} hover>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography variant="body2" fontWeight="medium">
                                {student.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={student.class}
                              size="small"
                              sx={{ fontWeight: "medium" }}
                            />
                          </TableCell>
                          <TableCell>{student.roll}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    No birthdays today
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 2,
                display: "flex",
                flex: 1,
                flexDirection: "column",
                minWidth: 400,
              }}
            >
              <Box sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                      <EventIcon sx={{ color: theme.palette.info.main }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Recent Activities
                    </Typography>
                  </Stack>
                </Box>
              </Box>

              <Divider />

              <List disablePadding sx={{ overflow: "auto", flex: 1 }}>
                {recentActivities.map((activity) => {
                  const getBorderColor = () => {
                    switch (activity.type) {
                      case "event":
                        return theme.palette.primary.main;
                      case "announcement":
                        return theme.palette.secondary.main;
                      case "meeting":
                        return theme.palette.warning.main;
                      default:
                        return theme.palette.info.main;
                    }
                  };

                  const getChipColor = () => {
                    switch (activity.type) {
                      case "event":
                        return "primary";
                      case "announcement":
                        return "secondary";
                      case "meeting":
                        return "warning";
                      default:
                        return "info";
                    }
                  };

                  return (
                    <ListItem
                      key={activity.id}
                      divider
                      sx={{
                        py: 2,
                        px: 3,
                        borderLeft: `4px solid ${getBorderColor()}`,
                        transition: "all 0.2s",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body1" fontWeight="medium">
                              {activity.text}
                            </Typography>
                            <Chip
                              label={activity.date}
                              size="small"
                              color={getChipColor()}
                              variant="outlined"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{ mt: 0.5 }}
                            color="text.secondary"
                          >
                            {activity.type.charAt(0).toUpperCase() +
                              activity.type.slice(1)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Dashboard;
