import React from "react";
import { Box, Typography } from "@mui/material";

const KPIManagement = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        KPI Management
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Create, edit, delete, and assign KPIs. Commandos cannot edit or delete Commander's KPIs.
      </Typography>
      {/* ✅ KPI table and create form will be added here */}
    </Box>
  );
};

export default KPIManagement;
