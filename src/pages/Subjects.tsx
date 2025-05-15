import { Typography, Paper } from "@mui/material";

const Subjects = () => {
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 0.5 }}>
      <Typography variant="h4" gutterBottom>
        Subjects
      </Typography>
      <Typography variant="body1">
        This section allows you to manage all subjects.
      </Typography>
    </Paper>
  );
};

export default Subjects;
