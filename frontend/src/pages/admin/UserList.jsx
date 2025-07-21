import { useEffect, useState } from "react";
import { listUsers, deleteUser } from "@services/userService";
import { useToast } from "@context/ToastContext";
import { useAuth } from "@context/AuthContext";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      showToast("User deleted successfully", "success");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "battalion", headerName: "Battalion", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="text"
            size="small"
            onClick={() => navigate(`/users/${params.row._id}`)}
          >
            View
          </Button>
          {["commander", "commando"].includes(user?.role) && (
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: "100%", padding: "20px" }}>
      <h2>User Management</h2>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row._id}
        loading={loading}
      />
    </div>
  );
}
