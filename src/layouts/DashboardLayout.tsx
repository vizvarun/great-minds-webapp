import { type ReactNode } from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflow: "hidden", // Prevent any overflow scrolling
      }}
    >
      <Header schoolName="Great Minds School" username="Admin User" />

      {/* Add a toolbar placeholder for fixed header spacing */}
      <Box sx={{ height: "64px" }} />

      <Box sx={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 250px)` },
            height: "calc(100vh - 64px - 56px)", // Subtract header and footer heights
            backgroundColor: "#f5f5f5",
            overflow: "hidden", // Prevent scrolling in the content area
            position: "relative", // For proper positioning
            transition: "none", // Disable transitions during scroll
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default DashboardLayout;
