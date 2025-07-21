import React from "react";
import { Box, Typography } from "@mui/material";

const Ranks = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Ranks
      </Typography>
      <Typography variant="body2" color="text.secondary">
        View users grouped by rank. (Table integration coming soon)
      </Typography>
    </Box>
  );
};

export default Ranks;
