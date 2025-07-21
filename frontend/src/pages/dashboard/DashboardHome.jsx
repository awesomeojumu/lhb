import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatCard from "@components/data/statCard";
import { useAuth } from "@/context/AuthContext";
import routes from "@/config/routesConfig";

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role?.toLowerCase() || "globalsoldier";

  // ✅ Local state (mock data for now)
  const [kpiProgress, setKpiProgress] = useState(0);
  const [roleCounts, setRoleCounts] = useState({});
  const [battalionCounts, setBattalionCounts] = useState({});
  const [kpiStatus, setKpiStatus] = useState({
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  });

  useEffect(() => {
    // ✅ Replace with API calls later
    setKpiProgress(65);
    setRoleCounts({
      globalsoldier: 320,
      specialforce: 45,
      commando: 12,
      commander: 3,
    });
    setBattalionCounts({ Alpha: 120, Bravo: 90, Charlie: 100, Delta: 67 });
    setKpiStatus({ completed: 560, inProgress: 78, notStarted: 42 });
  }, []);

  const handleCardClick = (filterType, value) => {
    navigate(`${routes.analytics}?filter=${filterType}&value=${value}`);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* ✅ Personal KPI Progress (Everyone) */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          My KPI Progress
        </Typography>
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress variant="determinate" value={kpiProgress} size={120} />
          <Typography variant="h6" sx={{ mt: 1 }}>
            {kpiProgress}% Completed
          </Typography>
        </Box>
      </Box>

      {/* ✅ Analytics (Commando & Commander Only) */}
      {["commando", "commander"].includes(role) && (
        <>
          {/* ✅ Role Counts */}
          <Typography variant="h6" gutterBottom>
            Role Counts
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Global Soldiers"
                value={roleCounts.globalsoldier}
                onClick={() => handleCardClick("role", "globalsoldier")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Special Forces"
                value={roleCounts.specialforce}
                onClick={() => handleCardClick("role", "specialforce")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Commandos"
                value={roleCounts.commando}
                onClick={() => handleCardClick("role", "commando")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Commanders"
                value={roleCounts.commander}
                onClick={() => handleCardClick("role", "commander")}
              />
            </Grid>
          </Grid>

          {/* ✅ Battalion Counts */}
          <Typography variant="h6" gutterBottom>
            Battalion Counts
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {Object.entries(battalionCounts).map(([name, count]) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={name}>
                <StatCard
                  title={name}
                  value={count}
                  onClick={() => handleCardClick("battalion", name)}
                />
              </Grid>
            ))}
          </Grid>

          {/* ✅ KPI Status */}
          <Typography variant="h6" gutterBottom>
            KPI Status
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                title="Completed"
                value={kpiStatus.completed}
                onClick={() => handleCardClick("kpiStatus", "completed")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                title="In Progress"
                value={kpiStatus.inProgress}
                onClick={() => handleCardClick("kpiStatus", "inProgress")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                title="Not Started"
                value={kpiStatus.notStarted}
                onClick={() => handleCardClick("kpiStatus", "notStarted")}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default DashboardHome;
