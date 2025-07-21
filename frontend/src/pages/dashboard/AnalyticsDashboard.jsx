import React from "react";
import { Box, Typography } from "@mui/material";

const AnalyticsDashboard = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Deep analytics for KPIs, battalion stats, and user activity. Commandos see their battalion; Commanders see everything.
      </Typography>
      {/* ✅ Charts and tables will be added here */}
    </Box>
  );
};

export default AnalyticsDashboard;
