import React from "react";
import { Box, Typography } from "@mui/material";

const RoleManagement = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Role Management
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Manage user roles. Commandos can manage roles within their battalion but cannot change a Commander's role.
      </Typography>
      {/* ✅ Role update table and controls will be added here */}
    </Box>
  );
};

export default RoleManagement;
