import React from "react";
import { Box, Typography } from "@mui/material";

const BattalionManagement = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Battalion Management
      </Typography>
      <Typography variant="body2" color="text.secondary">
        View and manage battalion assignments. Commandos can manage only within their battalion; Commanders can manage all.
      </Typography>
      {/* ✅ Table and actions will be added here */}
    </Box>
  );
};

export default BattalionManagement;
