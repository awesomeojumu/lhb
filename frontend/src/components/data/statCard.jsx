import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatCard = ({ title, value, subtext, onClick }) => {
  return (
    <Card
      sx={{
        minHeight: 120,
        p: 2,
        textAlign: "center",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? { boxShadow: 6, transform: "scale(1.02)" } : {},
        transition: "all 0.2s ease-in-out",
      }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="subtitle1" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
          {value}
        </Typography>
        {subtext && (
          <Typography variant="caption" color="text.secondary">
            {subtext}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
