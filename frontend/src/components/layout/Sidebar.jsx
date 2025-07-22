import React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import sidebarConfig from "@config/sidebarConfig";
import { useAuth } from "@context/AuthContext";

export const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onMenuToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const role = user?.role || "globalSoldier";
    const menuItems = sidebarConfig[role] || [];

    const drawerContent = (
        <List sx={{ my: 10 }}>
            {menuItems.map((item, index) =>
                item.divider ? (
                    <Divider key={index} sx={{ my: 4 }} />
                ) : (
                    <ListItemButton
                        key={item.label}
                        selected={location.pathname === item.path}
                        onClick={() => navigate(item.path)}
                    >
                        <ListItemIcon>
                            <item.icon />
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                )
            )}
        </List>
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
