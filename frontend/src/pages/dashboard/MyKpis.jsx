import React from "react";
import { Box, Typography } from "@mui/material";

const MyKpis = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        My KPIs
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Track your assigned KPIs and mark them as completed.
      </Typography>
    </Box>
  );
};

export default MyKpis;
