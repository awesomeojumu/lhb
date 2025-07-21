import React from "react";
import { Grid } from "@mui/material";
import StatCard from "@/components/data/StatCard";

const AnalyticsSummary = ({ data = [], onCardClick }) => {
  return (
    <Grid container spacing={2}>
      {data.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard
            title={item.title}
            value={item.value}
            subtext={item.subtext}
            onClick={() => onCardClick?.(item)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default AnalyticsSummary;
