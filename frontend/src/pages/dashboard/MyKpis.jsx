import React, { useEffect, useState } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
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
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  if (loading) return <Spinner />;

  const columns = [
    { field: "title", headerName: "Title" },
    { field: "status", headerName: "Status" },
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
      renderCell: (value) =>
        value ? new Date(value).toLocaleDateString() : "No deadline",
    },
  ];

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", my: 4 }}>
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
