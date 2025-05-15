import { Typography, Paper } from "@mui/material";

const Classes = () => {
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 0.5 }}>
      <Typography variant="h4" gutterBottom>
        Classes
      </Typography>
      <Typography variant="body1">
        This section allows you to manage all classes.
      </Typography>
    </Paper>
  );
};

export default Classes;
