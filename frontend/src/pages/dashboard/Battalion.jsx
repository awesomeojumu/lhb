import React, { useEffect, useState, useMemo } from "react";
import {
    Box,
    Typography,
    Chip,
    Paper,
    Avatar,
    Stack,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "@/components/feedback/Spinner";
import StatCard from "@/components/data/StatCard";
import TableToolbar from "@/components/data/TableToolbar";
import KPIProgessChart from "@/components/analytics/KPIProgessChart";
import { useToast } from "@/components/feedback/ToastProvider";
import { listUsers } from "@/services/userService";
import { getAllKPIs } from "@/services/kpiService";
import { roleOptions, battalions } from "@/config/roles";

const Battalion = () => {
    const [users, setUsers] = useState([]);
    const [kpis, setKpis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const battalionFilter = queryParams.get("name");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allUsers, allKpis] = await Promise.all([listUsers(), getAllKPIs()]);
                const filteredUsers = battalionFilter
                    ? allUsers.filter((u) => u.battalion === battalionFilter)
                    : allUsers;

                const userIds = filteredUsers.map((u) => u._id);
                const filteredKpis = allKpis.filter((k) =>
                    userIds.includes(k.assignedTo?._id || k.assignedTo)
                );

                setUsers(filteredUsers);
                setKpis(filteredKpis);
            } catch (error) {
                showToast(error.message, "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showToast, battalionFilter]);

    const getRoleLabel = (value) => roleOptions.find((opt) => opt.value === value)?.label || value;

    const getRoleColor = (value) => {
        switch (value) {
            case "commander":
                return "error";
            case "commando":
                return "warning";
            case "specialForce":
                return "info";
            default:
                return "success";
        }
    };

    const getBattalionLabel = (value) =>
        battalions.find((opt) => opt.value === value)?.label || value;

    const roleCounts = useMemo(
        () =>
            users.reduce(
                (acc, u) => {
                    acc[u.role] = (acc[u.role] || 0) + 1;
                    return acc;
                },
                { commander: 0, commando: 0, specialForce: 0, globalSoldier: 0 }
            ),
        [users]
    );

    const kpiStatusCounts = useMemo(
        () => ({
            completed: kpis.filter((k) => k.status === "Completed").length,
            inProgress: kpis.filter((k) => k.status === "In Progress").length,
            notStarted: kpis.filter((k) => !k.status || k.status === "Not Started").length,
        }),
        [kpis]
    );

    const filteredUsers = useMemo(() => {
        if (!searchText.trim()) return users;
        return users.filter((u) =>
            [
                `${u.firstName} ${u.lastName}`,
                u.email,
                u.phone,
                getRoleLabel(u.role),
                getBattalionLabel(u.battalion),
            ]
                .join(" ")
                .toLowerCase()
                .includes(searchText.toLowerCase())
        );
    }, [searchText, users]);

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setSelectedUser(null);
        setDetailsOpen(false);
    };

    if (loading) return <Spinner />;

    return (
        <Box sx={{ p: 2, maxWidth: 1400, mx: "auto" }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    mb: 4,
                    gap: 2,
                }}
            >
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        sx={{ mb: 1 }}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                    <Typography variant="h4" fontWeight="bold">
                        {battalionFilter
                            ? `${getBattalionLabel(battalionFilter)} Battalion Overview`
                            : "All Battalions Overview"}
                    </Typography>
                </Box>
            </Box>

            {/* Role Summary */}
            <Typography variant="h5" gutterBottom>
                Role Summary
            </Typography>
            <Grid container spacing={2} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Commanders" value={roleCounts.commander} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Commandos" value={roleCounts.commando} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Special Forces" value={roleCounts.specialForce} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Global Soldiers" value={roleCounts.globalSoldier} />
                </Grid>
            </Grid>

            {/* KPI Stats */}
            <Grid container spacing={2} mb={4}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, borderRadius: 2, height: "100%" }}>
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
                    <Paper
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            height: "100%",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Total KPIs for this Battalion
                        </Typography>
                        <Typography variant="h3" fontWeight="bold">
                            {kpis.length}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Battalion Members */}
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <TableToolbar title={`Battalion Members (${filteredUsers.length})`} />

                {/* Search */}
                <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
                    <TextField
                        size="small"
                        placeholder="Search by name, email, role..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        sx={{ maxWidth: 300, width: "100%" }}
                    />
                </Box>

                {/* Member Cards */}
                {filteredUsers.map((user, index) => (
                    <Paper
                        key={user._id || index}
                        elevation={1}
                        sx={{
                            p: 2,
                            mb: 2,
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", sm: "center" },
                            gap: 2,
                            borderRadius: 2,
                            transition: "0.3s",
                            "&:hover": { boxShadow: 4 },
                        }}
                    >
                        {/* Left */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar
                                src={user.profilePicture || ""}
                                sx={{ width: 50, height: 50, fontSize: 20 }}
                            >
                                {user.firstName[0]}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {user.firstName} {user.lastName}
                                </Typography>
                                <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
                                    <Chip label={getBattalionLabel(user.battalion)} size="small" />
                                    <Chip
                                        label={getRoleLabel(user.role)}
                                        color={getRoleColor(user.role)}
                                        size="small"
                                    />
                                </Stack>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5, display: "block" }}
                                >
                                    📞 {user.phone || "No phone"}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ display: "block" }}
                                >
                                    ✉ {user.email}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Right */}
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewDetails(user)}
                            sx={{
                                minWidth: 100,
                                textTransform: "capitalize",
                                "&:hover": { backgroundColor: "primary.light" },
                            }}
                        >
                            View Details
                        </Button>
                    </Paper>
                ))}
            </Paper>

            {/* View Details Modal */}
            <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight="bold">
                        {`${selectedUser?.firstName} ${selectedUser?.lastName}`}
                    </Typography>
                    {selectedUser?.lhbCode && (
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            color="primary"
                            sx={{ mt: 0.5 }}
                        >
                            {selectedUser.lhbCode}
                        </Typography>
                    )}
                </DialogTitle>

                <DialogContent dividers>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Avatar
                            src={selectedUser?.profilePicture || ""}
                            alt={`${selectedUser?.firstName} ${selectedUser?.lastName}`}
                            sx={{ width: 100, height: 100, mb: 1 }}
                        >
                            {selectedUser?.firstName?.[0]}
                        </Avatar>

                        <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
                            <Chip
                                label={getRoleLabel(selectedUser?.role)}
                                color={getRoleColor(selectedUser?.role)}
                                size="small"
                            />
                            <Chip
                                label={getBattalionLabel(selectedUser?.battalion)}
                                color="default"
                                size="small"
                            />
                        </Stack>
                    </Box>

                    <Stack spacing={1} sx={{ textAlign: "center" }}>
                        <Typography variant="body1">
                            <strong>Gender:</strong>{" "}
                            {selectedUser?.sex
                                ? selectedUser.sex.charAt(0).toUpperCase() +
                                  selectedUser.sex.slice(1).toLowerCase()
                                : "Not Specified"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Phone:</strong> {selectedUser?.phone || "No phone"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Email:</strong> {selectedUser?.email}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Relationship Status:</strong>{" "}
                            {selectedUser?.relationshipStatus || "Not Specified"}
                        </Typography>
                        {selectedUser?.relationshipStatus === "Married" &&
                            selectedUser?.weddingAnniversary && (
                                <Typography variant="body1">
                                    <strong>Wedding Anniversary:</strong>{" "}
                                    {new Date(selectedUser.weddingAnniversary).toLocaleDateString()}
                                </Typography>
                            )}
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleCloseDetails}
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Battalion;
