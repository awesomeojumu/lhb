import React, { useEffect, useState } from "react";
import { Box, LinearProgress, Typography, Chip, Paper } from "@mui/material";
import Spinner from "@/components/feedback/Spinner";
import TableToolbar from "@/components/data/TableToolbar";
import DataTable from "@/components/data/DataTable";
import { useToast } from "@/components/feedback/ToastProvider";
import { getMyKPIs } from "@/services/kpiService";
import { useNavigate } from "react-router-dom";
import routes from "@/config/routesConfig";

const MyKpis = () => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyKPIs = async () => {
      try {
        const data = await getMyKPIs();
        setKpis(data || []);
      } catch (error) {
        showToast(error.message || "Failed to load KPIs", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMyKPIs();
  }, [showToast]);

  if (loading) return <Spinner />;

  if (!kpis.length) {
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography variant="h6" color="text.secondary">
          No KPIs assigned yet.
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
          Once KPIs are assigned, they will appear here with progress tracking.
        </Typography>
      </Box>
    );
  }

  // ✅ Status Chip Helper
  const renderStatusChip = (status) => {
    const normalizedStatus = status || "Not Started";
    const color =
      normalizedStatus === "Completed"
        ? "success"
        : normalizedStatus === "In Progress"
        ? "warning"
        : "default";

    return (
      <Chip
        label={normalizedStatus}
        color={color}
        size="small"
        sx={{ fontWeight: "bold" }}
      />
    );
  };

  // ✅ Progress Bar Color Helper
  const getProgressColor = (value) => {
    if (value >= 80) return "success";
    if (value >= 40) return "warning";
    return "error";
  };

  const columns = [
    { field: "title", headerName: "Title" },
    {
      field: "status",
      headerName: "Status",
      renderCell: renderStatusChip,
    },
    {
      field: "progress",
      headerName: "Progress",
      renderCell: (value) => (
        <Box sx={{ width: "100%", minWidth: 100 }}>
          <LinearProgress
            variant="determinate"
            value={value || 0}
            color={getProgressColor(value || 0)}
            sx={{ height: 6, borderRadius: 3, mb: 0.5 }}
          />
          <Typography variant="caption">{value || 0}%</Typography>
        </Box>
      ),
    },
    {
      field: "deadline",
      headerName: "Deadline",
      renderCell: (value) =>
        value ? new Date(value).toLocaleDateString() : "No deadline",
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", my: 4 }}>
      <Paper sx={{ p: 2 }}>
        <TableToolbar title="My KPIs" />
        <DataTable
          columns={columns}
          rows={kpis}
          showIndex // ✅ (optional, works with improved DataTable)
          onRowClick={(row) => navigate(routes.kpiDetails(row._id))}
        />
      </Paper>
    </Box>
  );
};

export default MyKpis;
