import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  TextField,
  Stack,
} from "@mui/material";
import Footer from "../components/Footer";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mobileNumber = location.state?.mobileNumber || "";
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // If no mobile number provided, redirect back to login
    if (!mobileNumber) {
      navigate("/login");
      return;
    }

    // Start the timer for resend OTP
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mobileNumber, navigate]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(value.length - 1);
    }

    if (!/^[0-9]*$/.test(value) && value !== "") {
      return;
    }

    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Move focus to the next input field if not the last one
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // If backspace and no value in current input, move to previous
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is 4 digits
    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);

      // Focus the last input
      inputRefs.current[3]?.focus();
    }
  };

  const handleResendOTP = () => {
    if (!canResend) return;

    // Reset the OTP fields
    setOtp(["", "", "", ""]);
    setError("");
    setCanResend(false);
    setTimer(30);

    // Start the timer again
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    // TODO: Call the API to resend OTP
    console.log("Resending OTP to", mobileNumber);

    // Focus on first input field
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      setError("Please enter the 4-digit OTP");
      return;
    }

    // TODO: Call API to validate OTP
    console.log("Verifying OTP:", otpValue, "for mobile number:", mobileNumber);

    // In a real application, we would validate the OTP with the backend
    // For demo purposes, any 4-digit OTP is considered valid

    // Set authentication flag in localStorage
    localStorage.setItem("isAuthenticated", "true");

    // Navigate to dashboard on successful verification
    navigate("/dashboard");
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
            <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
              OTP Verification
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Please enter the 4-digit OTP sent to
              <br />
              {mobileNumber}
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{ mb: 2 }}
              >
                {[0, 1, 2, 3].map((digit) => (
                  <TextField
                    key={`otp-field-${digit}`}
                    inputRef={(ref) => (inputRefs.current[digit] = ref)}
                    variant="outlined"
                    value={otp[digit]}
                    onChange={(e) => handleInputChange(digit, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(digit, e)}
                    onPaste={digit === 0 ? handlePaste : undefined}
                    sx={{
                      width: 60,
                      height: 60,
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        maxLength: 1,
                        autoComplete: "off",
                      },
                    }}
                  />
                ))}
              </Stack>

              {error && (
                <Typography
                  color="error"
                  variant="body2"
                  sx={{ textAlign: "center", mb: 2 }}
                >
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2, py: 1.5 }}
              >
                Verify OTP
              </Button>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                {canResend ? (
                  <Button
                    onClick={handleResendOTP}
                    variant="text"
                    color="primary"
                  >
                    Resend OTP
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Resend OTP in {timer} seconds
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default VerifyOTP;
