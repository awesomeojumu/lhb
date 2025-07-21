import React, { useState } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import routes from "@/config/routesConfig";

const AvatarMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // ✅ Helper to convert to Proper Case
  const toProperCase = (str = "") =>
    str
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {user?.firstName?.[0] || "U"}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* ✅ User Info Section */}
        <Box sx={{ px: 2, py: 1.5 }}>
          {/* Name - Proper Case */}
          <Typography variant="subtitle1" fontWeight="bold">
            {`${toProperCase(user?.firstName || "Unknown")} ${toProperCase(
              user?.lastName || ""
            )}`}
          </Typography>

          {/* Role - Bold + Uppercase */}
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{ textTransform: "uppercase" }}
            color="text.secondary"
          >
            {user?.role || "No Role"}
          </Typography>

          {/* Battalion - Proper Case */}
          <Typography variant="body2" color="text.secondary">
            {toProperCase(user?.battalion || "No Battalion")}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={() => navigate(routes.profile)}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate("/dashboard/settings")}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <Divider />
        <MenuItem
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default AvatarMenu;
