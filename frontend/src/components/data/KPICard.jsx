import React from "react";
import { Card, CardContent, Typography, LinearProgress, Stack } from "@mui/material";

const KPICard = ({ title, progress = 0, status = "Pending", deadline }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <Stack spacing={1} mt={1}>
          <Typography variant="body2">Status: {status}</Typography>
          <Typography variant="body2">Deadline: {new Date(deadline).toDateString()}</Typography>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption">{progress}% complete</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default KPICard;
