import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

interface CustomSpinnerProps {
  size?: number;
  color?: string;
  dotCount?: number;
}

const CustomSpinner: React.FC<CustomSpinnerProps> = ({
  size = 20,
  color = "currentColor",
  dotCount = 3,
}) => {
  const [dots, setDots] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Initialize dots array
  useEffect(() => {
    setDots(Array.from({ length: dotCount }, (_, i) => i));
  }, [dotCount]);

  // Animate dots
  useEffect(() => {
    if (dots.length === 0) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % dots.length);
    }, 300);

    return () => clearInterval(timer);
  }, [dots]);

  // Make dots smaller - use a smaller fraction of the overall size
  const dotSize = Math.max(size / 5, 3); // Minimum size of 3px

  return (
    <Box
      sx={{
        display: "flex",
        gap: "2px", // Reduce gap between dots
        alignItems: "center",
      }}
    >
      {dots.map((dot, index) => (
        <Box
          key={dot}
          sx={{
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            borderRadius: "50%",
            opacity: index === activeIndex ? 1 : 0.3,
            transition: "opacity 0.15s ease",
          }}
        />
      ))}
    </Box>
  );
};

export default CustomSpinner;
