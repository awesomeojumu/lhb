import React, { useEffect, useState } from "react";
import {
    Box,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    Paper,
    Button,
    Chip,
    LinearProgress,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import Spinner from "@/components/feedback/Spinner";
import StatCard from "@/components/data/StatCard";
import KPIProgessChart from "@/components/analytics/KPIProgessChart";
import { useToast } from "@/components/feedback/ToastProvider";
import { getAllKPIs, deleteKPI, createKPI } from "@/services/kpiService";
import { useNavigate, useLocation } from "react-router-dom";
import routes from "@/config/routesConfig";
import KPIAssignModal from "@/components/forms/KPIAssignModal";
import { exportToExcel } from "@/utils/exportUtils";

const KPIManagement = () => {
    const [kpis, setKpis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedKPI, setSelectedKPI] = useState(null);
    const [assignModalOpen, setAssignModalOpen] = useState(false);

    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [selectedFields, setSelectedFields] = useState([
        "title",
        "target",
        "progress",
        "status",
        "deadline",
        "createdBy",
    ]);

    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const filterStatus = queryParams.get("status");

    const exportableFields = [
        { key: "title", label: "Title" },
        { key: "description", label: "Description" },
        { key: "target", label: "Target" },
        { key: "actual", label: "Actual" },
        { key: "progress", label: "Progress (%)" },
        { key: "status", label: "Status" },
        { key: "deadline", label: "Deadline" },
        { key: "createdBy", label: "Created By (Rank)" },
    ];

    // ✅ Fetch KPIs
    useEffect(() => {
        const fetchKPIs = async () => {
            try {
                const data = await getAllKPIs();
                const filteredData = filterStatus
                    ? data.filter((k) =>
                          filterStatus === "notStarted"
                              ? !k.status || k.status === "Not Started"
                              : k.status?.toLowerCase() === filterStatus.toLowerCase()
                      )
                    : data;
                setKpis(filteredData);
            } catch (error) {
                showToast(error.message || "Failed to load KPIs", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchKPIs();
    }, [filterStatus, showToast]);

    // ✅ Delete Logic
    const handleDelete = (kpi) => {
        setSelectedKPI(kpi);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteKPI(selectedKPI._id);
            setKpis((prev) => prev.filter((k) => k._id !== selectedKPI._id));
            showToast("KPI deleted successfully", "success");
        } catch (error) {
            showToast(error.message || "Failed to delete KPI", "error");
        } finally {
            setConfirmOpen(false);
        }
    };

    // ✅ Create KPI with Rank (from modal)
    const handleSaveAssign = async (rank) => {
        try {
            await createKPI({ createdByRank: rank });
            showToast("KPI created successfully", "success");
            setAssignModalOpen(false);
        } catch (error) {
            showToast(error.message || "Failed to create KPI", "error");
        }
    };

    if (loading) return <Spinner />;

    // ✅ KPI Status Counts
    const kpiStatusCounts = {
        completed: kpis.filter((k) => k.status === "Completed").length,
        inProgress: kpis.filter((k) => k.status === "In Progress").length,
        notStarted: kpis.filter((k) => !k.status || k.status === "Not Started").length,
    };

    // ✅ Status Chip
    const renderStatusChip = (status) => {
        const normalized = status || "Not Started";
        const color =
            normalized === "Completed"
                ? "success"
                : normalized === "In Progress"
                  ? "warning"
                  : "default";
        return <Chip label={normalized} color={color} size="small" sx={{ fontWeight: "bold" }} />;
    };

    // ✅ Progress Bar
    const renderProgress = (value) => {
        const progressValue = value || 0;
        const color = progressValue >= 80 ? "success" : progressValue >= 40 ? "warning" : "error";
        return (
            <Box sx={{ width: "100%", minWidth: 100 }}>
                <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    color={color}
                    sx={{ height: 6, borderRadius: 3, mb: 0.5 }}
                />
                <Typography variant="caption">{progressValue}%</Typography>
            </Box>
        );
    };

    // ✅ Handle field selection toggle
    const toggleField = (field) => {
        setSelectedFields((prev) =>
            prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
        );
    };

    // ✅ Handle Excel Export
    const handleExportExcel = () => {
        exportToExcel(kpis, "KPI_Report", selectedFields);
        setExportDialogOpen(false);
    };

    return (
        <Box sx={{ maxWidth: 1400, mx: "auto", my: 4 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
                {/* ✅ Back Button */}
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                {/* ✅ KPI Analytics Overview */}
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Completed KPIs" value={kpiStatusCounts.completed} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="In Progress KPIs" value={kpiStatusCounts.inProgress} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Not Started KPIs" value={kpiStatusCounts.notStarted} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Total KPIs" value={kpis.length} />
                    </Grid>
                </Grid>

                {/* ✅ KPI Chart */}
                <Box sx={{ mb: 3 }}>
                    <Paper
                        sx={{
                            p: 2,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ width: "100%", maxWidth: 500 }}>
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
                        </Box>
                    </Paper>
                </Box>

                {/* ✅ KPI List View + Actions */}
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            KPI Management
                            {filterStatus &&
                                ` - ${
                                    filterStatus === "completed"
                                        ? "Completed"
                                        : filterStatus === "inProgress"
                                          ? "In Progress"
                                          : "Not Started"
                                }`}
                        </Typography>

                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="contained"
                                onClick={() => navigate(`/dashboard/${routes.kpiCreate}`)}
                            >
                                + Add KPI
                            </Button>
                            <Button variant="outlined" onClick={() => setExportDialogOpen(true)}>
                                Download Excel
                            </Button>
                        </Stack>
                    </Stack>

                    {kpis.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No KPIs found.
                        </Typography>
                    ) : (
                        kpis.map((kpi) => (
                            <Paper
                                key={kpi._id}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Typography variant="h6" fontWeight="bold">
                                        {kpi.title}
                                    </Typography>
                                    {renderStatusChip(kpi.status)}
                                </Stack>

                                <Typography variant="body2" color="text.secondary">
                                    Target: {kpi.target} | Deadline:{" "}
                                    {kpi.deadline
                                        ? new Date(kpi.deadline).toLocaleDateString()
                                        : "No deadline"}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Created By: {kpi.createdBy?.rank || "N/A"}
                                </Typography>

                                {renderProgress(kpi.progress)}

                                <Stack direction="row" spacing={1} mt={1}>
                                    <Tooltip title="View Details">
                                        <IconButton
                                            color="info"
                                            onClick={() =>
                                                navigate(`/dashboard/${routes.kpiDetails(kpi._id)}`)
                                            }
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                navigate(`/dashboard/${routes.kpiEdit(kpi._id)}`)
                                            }
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton color="error" onClick={() => handleDelete(kpi)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Paper>
                        ))
                    )}
                </Stack>
            </Paper>

            {/* ✅ Delete Confirmation */}
            <ConfirmDialog
                open={confirmOpen}
                title="Delete KPI?"
                message={`Are you sure you want to delete "${selectedKPI?.title}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />

            {/* ✅ Popup Modal for Rank Assignment */}
            <KPIAssignModal
                open={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                onSave={handleSaveAssign}
                ranks={["Commander", "Commando", "Special Force", "Soldier"]}
            />

            {/* ✅ Field Selection Dialog for Excel Export */}
            <Dialog
                open={exportDialogOpen}
                onClose={() => setExportDialogOpen(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Select Fields to Export</DialogTitle>
                <DialogContent>
                    <FormGroup>
                        {exportableFields.map((field) => (
                            <FormControlLabel
                                key={field.key}
                                control={
                                    <Checkbox
                                        checked={selectedFields.includes(field.key)}
                                        onChange={() => toggleField(field.key)}
                                    />
                                }
                                label={field.label}
                            />
                        ))}
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleExportExcel}>
                        Export Excel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default KPIManagement;
