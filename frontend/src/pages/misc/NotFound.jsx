import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import routes from "@/config/routesConfig";


const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Typography variant="h2" fontWeight="bold">
        404
      </Typography>
      <Typography variant="h5" color="text.secondary">
        Oops! The page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => navigate(routes.dashboard)}
      >
        Go Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
