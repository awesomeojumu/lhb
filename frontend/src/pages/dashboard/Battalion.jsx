import React from "react";
import { Box, Typography } from "@mui/material";

const Battalion = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        My Battalion
      </Typography>
      <Typography variant="body2" color="text.secondary">
        View members of your battalion here. (Data table integration coming soon)
      </Typography>
    </Box>
  );
};

export default Battalion;
