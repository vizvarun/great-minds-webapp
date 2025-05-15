import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

interface HeaderProps {
  schoolName: string;
  username: string;
}

const Header = ({ schoolName, username }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication flag from localStorage
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      color="inherit" // Using "inherit" instead of "default"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: "none", // Disable any transitions
        bgcolor: "white", // Explicitly set background color to white
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          color="primary"
          noWrap
          sx={{ fontWeight: "bold" }}
        >
          {schoolName || "Great Minds School"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Hi, {username || "User"}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            startIcon={<LogoutIcon fontSize="small" />}
            sx={{
              textTransform: "none",
              borderRadius: 0.5,
              minWidth: 0,
              py: 0.75, // Reduced vertical padding
              px: 2, // Reduced horizontal padding
              transition: "none",
              "&:hover": {
                backgroundColor: "transparent",
                borderColor: "primary.main", // Keep border color consistent on hover
                transform: "none", // Disable any transform animations
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
