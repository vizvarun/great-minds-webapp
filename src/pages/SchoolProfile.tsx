import { Typography, Paper } from "@mui/material";

const SchoolProfile = () => {
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 0.5 }}>
      <Typography variant="h4" gutterBottom>
        School Profile
      </Typography>
      <Typography variant="body1">
        This section allows you to manage school profile settings.
      </Typography>
    </Paper>
  );
};

export default SchoolProfile;
