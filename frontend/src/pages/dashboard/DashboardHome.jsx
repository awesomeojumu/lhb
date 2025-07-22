import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatCard from "@components/data/StatCard";
import KPIProgessChart from "@/components/analytics/KPIProgessChart";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/feedback/ToastProvider";
import { getMyKPIs } from "@/services/kpiService";
import { listUsers } from "@/services/userService";
import routes from "@/config/routesConfig";

const DashboardHome = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [myKpiStatus, setMyKpiStatus] = useState({
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  });

  const [battalionCount, setBattalionCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ✅ Fetch only my KPIs
        const myKpis = await getMyKPIs();

        setMyKpiStatus({
          completed: myKpis.filter((k) => k.status === "Completed").length,
          inProgress: myKpis.filter((k) => k.status === "In Progress").length,
          notStarted: myKpis.filter((k) => !k.status || k.status === "Not Started").length,
        });

        // ✅ Fetch all users to calculate my battalion members
        const users = await listUsers();
        const myBattalionMembers = users.filter(
          (u) => u.battalion === user?.battalion
        ).length;
        setBattalionCount(myBattalionMembers);
      } catch (error) {
        showToast("Failed to load personalized dashboard data", "error");
      }
    };

    fetchDashboardData();
  }, [showToast, user]);

  const handleGoToMyKPIs = () => {
    navigate(routes.myKpis || "/dashboard/my-kpis");
  };

  const handleGoToMyBattalion = () => {
    navigate(`/dashboard/battalion?name=${user?.battalion}`);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", my: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome, {user?.firstName || "User"} 👋
      </Typography>

      {/* ✅ My KPI Progress */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          My KPI Progress
        </Typography>
        <KPIProgessChart
          data={[
            { name: "Completed", value: myKpiStatus.completed },
            { name: "In Progress", value: myKpiStatus.inProgress },
            { name: "Not Started", value: myKpiStatus.notStarted },
          ]}
        />
        <Typography
          variant="body2"
          color="primary"
          sx={{ mt: 1, cursor: "pointer", textDecoration: "underline" }}
          onClick={handleGoToMyKPIs}
        >
          View My KPIs →
        </Typography>
      </Paper>

      {/* ✅ My Battalion & My Rank */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={`${user?.battalion} Battalion`}
            value={battalionCount}
            subtext="Total Members"
            onClick={handleGoToMyBattalion}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="My Rank"
            value={user?.role?.toUpperCase() || "GLOBAL SOLDIER"}
            subtext="Current Role"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
