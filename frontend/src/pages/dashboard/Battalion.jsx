import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Chip, Paper } from "@mui/material";
import Spinner from "@/components/feedback/Spinner";
import StatCard from "@/components/data/StatCard";
import DataTable from "@/components/data/DataTable";
import TableToolbar from "@/components/data/TableToolbar";
import { useToast } from "@/components/feedback/ToastProvider";
import { listUsers } from "@/services/userService";
import { roleOptions, battalions } from "@/config/roles"; // ✅ Import labels

const Battalion = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = await listUsers();
        setUsers(data);
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  if (loading) return <Spinner />;

  // ✅ Helpers: Map values to labels
  const getRoleLabel = (value) =>
    roleOptions.find((opt) => opt.value === value)?.label || value;

  const getBattalionLabel = (value) =>
    battalions.find((opt) => opt.value === value)?.label || value;

  const getRoleColor = (value) => {
    switch (value) {
      case "commander":
        return "error";
      case "commando":
        return "warning";
      case "specialForce":
        return "info";
      default:
        return "success"; // globalSoldier
    }
  };

  // ✅ Group users by battalion
  const battalionCounts = users.reduce(
    (acc, user) => {
      acc[user.battalion] = (acc[user.battalion] || 0) + 1;
      return acc;
    },
    { Alpha: 0, Bravo: 0, Charlie: 0, Delta: 0 }
  );

  const columns = [
    { field: "firstName", headerName: "First Name" },
    { field: "lastName", headerName: "Last Name" },
    { field: "email", headerName: "Email" },
    { field: "phone", headerName: "Phone" },
    {
      field: "battalion",
      headerName: "Battalion",
      renderCell: (value) => getBattalionLabel(value),
    },
    {
      field: "role",
      headerName: "Role",
      renderCell: (value) => (
        <Chip
          label={getRoleLabel(value)}
          color={getRoleColor(value)}
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Battalion Overview
      </Typography>

      {/* ✅ Battalion Summary */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Alpha Battalion"
            value={battalionCounts.Alpha}
            subtext="Total Members"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Bravo Battalion"
            value={battalionCounts.Bravo}
            subtext="Total Members"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Charlie Battalion"
            value={battalionCounts.Charlie}
            subtext="Total Members"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Delta Battalion"
            value={battalionCounts.Delta}
            subtext="Total Members"
          />
        </Grid>
      </Grid>

      {/* ✅ Full Users Table */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <TableToolbar title={`All Battalion Members (${users.length})`} />
        <DataTable
          columns={columns}
          rows={users}
          pagination
          pageSize={10}
          search
        />
      </Paper>
    </Box>
  );
};

export default Battalion;
