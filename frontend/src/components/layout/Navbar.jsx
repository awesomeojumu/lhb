import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AvatarMenu from "@layout/AvatarMenu";

const Navbar = ({ onMenuToggle }) => {
  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          LHB Dashboard
        </Typography>
        <Box>
          <AvatarMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
