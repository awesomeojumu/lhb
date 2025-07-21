import React, { useEffect, useState } from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import TableToolbar from "@/components/data/TableToolbar";
import DataTable from "@/components/data/DataTable";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import Spinner from "@/components/feedback/Spinner";
import { useToast } from "@/components/feedback/ToastProvider";
import { listUsers, updateUserRole } from "@/services/userService";
import { roleOptions } from "@/config/roles";

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const { showToast } = useToast();

  // ✅ Fetch users (Commander & Commando only)
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

  const handleRoleChange = (user, role) => {
    setSelectedUser(user);
    setNewRole(role);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await updateUserRole(selectedUser._id, newRole);
      showToast(`Role updated to "${newRole}" successfully`, "success");

      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id ? { ...u, role: newRole } : u
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
    { field: "phone", headerName: "Phone" },
    { field: "battalion", headerName: "Battalion" },
    {
      field: "role",
      headerName: "Role",
      renderCell: (value, row) => {
        // ✅ Lock Commander role changes
        if (row.role === "commander") {
          return (
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              {value}
            </Typography>
          );
        }
        return (
          <Select
            size="small"
            value={value}
            onChange={(e) => handleRoleChange(row, e.target.value)}
          >
            {roleOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
  ];

  return (
    <Box>
      <TableToolbar title="Role Management" />
      <DataTable columns={columns} rows={users} />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Role Change"
        message={`Are you sure you want to change ${selectedUser?.firstName}'s role to "${newRole}"?`}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default RoleManagement;
