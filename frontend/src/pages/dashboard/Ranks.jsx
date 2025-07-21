import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Chip, Paper } from "@mui/material";
import Spinner from "@/components/feedback/Spinner";
import StatCard from "@/components/data/StatCard";
import DataTable from "@/components/data/DataTable";
import TableToolbar from "@/components/data/TableToolbar";
import { useToast } from "@/components/feedback/ToastProvider";
import { listUsers } from "@/services/userService";
import { roleOptions, battalions } from "@/config/roles";

const Ranks = () => {
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

  // ✅ Helpers
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
        return "success";
    }
  };

  // ✅ Group users by role
  const roleCounts = users.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    },
    { commander: 0, commando: 0, specialForce: 0, globalSoldier: 0 }
  );

  const columns = [
    { field: "firstName", headerName: "First Name" },
    { field: "lastName", headerName: "Last Name" },
    { field: "email", headerName: "Email" },
    { field: "phone", headerName: "Phone" },
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
    {
      field: "battalion",
      headerName: "Battalion",
      renderCell: (value) => getBattalionLabel(value),
    },
  ];

  return (
    <Box sx={{ p: 1}}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Ranks Overview
      </Typography>

      {/* ✅ Stat Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Commanders"
            value={roleCounts.commander}
            subtext="Total Commanders"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Commandos"
            value={roleCounts.commando}
            subtext="Total Commandos"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Special Forces"
            value={roleCounts.specialForce}
            subtext="Total Special Forces"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Global Soldiers"
            value={roleCounts.globalSoldier}
            subtext="Total Global Soldiers"
          />
        </Grid>
      </Grid>

      {/* ✅ Users Table */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <TableToolbar title={`All Members by Ranks (${users.length})`} />
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

export default Ranks;
