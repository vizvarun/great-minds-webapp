import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

interface HeaderProps {
  schoolName: string;
  username: string;
}

const Header = ({ schoolName, username }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: "none",
        bgcolor: "white",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo on the left */}
        <Box sx={{ display: "flex", alignItems: "center", width: "33%" }}>
          <Box
            component="img"
            src={logo}
            alt="School Logo"
            sx={{
              height: 32,
              width: "auto",
            }}
          />
        </Box>

        {/* School name centered */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "34%",
          }}
        >
          <Typography
            variant="h5"
            color="primary"
            noWrap
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            {schoolName || "Great Minds School"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "33%",
          }}
        >
          <Typography variant="body1" sx={{ mr: 2 }}>
            Hi, {username || "User"}
          </Typography>

          {/* Full Logout Button */}
          <Button
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              transition: "none",
              textTransform: "none",
              borderRadius: 1,
              px: 2,
              "&:hover": {
                backgroundColor: "transparent", // Prevent background change on hover
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
