import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import mainBg from "../assets/main-bg.png";
import logo from "../assets/logo.png";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mobileNumber = location.state?.mobileNumber || "";
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

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

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(value.length - 1);
    }

    if (!/^[0-9]*$/.test(value) && value !== "") {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);

      inputRefs.current[3]?.focus();
    }
  };

  const handleResendOTP = () => {
    if (!canResend) return;

    setOtp(["", "", "", ""]);
    setError("");
    setCanResend(false);
    setTimer(30);

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

    console.log("Resending OTP to", mobileNumber);

    inputRefs.current[0]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      setError("Please enter the 4-digit OTP");
      return;
    }

    console.log("Verifying OTP:", otpValue, "for mobile number:", mobileNumber);

    localStorage.setItem("isAuthenticated", "true");

    navigate("/dashboard");
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
            Please enter the 4-digit code sent to
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
                    width: "60px",
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      p: 1.5,
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
              Verify
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
