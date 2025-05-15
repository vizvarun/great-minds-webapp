import { useState } from "react";
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
import { useNavigate, useLocation, Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EventIcon from "@mui/icons-material/Event";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PaymentsIcon from "@mui/icons-material/Payments";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

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
    "/settings": false,
  });

  const handleClick = (path: string) => {
    if (sidebarItems.find((item) => item.path === path)?.children) {
      setOpen((prev) => ({ ...prev, [path]: !prev[path] }));
    } else {
      navigate(path);
    }
  };

  const isSelected = (path: string) => {
    return location.pathname === path;
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
          mt: "64px", // Height of AppBar
          height: "calc(100% - 64px)",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <List sx={{ pt: 1 }}>
        {sidebarItems.map((item) => (
          <Box key={item.path}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname.startsWith(item.path)}
                sx={{
                  mb: 0.5,
                  py: 1,
                  borderRadius: 1,
                  "&.Mui-selected": {
                    backgroundColor: "rgba(25, 118, 210, 0.08)", // Very subtle background
                    borderLeft: "3px solid", // Thin left border indicator
                    borderColor: "primary.main",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.12)", // Slightly stronger on hover
                    },
                  },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)", // Very subtle hover
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname.startsWith(item.path)
                      ? "primary.main"
                      : "inherit",
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
                      sx={{ pl: 4 }}
                      selected={isSelected(child.path)}
                      onClick={() => navigate(child.path)}
                    >
                      <ListItemIcon
                        sx={{
                          color: isSelected(child.path)
                            ? "primary.main"
                            : "inherit",
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
