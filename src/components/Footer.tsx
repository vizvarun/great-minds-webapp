import {
  Box,
  Container,
  Link,
  Typography,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: "auto",
        backgroundColor: theme.palette.background.paper,
        borderTop: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} Great Minds School Management System
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: { xs: 1, sm: 0 } }}>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{ fontSize: "0.875rem" }}
            >
              Terms
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{ fontSize: "0.875rem" }}
            >
              Privacy
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{ fontSize: "0.875rem" }}
            >
              Support
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
