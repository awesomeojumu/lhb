import React, { useEffect, useState } from "react";
import { Box, LinearProgress, Typography, Chip } from "@mui/material";
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
    (async () => {
      try {
        const data = await getMyKPIs();
        setKpis(data);
      } catch (error) {
        showToast(error.message || "Failed to load KPIs", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  if (loading) return <Spinner />;

  if (!kpis.length) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="text.secondary">
          No KPIs assigned yet.
        </Typography>
      </Box>
    );
  }

  // ✅ Helper: Color-coded status chip
  const renderStatusChip = (status) => {
    let color = "default";
    if (status === "Completed") color = "success";
    else if (status === "In Progress") color = "warning";
    else color = "default";

    return <Chip label={status || "Not Started"} color={color} size="small" />;
  };

  // ✅ Helper: Progress bar colors
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
      renderCell: (value) => renderStatusChip(value),
    },
    {
      field: "progress",
      headerName: "Progress",
      renderCell: (value) => (
        <Box sx={{ width: "100%" }}>
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
      <TableToolbar title="My KPIs" />
      <DataTable
        columns={columns}
        rows={kpis}
        onRowClick={(row) => navigate(routes.kpiDetails(row._id))}
      />
    </Box>
  );
};

export default MyKpis;
