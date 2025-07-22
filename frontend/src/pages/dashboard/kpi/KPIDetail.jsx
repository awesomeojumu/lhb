import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    LinearProgress,
    Divider,
    Stack,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getKPIDetails } from "@services/kpiService";
import Spinner from "@components/feedback/Spinner";

const KPIDetail = () => {
    const { kpiId } = useParams();
    const [kpi, setKpi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!kpiId || kpiId.length !== 24) {
            setError("Invalid KPI ID");
            setLoading(false);
            return;
        }

        const fetchKPI = async () => {
            try {
                const data = await getKPIDetails(kpiId);
                setKpi(data);
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to load KPI details");
            } finally {
                setLoading(false);
            }
        };

        fetchKPI();
    }, [kpiId]);

    if (loading) return <Spinner />;

    if (error) {
        return (
            <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: "center" }}>
                <Typography color="error" variant="body1">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (!kpi) {
        return (
            <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: "center" }}>
                <Typography color="text.secondary">No KPI details available.</Typography>
            </Box>
        );
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "success";
            case "in progress":
                return "warning";
            default:
                return "default";
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" mb={1} fontWeight="bold">
                        {kpi.title}
                    </Typography>
                    {kpi.description && (
                        <Typography variant="body1" gutterBottom>
                            {kpi.description}
                        </Typography>
                    )}
                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1} mb={2}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Target:</strong> {kpi.target}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Deadline:</strong>{" "}
                            {kpi.deadline
                                ? new Date(kpi.deadline).toLocaleDateString()
                                : "No deadline"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Created By:</strong>{" "}
                            {kpi.createdBy?.rank
                                ? `${kpi.createdBy.rank} - ${kpi.createdBy.name}`
                                : "Unknown"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Assignment Type:</strong> {kpi.assignmentType || "Specific"}
                        </Typography>
                    </Stack>

                    <Chip
                        label={kpi.status || "Not Started"}
                        color={getStatusColor(kpi.status)}
                        sx={{ fontWeight: "bold", mb: 2 }}
                    />

                    <Box sx={{ width: "100%", mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Progress
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={kpi.progress || 0}
                            sx={{ height: 8, borderRadius: 4, mt: 0.5 }}
                            color={
                                kpi.progress >= 80
                                    ? "success"
                                    : kpi.progress >= 40
                                      ? "warning"
                                      : "error"
                            }
                        />
                        <Typography variant="caption" color="text.secondary">
                            {kpi.progress || 0}%
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default KPIDetail;
