import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import TaskIcon from "@mui/icons-material/Task";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import routes from "@/config/routesConfig";

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onMenuToggle }) => {
  const navigate = useNavigate();

  const links = [
    { label: "Dashboard", icon: <DashboardIcon />, path: routes.dashboard },
    { label: "Users", icon: <PeopleIcon />, path: routes.users },
    { label: "KPIs", icon: <TaskIcon />, path: routes.kpis },
    { label: "Settings", icon: <SettingsIcon />, path: "/dashboard/settings" },
  ];

  const drawerContent = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {links.map((link) => (
          <ListItemButton
            key={link.path}
            onClick={() => {
              navigate(link.path);
              onMenuToggle?.(); // close mobile drawer
            }}
          >
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMenuToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
export { drawerWidth };
