import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, CircularProgress } from "@mui/material";
import StatCard from "@components/data/statCard";
import { useAuth } from "@/context/AuthContext";
import { roles } from "@/config/roles"; // ✅ from roles.js

const DashboardHome = () => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || "globalSoldier";

  // ✅ Local state (replace with API later)
  const [kpiProgress, setKpiProgress] = useState(0);
  const [roleCounts, setRoleCounts] = useState({});
  const [battalionCounts, setBattalionCounts] = useState({});
  const [kpiStatus, setKpiStatus] = useState({ completed: 0, inProgress: 0, notStarted: 0 });

  useEffect(() => {
    // ✅ Mock data (replace with API calls)
    setKpiProgress(65);
    setRoleCounts({ globalSoldier: 320, specialForce: 45, battalionLeaders: 24, commando: 12 });
    setBattalionCounts({ Alpha: 120, Bravo: 90, Charlie: 100, Delta: 67 });
    setKpiStatus({ completed: 560, inProgress: 78, notStarted: 42 });
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      {/* ✅ Personal KPI Progress (Everyone) */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          My KPI Progress
        </Typography>
        <Box sx={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
          <CircularProgress variant="determinate" value={kpiProgress} size={120} />
          <Typography variant="h6" sx={{ mt: 1 }}>{kpiProgress}% Completed</Typography>
        </Box>
      </Box>

      {/* ✅ Role Analytics (Commando & Commander) */}
      {["commando", "commander"].includes(role) && (
        <>
          <Typography variant="h6" gutterBottom>Role Counts</Typography>
          <Grid container spacing={4} sx={{ mb: 4}}>
            <Grid item xs={12} sm={4}>
              <StatCard title="Global Soldiers" value={roleCounts.globalSoldier} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard title="Special Forces" value={roleCounts.specialForce} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard title="Battalion Leaders" value={roleCounts.battalionLeaders} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard title="Commandos" value={roleCounts.commando} />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>Battalion Counts</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {Object.entries(battalionCounts).map(([name, count]) => (
              <Grid item xs={12} sm={4} key={name}>
                <StatCard title={name} value={count} />
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" gutterBottom>KPI Status</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <StatCard title="Completed" value={kpiStatus.completed} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard title="In Progress" value={kpiStatus.inProgress} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard title="Not Started" value={kpiStatus.notStarted} />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default DashboardHome;
