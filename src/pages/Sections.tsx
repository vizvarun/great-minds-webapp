import { Typography, Paper } from "@mui/material";

const Sections = () => {
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 0.5 }}>
      <Typography variant="h4" gutterBottom>
        Sections
      </Typography>
      <Typography variant="body1">
        This section allows you to manage all sections.
      </Typography>
    </Paper>
  );
};

export default Sections;
