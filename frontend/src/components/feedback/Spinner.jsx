import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Spinner = ({ size = 40 }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default Spinner;
