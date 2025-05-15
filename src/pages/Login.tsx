import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import Footer from "../components/Footer";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 8,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              color="primary"
              sx={{ mb: 4, fontWeight: "bold" }}
            >
              Great Minds
            </Typography>
            <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="mobileNumber"
                label="Mobile Number"
                name="mobileNumber"
                autoComplete="tel"
                autoFocus
                value={mobileNumber}
                onChange={handleMobileNumberChange}
                error={!!error}
                helperText={error}
                inputProps={{ maxLength: 10 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Continue
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default Login;
