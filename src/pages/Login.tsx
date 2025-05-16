import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import mainBg from "../assets/main-bg.png";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setMobileNumber(value);
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobileNumber) {
      setError("Mobile number is required");
      return;
    }

    if (mobileNumber.length !== 10) {
      setError("Please enter a valid 10 digit mobile number");
      return;
    }

    // TODO: Call API to send OTP to the mobile number
    console.log("Sending OTP to", mobileNumber);

    // Navigate to OTP verification page
    navigate("/verify-otp", { state: { mobileNumber } });
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#FFFFFF",
      }}
    >
      {/* Left side - Clean, professional branding with background image */}
      {!isMobile && (
        <Box
          sx={{
            flex: "0 0 50%",
            position: "relative",
            backgroundImage: `url(${mainBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.2)", // Dark overlay for contrast
              zIndex: 1,
            },
          }}
        >
          {/* Logo in top left */}
          <Box
            component="img"
            src={logo}
            alt="Great Minds Logo"
            sx={{
              position: "absolute",
              top: 40,
              left: 40,
              width: 200,
              zIndex: 2,
              filter: "brightness(1.2)",
            }}
          />
        </Box>
      )}

      {/* Right side - Professional login form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#FFFFFF",
          p: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
          }}
        >
          {isMobile && (
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Box
                component="img"
                src={logo}
                alt="Great Minds Logo"
                sx={{ width: 90, mb: 2 }}
              />
            </Box>
          )}

          <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
            Sign In
          </Typography>

          <Typography variant="body2" color="#666666" sx={{ mb: 5 }}>
            Please enter your mobile number
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, ml: 0.5 }}
            >
              Mobile Number
            </Typography>
            <TextField
              fullWidth
              required
              id="mobileNumber"
              placeholder="Enter 10-digit mobile number"
              name="mobileNumber"
              autoComplete="tel"
              autoFocus
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              error={!!error}
              helperText={error}
              inputProps={{ maxLength: 10 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroidIcon sx={{ color: "#999999" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 0.5,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                },
              }}
              variant="outlined"
              label=""
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              sx={{
                py: 1.5,
                borderRadius: 0.5,
                textTransform: "none",
                fontWeight: 500,
                backgroundColor: "primary.main",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "primary.main",
                  opacity: 0.9,
                },
              }}
            >
              Continue
            </Button>

            <Typography
              variant="caption"
              align="center"
              sx={{
                display: "block",
                mt: 3,
                color: "#777777",
              }}
            >
              A verification code will be sent to your mobile number
            </Typography>
          </Box>

          <Box sx={{ mt: 8, textAlign: "center" }}>
            <Typography variant="caption" color="#999999">
              © {new Date().getFullYear()} Great Minds School Management System
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
