// @ts-nocheck

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import mainBg from "../assets/main-bg.png";
import AuthService from "../services/auth";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mobileNumber = location.state?.mobileNumber || "";
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]); // 6 digits
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (!mobileNumber) {
      navigate("/login");
      return;
    }

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

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value !== "" && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    setApiError("");

    // Auto-advance to next field
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to previous field on backspace if current field is empty
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      setApiError("");

      // Call the verifyOTP API
      const verifyResponse = await AuthService.verifyOTP({
        mobile_number: mobileNumber,
        device_id: "web", // Make sure this is included per the updated interface
        otp: otpValue,
      });

      // Check if OTP verification was successful
      if (verifyResponse.status) {
        try {
          // Fetch user profile after successful verification
          const profileResponse = await AuthService.getUserProfile();

          if (profileResponse.status) {
            // Navigate to dashboard after successful profile fetch
            navigate("/dashboard");
          } else {
            setApiError(
              profileResponse.message || "Failed to load user profile"
            );
          }
        } catch (profileError: any) {
          console.error("Profile fetch error:", profileError);
          setApiError("Failed to load profile data. Please try again.");
        }
      } else {
        setApiError(verifyResponse.message || "OTP verification failed");
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setApiError(
        err.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setApiError("");
      await AuthService.login({
        mobile_number: mobileNumber,
        device_id: "web",
        bypass_otp: false,
      });

      setTimer(30);
      setCanResend(false);
      // Reset the OTP fields
      setOtp(["", "", "", "", "", ""]);
      // Focus on the first input
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      setApiError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    }
  };

  const formattedMobile = mobileNumber
    ? `+91 ${mobileNumber.slice(0, 5)} ${mobileNumber.slice(5)}`
    : "";

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#FFFFFF",
      }}
    >
      {!isMobile ? (
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
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 1,
            },
          }}
        >
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
      ) : null}

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
            Verification
          </Typography>

          <Typography variant="body2" color="#666666" sx={{ mb: 2 }}>
            Please enter the 6-digit code sent to
          </Typography>

          <Typography
            variant="subtitle2"
            fontWeight={500}
            sx={{ mb: 5, color: "#333333" }}
          >
            {formattedMobile}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, ml: 0.5 }}
            >
              Verification Code
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              {[0, 1, 2, 3, 4, 5].map((digit) => (
                <TextField
                  key={`otp-field-${digit}`}
                  inputRef={(ref) => (inputRefs.current[digit] = ref)}
                  variant="outlined"
                  value={otp[digit]}
                  onChange={(e) => handleChange(digit, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(digit, e)}
                  sx={{
                    width: "45px",
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                      p: 1.25,
                      height: "35px",
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.23)",
                      },
                    },
                  }}
                  inputProps={{
                    maxLength: 1,
                    autoComplete: "off",
                  }}
                />
              ))}
            </Stack>

            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{ textAlign: "left", mb: 2 }}
              >
                {error}
              </Typography>
            )}

            {apiError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {apiError}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              disabled={isLoading}
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
              {isLoading ? "Verifying..." : "Verify"}
            </Button>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 3,
              }}
            >
              {canResend ? (
                <Button
                  onClick={handleResendOTP}
                  variant="text"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 0.5,
                  }}
                >
                  Resend Verification Code
                </Button>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress
                    variant="determinate"
                    value={(timer / 30) * 100}
                    size={16}
                    thickness={4}
                    sx={{ mr: 1, color: "#999999" }}
                  />
                  <Typography variant="body2" color="#777777">
                    Resend code in {timer} seconds
                  </Typography>
                </Box>
              )}
            </Box>
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

export default VerifyOTP;
