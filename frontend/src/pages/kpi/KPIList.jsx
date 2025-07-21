import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DataTable from "@components/data/DataTable";
import TableToolbar from "@components/data/TableToolbar";
import ConfirmDialog from "@components/feedback/ConfirmDialog";
import { getAllKPIs, deleteKPI } from "@services/kpiService";
import Spinner from "@components/feedback/Spinner";
import { useToast } from "@context/ToastContext";
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
      setKpis(kpis.filter((k) => k._id !== confirm.kpiId));
    } catch {
      showToast("Failed to delete KPI", "error");
    } finally {
      setConfirm({ open: false, kpiId: null });
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box>
      <TableToolbar
        title="KPI Management"
        onAdd={() => navigate(routes.kpiCreate)}
      />
      <DataTable
        columns={[
          { field: "title", headerName: "Title" },
          { field: "target", headerName: "Target" },
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
        ]}
        rows={kpis}
      />
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
