import React from "react";
import { Skeleton, Stack } from "@mui/material";

const SkeletonLoader = ({ rows = 3, height = 40 }) => {
  return (
    <Stack spacing={2}>
      {Array.from(new Array(rows)).map((_, index) => (
        <Skeleton key={index} variant="rectangular" height={height} />
      ))}
    </Stack>
  );
};

export default SkeletonLoader;
