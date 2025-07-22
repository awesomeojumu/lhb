import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Chip,
  LinearProgress,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Stack,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import UndoIcon from "@mui/icons-material/Undo";
import { useNavigate } from "react-router-dom";
import Spinner from "@components/feedback/Spinner";
import TableToolbar from "@components/data/TableToolbar";
import { useToast } from "@/components/feedback/ToastProvider";
import { getAllKPIs, updateKPIStatus } from "@services/kpiService";
import { formatDate } from "@/utils/formatDate";
import routes from "@config/routesConfig";

const KPIList = () => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <Spinner />;

  // ✅ Get Status Color
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

  // ✅ Toggle Status Handler
  const handleToggleStatus = async (kpi) => {
    const newStatus = kpi.status === "Completed" ? "In Progress" : "Completed";
    try {
      await updateKPIStatus(kpi._id, { status: newStatus });
      setKpis((prev) =>
        prev.map((item) =>
          item._id === kpi._id ? { ...item, status: newStatus } : item
        )
      );
      showToast(`KPI marked as ${newStatus}`, "success");
    } catch {
      showToast("Failed to update KPI status", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", my: 3 }}>
      <TableToolbar
        title={`KPI Management (${kpis.length})`}
        onAdd={() => navigate(routes.kpiCreate)}
      />

      {kpis.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No KPIs found.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {kpis.map((kpi) => (
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
              {/* ✅ Title + Status */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="bold">
                  {kpi.title}
                </Typography>
                <Chip
                  label={kpi.status || "Not Started"}
                  color={getStatusColor(kpi.status)}
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
              </Stack>

              {/* ✅ Target + Deadline */}
              <Typography variant="body2" color="text.secondary">
                Target: {kpi.target} | Deadline:{" "}
                {kpi.deadline
                  ? formatDate(kpi.deadline)
                  : "No deadline"}
              </Typography>

              {/* ✅ Progress Bar */}
              <Box sx={{ width: "100%", maxWidth: 300 }}>
                <LinearProgress
                  variant="determinate"
                  value={kpi.progress || 0}
                  sx={{ height: 6, borderRadius: 3, mb: 0.5 }}
                  color={
                    kpi.progress >= 80
                      ? "success"
                      : kpi.progress >= 40
                      ? "warning"
                      : "error"
                  }
                />
                <Typography variant="caption">{kpi.progress || 0}%</Typography>
              </Box>

              {/* ✅ Actions */}
              <Stack direction="row" spacing={1} mt={1}>
                <Tooltip
                  title={
                    kpi.status === "Completed"
                      ? "Mark as In Progress"
                      : "Mark as Completed"
                  }
                >
                  <IconButton
                    color={
                      kpi.status === "Completed" ? "warning" : "success"
                    }
                    onClick={() => handleToggleStatus(kpi)}
                  >
                    {kpi.status === "Completed" ? (
                      <UndoIcon />
                    ) : (
                      <DoneIcon />
                    )}
                  </IconButton>
                </Tooltip>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate(routes.kpiDetails(kpi._id))}
                >
                  View
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default KPIList;
