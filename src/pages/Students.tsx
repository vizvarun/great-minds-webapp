import { Typography, Paper } from "@mui/material";

const Students = () => {
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 0.5 }}>
      <Typography variant="h4" gutterBottom>
        Students
      </Typography>
      <Typography variant="body1">
        This section allows you to manage all students.
      </Typography>
    </Paper>
  );
};

export default Students;
