// @ts-nocheck
import {
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import ManIcon from "@mui/icons-material/Man";
import CakeIcon from "@mui/icons-material/Cake";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FemaleIcon from "@mui/icons-material/Female";
import AuthService from "../services/auth";

// Mock data for items that aren't yet coming from the API
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
  { id: 1, text: "Annual Sports Day registration opened", date: "Today" },
  {
    id: 2,
    text: "Science exhibition scheduled for next month",
    date: "Yesterday",
  },
  { id: 3, text: "Parent-teacher meeting on Friday", date: "2 days ago" },
];

const Dashboard = () => {
  const theme = useTheme();
  const [schoolData, setSchoolData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const profile = AuthService.getCachedUserProfile();
    const dashboard = AuthService.getDashboardData();
    console.log("first", profile);
    setSchoolData(profile);
    setDashboardData(dashboard);
  }, []);

  // Add a reusable noise background effect
  const noiseEffect = {
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0.1,
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)" opacity="0.5"/%3E%3C/svg%3E")',
      pointerEvents: "none",
    },
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
        width: "100%", // Ensure full width
      }}
    >
      {/* Fixed Header Section */}
      <Box sx={{ mb: 3, flexShrink: 0 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 500, color: "text.primary" }}
        >
          School Dashboard
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Overview of {schoolData?.name || "Great Minds School"} metrics and
          activities.
        </Typography>
      </Box>

      {/* Scrollable Content Area */}
      <Box sx={{ overflow: "auto", flex: 1, width: "100%" }}>
        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid item={true} xs={12} sm={6} lg={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                backgroundColor: "#D4E6F9", // Pastel blue
                height: "100%",
                ...noiseEffect,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                    <PeopleAltIcon />
                  </Avatar>
                  <Typography variant="h6" color="text.primary">
                    Students
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  fontWeight="bold"
                  color="primary.dark"
                >
                  {dashboardData?.total_students || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total enrolled students
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={12} sm={6} lg={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                backgroundColor: "#CFEBD0", // Pastel green
                height: "100%",
                ...noiseEffect,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                    <SchoolIcon />
                  </Avatar>
                  <Typography variant="h6" color="text.primary">
                    Teachers
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  fontWeight="bold"
                  color="success.dark"
                >
                  {dashboardData?.total_teachers || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Academic staff members
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={12} sm={6} lg={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                backgroundColor: "#FFF2CC", // Pastel yellow
                height: "100%",
                ...noiseEffect,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.warning.main, mr: 2 }}>
                    <ManIcon />
                  </Avatar>
                  <Typography variant="h6" color="text.primary">
                    Male Students
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  fontWeight="bold"
                  color="warning.dark"
                >
                  {dashboardData?.total_male_students || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dashboardData && dashboardData.total_students
                    ? Math.round(
                        (dashboardData.total_male_students /
                          dashboardData.total_students) *
                          100
                      )
                    : 0}
                  % of total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={12} sm={6} lg={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                backgroundColor: "#F7D7F1", // Pastel pink
                height: "100%",
                ...noiseEffect,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "#9C27B0", mr: 2 }}>
                    <FemaleIcon />
                  </Avatar>
                  <Typography variant="h6" color="text.primary">
                    Female Students
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  fontWeight="bold"
                  color="secondary.dark"
                >
                  {dashboardData?.total_female_students || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dashboardData && dashboardData.total_students
                    ? Math.round(
                        (dashboardData.total_female_students /
                          dashboardData.total_students) *
                          100
                      )
                    : 0}
                  % of total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Birthday and Activity Section */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item={true} xs={12} lg={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                border: "1px solid rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CakeIcon sx={{ color: "error.main", mr: 1 }} />
                <Typography variant="h6" color="text.primary">
                  Today's Birthdays
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {birthdayStudents.length > 0 ? (
                <TableContainer sx={{ flex: 1, maxHeight: 300 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: theme.palette.background.paper,
                          }}
                        >
                          Name
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: theme.palette.background.paper,
                          }}
                        >
                          Class
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: theme.palette.background.paper,
                          }}
                        >
                          Roll No
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {birthdayStudents.map((student) => (
                        <TableRow key={student.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {student.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>{student.roll}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ py: 3, textAlign: "center" }}>
                  <Typography variant="body1" color="text.secondary">
                    No birthdays today
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item={true} xs={12} lg={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AssignmentIcon sx={{ color: "info.main", mr: 1 }} />
                <Typography variant="h6" color="text.primary">
                  Recent Activities
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List>
                {recentActivities.map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={activity.text}
                      secondary={activity.date}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Dashboard;
