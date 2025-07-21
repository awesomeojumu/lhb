import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatCard from "@components/data/StatCard";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/feedback/ToastProvider";
import { getMyKPIs, getAllKPIs } from "@/services/kpiService";
import { listUsers } from "@/services/userService";
import routes from "@/config/routesConfig";

const DashboardHome = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const role = user?.role?.toLowerCase() || "globalsoldier";

  const [kpiProgress, setKpiProgress] = useState(0);
  const [roleCounts, setRoleCounts] = useState({});
  const [battalionCounts, setBattalionCounts] = useState({});
  const [kpiStatus, setKpiStatus] = useState({
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [myKpis, allKpis, users] = await Promise.all([
          getMyKPIs(),
          getAllKPIs(),
          listUsers(),
        ]);

        // ✅ My KPI Progress (%)
        const completed = myKpis.filter((k) => k.status === "Completed").length;
        const progress = Math.round((completed / (myKpis.length || 1)) * 100);
        setKpiProgress(progress);

        // ✅ KPI Status Counts
        setKpiStatus({
          completed: allKpis.filter((k) => k.status === "Completed").length,
          inProgress: allKpis.filter((k) => k.status === "In Progress").length,
          notStarted: allKpis.filter((k) => !k.status || k.status === "Not Started").length,
        });

        // ✅ Role Counts
        const rolesSummary = users.reduce(
          (acc, u) => {
            acc[u.role] = (acc[u.role] || 0) + 1;
            return acc;
          },
          { globalsoldier: 0, specialforce: 0, commando: 0, commander: 0 }
        );
        setRoleCounts(rolesSummary);

        // ✅ Battalion Counts
        const battalionsSummary = users.reduce(
          (acc, u) => {
            acc[u.battalion] = (acc[u.battalion] || 0) + 1;
            return acc;
          },
          { Alpha: 0, Bravo: 0, Charlie: 0, Delta: 0 }
        );
        setBattalionCounts(battalionsSummary);
      } catch (error) {
        showToast("Failed to load dashboard data", "error");
      }
    };

    fetchDashboardData();
  }, [showToast]);

  const handleCardClick = (filterType, value) => {
    navigate(`${routes.analytics}?filter=${filterType}&value=${value}`);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", my: 4 }}>
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
