import { Typography, Paper } from "@mui/material";

const AttendanceReport = () => {
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 0.5 }}>
      <Typography variant="h4" gutterBottom>
        Attendance Report
      </Typography>
      <Typography variant="body1">
        This section allows you to view and manage attendance reports.
      </Typography>
    </Paper>
  );
};

export default AttendanceReport;
