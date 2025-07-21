import React, { useEffect, useState } from "react";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TableToolbar from "@/components/data/TableToolbar";
import DataTable from "@/components/data/DataTable";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import Spinner from "@/components/feedback/Spinner";
import { useToast } from "@/components/feedback/ToastProvider";
import { getAllKPIs, deleteKPI } from "@/services/kpiService";
import { useNavigate } from "react-router-dom";
import routes from "@/config/routesConfig";

const KPIManagement = () => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // ✅ Fetch all KPIs
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllKPIs();
        setKpis(data);
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

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
      showToast(error.message, "error");
    } finally {
      setConfirmOpen(false);
    }
  };

  if (loading) return <Spinner />;

  const columns = [
    { field: "title", headerName: "Title" },
    { field: "assignedTo", headerName: "Assigned To" },
    { field: "status", headerName: "Status" },
    { field: "deadline", headerName: "Deadline" },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (_, row) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              onClick={() => navigate(routes.kpiEdit(row._id))}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDelete(row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <TableToolbar
        title="KPI Management"
        onAdd={() => navigate(routes.kpiCreate)}
      />
      <DataTable columns={columns} rows={kpis} />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete KPI?"
        message={`Are you sure you want to delete "${selectedKPI?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default KPIManagement;
