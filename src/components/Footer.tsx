import { Box, Container, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        position: "fixed", // Fixed position
        bottom: 0, // Stick to bottom
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer - 1, // Below drawer but above content
        backgroundColor: theme.palette.background.paper,
        borderTop: "1px solid",
        borderColor: "grey.200",
        transition: "none", // Disable transitions
        height: "56px", // Fixed height for consistent spacing
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // Center the content
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            Great Minds™ by Prastara® | © {currentYear}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
