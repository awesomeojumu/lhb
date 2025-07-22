import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper, Button, useMediaQuery } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/feedback/ToastProvider";
import Spinner from "@/components/feedback/Spinner";
import StatCard from "@/components/data/StatCard";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import AnalyticsTable from "@/components/analytics/AnalyticsTable";
import KPIProgessChart from "@/components/analytics/KPIProgessChart";
import { getAllKPIs } from "@/services/kpiService";
import { listUsers } from "@/services/userService";
import routes from "@/config/routesConfig";

const ManagementDashboard = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState([]);
    const [users, setUsers] = useState([]);

    const isCommander = user?.role === "commander";
    const isCommando = user?.role === "commando";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allKpis, allUsers] = await Promise.all([getAllKPIs(), listUsers()]);
                setKpis(allKpis);

                if (isCommander) {
                    setUsers(allUsers);
                } else if (isCommando) {
                    setUsers(allUsers.filter((u) => u.battalion === user?.battalion));
                }
            } catch (error) {
                showToast("Failed to load management dashboard data", "error");
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
        notStarted: kpis.filter((k) => !k.status || k.status === "Not Started").length,
    };

    // ✅ Battalion Counts
    const battalionCounts = users.reduce(
        (acc, u) => {
            acc[u.battalion] = (acc[u.battalion] || 0) + 1;
            return acc;
        },
        { Alpha: 0, Bravo: 0, Charlie: 0, Delta: 0 }
    );

    // ✅ Click Handlers
    const handleKpiClick = (statusKey) => {
        navigate(`/management/kpi-management?status=${statusKey}`);
    };

    const handleBattalionClick = (battalionName) => {
        navigate(`/dashboard/battalion?name=${battalionName}`);
    };

    const handleGoToUserManagement = () => {
        navigate(routes.userManagement || "/admin/user-management");
    };

    return (
        <Box sx={{ p: 2, maxWidth: 1400, mx: "auto" }}>
            {/* ✅ Back Button + Header */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    mb: 3,
                    gap: 2,
                }}
            >
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        sx={{ mb: 1 }}
                        onClick={() => navigate(-1)} // ✅ Go to previous page
                    >
                        Back
                    </Button>
                    <Typography variant="h4" fontWeight="bold">
                        Management Dashboard
                    </Typography>
                </Box>
            </Box>

            {/* ✅ KPI Status Summary */}
            <Typography variant="h6" gutterBottom>
                KPI Summary
            </Typography>
            <Grid container spacing={2} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Completed KPIs"
                        value={kpiStatusCounts.completed}
                        onClick={() => handleKpiClick("completed")}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="In Progress KPIs"
                        value={kpiStatusCounts.inProgress}
                        onClick={() => handleKpiClick("inProgress")}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Not Started KPIs"
                        value={kpiStatusCounts.notStarted}
                        onClick={() => handleKpiClick("notStarted")}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total KPIs"
                        value={kpis.length}
                        onClick={() => navigate("/management/kpi-management")}
                    />
                </Grid>
            </Grid>

            {/* ✅ Charts Section */}
            <Grid container spacing={2} mb={4}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, width: "100%", height: "100%" }}>
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
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, width: "100%", height: "100%" }}>
                        <Typography variant="h6" gutterBottom>
                            Battalion Members
                        </Typography>
                        <AnalyticsSummary
                            data={battalionCounts}
                            onCardClick={(item) => handleBattalionClick(item.title)}
                        />
                    </Paper>
                </Grid>
            </Grid>

            {/* ✅ Recent KPI Updates */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Recent KPI Updates
                </Typography>
                <Box sx={{ overflowX: "auto" }}>
                    <AnalyticsTable
                        rows={kpis.slice(0, 10)}
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
                </Box>
            </Paper>
        </Box>
    );
};

export default ManagementDashboard;
