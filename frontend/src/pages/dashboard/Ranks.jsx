import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import Spinner from "@/components/feedback/Spinner";
import StatCard from "@/components/data/StatCard";
import DataTable from "@/components/data/DataTable";
import TableToolbar from "@/components/data/TableToolbar";
import { useToast } from "@/components/feedback/ToastProvider";
import { listUsers } from "@/services/userService";

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
    { field: "role", headerName: "Role" },
    { field: "battalion", headerName: "Battalion" },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Ranks Overview
      </Typography>

      {/* ✅ Rank Summary */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Commanders"
            value={roleCounts.commander}
            subtext="Total Commanders"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Commandos"
            value={roleCounts.commando}
            subtext="Total Commandos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Special Forces"
            value={roleCounts.specialForce}
            subtext="Total Special Forces"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Global Soldiers"
            value={roleCounts.globalSoldier}
            subtext="Total Global Soldiers"
          />
        </Grid>
      </Grid>

      {/* ✅ Full Users Table */}
      <TableToolbar title="All Members by Ranks" />
      <DataTable columns={columns} rows={users} />
    </Box>
  );
};

export default Ranks;
