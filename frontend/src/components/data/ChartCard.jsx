import React from "react";
import { Card, CardContent, CardHeader } from "@mui/material";

const ChartCard = ({ title, children }) => {
  return (
    <Card sx={{ minHeight: 250 }}>
      <CardHeader title={title} />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ChartCard;
