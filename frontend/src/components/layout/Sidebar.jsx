import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // ✅ assuming you get user.role from here
import sidebarConfig from "@/config/sidebarConfig";

export const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onMenuToggle }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || "globalSoldier"; // ✅ fallback role

  const items = sidebarConfig[role] || sidebarConfig.globalSoldier;

  const drawer = (
    <Box>
      <Toolbar /> {/* ✅ ensures alignment below AppBar */}
      <List>
        {items.map((item, index) =>
          item.divider ? (
            <Divider key={`divider-${index}`} sx={{ my: 1 }} />
          ) : (
            <ListItem key={item.label} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="sidebar navigation"
    >
      {/* ✅ Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMenuToggle}
        ModalProps={{ keepMounted: true }} // Better mobile performance
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* ✅ Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
