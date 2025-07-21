import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import Spinner from "@/components/feedback/Spinner";
import StatCard from "@/components/data/StatCard";
import DataTable from "@/components/data/DataTable";
import TableToolbar from "@/components/data/TableToolbar";
import { useToast } from "@/components/feedback/ToastProvider";
import { listUsers } from "@/services/userService";

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
    { field: "battalion", headerName: "Battalion" },
    { field: "role", headerName: "Role" },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Battalion Overview
      </Typography>

      {/* ✅ Battalion Summary */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Alpha Battalion"
            value={battalionCounts.Alpha}
            subtext="Total Members"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Bravo Battalion"
            value={battalionCounts.Bravo}
            subtext="Total Members"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Charlie Battalion"
            value={battalionCounts.Charlie}
            subtext="Total Members"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Delta Battalion"
            value={battalionCounts.Delta}
            subtext="Total Members"
          />
        </Grid>
      </Grid>

      {/* ✅ Full Users Table */}
      <TableToolbar title="All Battalion Members" />
      <DataTable columns={columns} rows={users} />
    </Box>
  );
};

export default Battalion;
