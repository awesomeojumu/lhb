import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/feedback/ToastProvider";
import Spinner from "@/components/feedback/Spinner";
import StatCard from "@/components/data/StatCard";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import AnalyticsTable from "@/components/analytics/AnalyticsTable";
import KPIProgessChart from "@/components/analytics/KPIProgessChart";
import { getAllKPIs, getMyKPIs } from "@/services/kpiService";
import { listUsers } from "@/services/userService";
import { roleOptions, battalions } from "@/config/roles";

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const isCommander = user?.role === "commander";
  const isCommando = user?.role === "commando";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allKpis, allUsers] = await Promise.all([
          getAllKPIs(),
          listUsers(),
        ]);

        setKpis(allKpis);
        setUsers(allUsers);

        // ✅ Role-based filtering
        if (isCommander) {
          setFilteredUsers(allUsers);
        } else if (isCommando) {
          setFilteredUsers(
            allUsers.filter((u) => u.battalion === user?.battalion)
          );
        }
      } catch {
        showToast("Failed to load analytics data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast, user, isCommander, isCommando]);

  if (loading) return <Spinner />;

  // ✅ KPI Status Counts
  const kpiStatusCounts = {
    completed: kpis.filter((k) => k.status === "Completed").length,
    inProgress: kpis.filter((k) => k.status === "In Progress").length,
    notStarted: kpis.filter((k) => !k.status || k.status === "Not Started")
      .length,
  };

  // ✅ Role Counts
  const roleCounts = filteredUsers.reduce(
    (acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    },
    { commander: 0, commando: 0, specialForce: 0, globalSoldier: 0 }
  );

  // ✅ Battalion Counts
  const battalionCounts = filteredUsers.reduce(
    (acc, u) => {
      acc[u.battalion] = (acc[u.battalion] || 0) + 1;
      return acc;
    },
    { Alpha: 0, Bravo: 0, Charlie: 0, Delta: 0 }
  );

  return (
    <Box sx={{ p: 2, maxWidth: 1400, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Analytics Dashboard
      </Typography>

      {/* ✅ Summary StatCards */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Completed KPIs" value={kpiStatusCounts.completed} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="In Progress KPIs" value={kpiStatusCounts.inProgress} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Not Started KPIs" value={kpiStatusCounts.notStarted} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Users"
            value={filteredUsers.length}
            subtext={isCommander ? "All System Users" : `${user.battalion} Battalion`}
          />
        </Grid>
      </Grid>

      {/* ✅ Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              KPI Status Distribution
            </Typography>
            <KPIProgessChart
              data={[
                { name: "Completed", value: kpiStatusCounts.completed },
                { name: "In Progress", value: kpiStatusCounts.inProgress },
                { name: "Not Started", value: kpiStatusCounts.notStarted },
              ]}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Battalion Members
            </Typography>
            <AnalyticsSummary data={battalionCounts} />
          </Paper>
        </Grid>
      </Grid>

      {/* ✅ Recent Activities Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent KPI Updates
        </Typography>
        <AnalyticsTable
          rows={kpis.slice(0, 10)} // last 10 KPIs
          columns={[
            { field: "title", headerName: "Title" },
            { field: "status", headerName: "Status" },
            {
              field: "deadline",
              headerName: "Deadline",
              renderCell: (value) =>
                value ? new Date(value).toLocaleDateString() : "-",
            },
          ]}
        />
      </Paper>
    </Box>
  );
};

export default AnalyticsDashboard;
