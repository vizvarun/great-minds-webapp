import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ClassIcon from "@mui/icons-material/Class";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PaymentsIcon from "@mui/icons-material/Payments";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";

import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 250;

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    title: "Employees",
    path: "/employees",
    icon: <PeopleIcon />,
  },
  {
    title: "Students",
    path: "/students",
    icon: <SchoolIcon />,
  },
  {
    title: "Classes",
    path: "/classes",
    icon: <ClassIcon />,
  },
  {
    title: "Sections",
    path: "/sections",
    icon: <GroupWorkIcon />,
  },
  {
    title: "Subjects",
    path: "/subjects",
    icon: <MenuBookIcon />,
  },
  {
    title: "Holidays",
    path: "/holidays",
    icon: <EventIcon />,
  },
  {
    title: "Attendance Report",
    path: "/attendance-report",
    icon: <AssessmentIcon />,
  },
  {
    title: "Fees Structure",
    path: "/fees-structure",
    icon: <PaymentsIcon />,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <SettingsIcon />,
    children: [
      {
        title: "School Profile",
        path: "/settings/school-profile",
        icon: <AccountBalanceIcon />,
      },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState<Record<string, boolean>>({
    "/settings": location.pathname.startsWith("/settings"),
  });

  const isSelected = (path: string) => {
    return location.pathname === path;
  };

  const handleMenuClick = (path: string) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [path]: !prevOpen[path],
    }));
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          mt: "64px",
          height: "calc(100% - 64px)",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          position: "fixed",
          transition: "none",
          overflowY: "auto",
          overflowX: "hidden",
          borderRadius: 0,
        },
      }}
    >
      <List sx={{ pt: 1 }}>
        {sidebarItems.map((item) => (
          <Box key={item.path}>
            <ListItem disablePadding>
              <ListItemButton
                component={item.children ? "div" : Link}
                to={item.children ? undefined : item.path}
                onClick={
                  item.children ? () => handleMenuClick(item.path) : undefined
                }
                selected={location.pathname.startsWith(item.path)}
                sx={{
                  mb: 0.5,
                  py: 1,
                  borderRadius: 0,
                  transition: "none",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                    "& .MuiListItemIcon-root": {
                      color: location.pathname.startsWith(item.path)
                        ? "primary.main"
                        : "#121212",
                    },
                    "& .MuiTypography-root": {
                      color: location.pathname.startsWith(item.path)
                        ? "primary.main"
                        : "#121212",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname.startsWith(item.path)
                      ? "primary.main"
                      : "inherit",
                    transition: "none",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      color={
                        location.pathname.startsWith(item.path)
                          ? "primary"
                          : "textPrimary"
                      }
                      sx={{
                        fontWeight: location.pathname.startsWith(item.path)
                          ? "bold"
                          : "normal",
                      }}
                    >
                      {item.title}
                    </Typography>
                  }
                />
                {item.children &&
                  (open[item.path] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>

            {item.children && (
              <Collapse in={open[item.path]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.path}
                      sx={{
                        pl: 4,
                        borderRadius: 0,
                        transition: "none",
                      }}
                      selected={isSelected(child.path)}
                      onClick={() => navigate(child.path)}
                    >
                      <ListItemIcon
                        sx={{
                          color: isSelected(child.path)
                            ? "primary.main"
                            : "inherit",
                          transition: "none",
                          "& .MuiSvgIcon-root": {
                            transition: "none",
                            "&:hover": {
                              color: "inherit",
                            },
                          },
                          "&:hover": {
                            color: isSelected(child.path)
                              ? "primary.main"
                              : "inherit",
                          },
                        }}
                      >
                        {child.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            color={
                              isSelected(child.path) ? "primary" : "textPrimary"
                            }
                            sx={{
                              fontWeight: isSelected(child.path)
                                ? "bold"
                                : "normal",
                            }}
                          >
                            {child.title}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
