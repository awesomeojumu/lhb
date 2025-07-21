import React, { useEffect, useState } from "react";
import { Box, Button, Chip, LinearProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DataTable from "@components/data/DataTable";
import TableToolbar from "@components/data/TableToolbar";
import ConfirmDialog from "@components/feedback/ConfirmDialog";
import Spinner from "@components/feedback/Spinner";
import { useToast } from "@/components/feedback/ToastProvider";
import { getAllKPIs, deleteKPI } from "@services/kpiService";
import { formatDate } from "@/utils/formatDate";
import routes from "@config/routesConfig";

const KPIList = () => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, kpiId: null });
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const data = await getAllKPIs();
        setKpis(data);
      } catch {
        showToast("Failed to load KPIs", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, [showToast]);

  const handleDelete = async () => {
    try {
      await deleteKPI(confirm.kpiId);
      showToast("KPI deleted", "success");
      setKpis((prev) => prev.filter((k) => k._id !== confirm.kpiId));
    } catch {
      showToast("Failed to delete KPI", "error");
    } finally {
      setConfirm({ open: false, kpiId: null });
    }
  };

  if (loading) return <Spinner />;

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

  const columns = [
    { field: "title", headerName: "Title" },
    {
      field: "status",
      headerName: "Status",
      renderCell: (value) => (
        <Chip label={value || "Not Started"} color={getStatusColor(value)} size="small" />
      ),
    },
    {
      field: "progress",
      headerName: "Progress",
      renderCell: (value) => (
        <Box sx={{ width: "100%" }}>
          <LinearProgress
            variant="determinate"
            value={value || 0}
            sx={{ height: 6, borderRadius: 3, mb: 0.5 }}
          />
          <Typography variant="caption">{value || 0}%</Typography>
        </Box>
      ),
    },
    {
      field: "deadline",
      headerName: "Deadline",
      renderCell: (value) => formatDate(value) || "No deadline",
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (_, row) => (
        <>
          <Button size="small" onClick={() => navigate(routes.kpiDetails(row._id))}>
            View
          </Button>
          <Button size="small" onClick={() => navigate(routes.kpiEdit(row._id))}>
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => setConfirm({ open: true, kpiId: row._id })}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box>
      <TableToolbar
        title={`KPI Management (${kpis.length})`}
        onAdd={() => navigate(routes.kpiCreate)}
        // ✅ Future Improvement: add search/filter props
      />
      <DataTable columns={columns} rows={kpis} />

      <ConfirmDialog
        open={confirm.open}
        title="Delete KPI?"
        message="Are you sure you want to delete this KPI?"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, kpiId: null })}
      />
    </Box>
  );
};

export default KPIList;
