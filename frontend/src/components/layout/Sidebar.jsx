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
import { useNavigate } from "react-router-dom";
import sidebarConfig from "@/config/sidebarConfig";
import { useAuth } from "@/context/AuthContext";

const drawerWidth = 350;

const Sidebar = ({ mobileOpen, onMenuToggle }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = (user?.role || "globalSoldier").toLowerCase();
  const links = sidebarConfig[role] || [];

  const drawerContent = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {links.map((link, index) =>
          link.divider ? (
            <Divider key={`divider-${index}`} sx={{ my: 1 }} />
          ) : (
            <ListItemButton
              key={link.path || `item-${index}`}
              onClick={() => {
                navigate(link.path);
                onMenuToggle?.();
              }}
            >
              <ListItemIcon>
                <link.icon /> {/* ✅ FIXED */}
              </ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          )
        )}
      </List>
    </>
  );

  return (
    <>
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
