import React from "react";
import { Box, Typography } from "@mui/material";

const UserManagement = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        User Management
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Full user management (create, edit, delete). Only accessible to Commanders.
      </Typography>
      {/* ✅ Full CRUD user table and forms will be added here */}
    </Box>
  );
};

export default UserManagement;
