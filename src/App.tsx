import { type ReactNode } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import Sections from "./pages/Sections";
import Subjects from "./pages/Subjects";
import Holidays from "./pages/Holidays";
import AttendanceReport from "./pages/AttendanceReport";
import FeesStructure from "./pages/FeesStructure";
import SchoolProfile from "./pages/SchoolProfile";
import SectionTeachers from "./pages/SectionTeachers";
import SectionStudents from "./pages/SectionStudents";

// Wrap dashboard layout around content
const DashboardPage = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <DashboardPage>
                <Dashboard />
              </DashboardPage>
            }
          />
          <Route
            path="/employees"
            element={
              <DashboardPage>
                <Employees />
              </DashboardPage>
            }
          />
          <Route
            path="/students"
            element={
              <DashboardPage>
                <Students />
              </DashboardPage>
            }
          />
          <Route
            path="/classes"
            element={
              <DashboardPage>
                <Classes />
              </DashboardPage>
            }
          />
          <Route
            path="/sections"
            element={
              <DashboardPage>
                <Sections />
              </DashboardPage>
            }
          />
          <Route
            path="/subjects"
            element={
              <DashboardPage>
                <Subjects />
              </DashboardPage>
            }
          />
          <Route
            path="/holidays"
            element={
              <DashboardPage>
                <Holidays />
              </DashboardPage>
            }
          />
          <Route
            path="/attendance-report"
            element={
              <DashboardPage>
                <AttendanceReport />
              </DashboardPage>
            }
          />
          <Route
            path="/fees-structure"
            element={
              <DashboardPage>
                <FeesStructure />
              </DashboardPage>
            }
          />
          <Route
            path="/settings/school-profile"
            element={
              <DashboardPage>
                <SchoolProfile />
              </DashboardPage>
            }
          />
          <Route
            path="/sections/:sectionId/teachers"
            element={
              <DashboardPage>
                <SectionTeachers />
              </DashboardPage>
            }
          />
          <Route
            path="/sections/:sectionId/students"
            element={
              <DashboardPage>
                <SectionStudents />
              </DashboardPage>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
