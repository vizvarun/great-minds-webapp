import { Typography, Paper } from "@mui/material";

const Dashboard = () => {
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 0.5 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to the Great Minds dashboard. This is the main dashboard
        content.
      </Typography>
    </Paper>
  );
};

export default Dashboard;
