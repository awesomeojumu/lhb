import React, { useEffect, useState } from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import TableToolbar from "@/components/data/TableToolbar";
import DataTable from "@/components/data/DataTable";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import Spinner from "@/components/feedback/Spinner";
import { useToast } from "@/components/feedback/ToastProvider";
import { listUsers, updateUserBattalion } from "@/services/userService";
import { battalions } from "@/config/roles";

const BattalionManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newBattalion, setNewBattalion] = useState("");
  const { showToast } = useToast();

  // ✅ Fetch all users (Commander & Commando only)
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

  const handleBattalionChange = (user, battalion) => {
    setSelectedUser(user);
    setNewBattalion(battalion);
    setConfirmOpen(true);
  };

  const handleConfirmChange = async () => {
    try {
      await updateUserBattalion(selectedUser._id, newBattalion);
      showToast(`Moved to "${newBattalion}" battalion successfully`, "success");

      // ✅ Update state instantly
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id ? { ...u, battalion: newBattalion } : u
        )
      );
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setConfirmOpen(false);
    }
  };

  if (loading) return <Spinner />;

  const columns = [
    { field: "firstName", headerName: "First Name" },
    { field: "lastName", headerName: "Last Name" },
    { field: "email", headerName: "Email" },
    {
      field: "battalion",
      headerName: "Battalion",
      renderCell: (value, row) => (
        <Select
          size="small"
          value={value || ""}
          onChange={(e) => handleBattalionChange(row, e.target.value)}
        >
          {battalions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <Box>
      <TableToolbar title="Battalion Management" />
      <DataTable columns={columns} rows={users} />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Battalion Change"
        message={`Are you sure you want to move ${selectedUser?.firstName} to "${newBattalion}" battalion?`}
        onConfirm={handleConfirmChange}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default BattalionManagement;
