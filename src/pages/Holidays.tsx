import { Typography, Paper } from "@mui/material";

const Holidays = () => {
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 0.5 }}>
      <Typography variant="h4" gutterBottom>
        Holidays
      </Typography>
      <Typography variant="body1">
        This section allows you to view and manage all holidays.
      </Typography>
    </Paper>
  );
};

export default Holidays;
