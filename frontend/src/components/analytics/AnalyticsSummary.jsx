import React from "react";
import { Grid } from "@mui/material";
import StatCard from "@/components/data/StatCard";
import { roleOptions, battalions } from "@/config/roles";

// ✅ Helpers to format titles properly
const getRoleLabel = (value) =>
  roleOptions.find((opt) => opt.value === value)?.label || value;

const getBattalionLabel = (value) =>
  battalions.find((opt) => opt.value === value)?.label || value;

// ✅ Normalize data (accept object or array)
const normalizeData = (data) => {
  if (Array.isArray(data)) return data;

  return Object.entries(data).map(([key, value]) => ({
    title:
      getRoleLabel(key) !== key
        ? getRoleLabel(key)
        : getBattalionLabel(key) !== key
        ? getBattalionLabel(key)
        : key,
    value,
    subtext: "Total Count",
  }));
};

const AnalyticsSummary = ({ data = [], onCardClick }) => {
  const normalized = normalizeData(data);

  return (
    <Grid container spacing={2}>
      {normalized.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard
            title={item.title}
            value={item.value}
            subtext={item.subtext || ""}
            onClick={() => onCardClick?.(item)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default AnalyticsSummary;
