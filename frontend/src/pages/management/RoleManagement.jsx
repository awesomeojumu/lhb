import React, { useEffect, useState, useMemo } from "react";
import {
    Box,
    MenuItem,
    Select,
    Typography,
    Paper,
    Button,
    TextField,
    Chip,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Spinner from "@/components/feedback/Spinner";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import TableToolbar from "@/components/data/TableToolbar";
import { useToast } from "@/components/feedback/ToastProvider";
import { listUsers, updateUserRole } from "@/services/userService";
import { roleOptions, battalions } from "@/config/roles";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const RoleManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [newRole, setNewRole] = useState("");
    const { showToast } = useToast();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

    const getBattalionLabel = (value) =>
        battalions.find((opt) => opt.value === value)?.label || value;

    const filteredUsers = useMemo(() => {
        if (!searchText.trim()) return users;
        return users.filter((u) =>
            [
                `${u.firstName} ${u.lastName}`,
                u.email,
                u.phone,
                getBattalionLabel(u.battalion),
                u.role,
            ]
                .join(" ")
                .toLowerCase()
                .includes(searchText.toLowerCase())
        );
    }, [searchText, users]);

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
                prev.map((u) => (u._id === selectedUser._id ? { ...u, role: newRole } : u))
            );
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            setConfirmOpen(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            <Paper sx={{ p: 2, width: "100%" }}>
                {/* ✅ Back Button */}
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                <TableToolbar title={`Role Management (${filteredUsers.length})`} />

                {/* ✅ Search Bar */}
                <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                    <TextField
                        size="small"
                        placeholder="Search by name, email, battalion..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        sx={{ maxWidth: 300, width: "100%" }}
                    />
                </Box>

                {/* ✅ Responsive List View */}
                <List>
                    {filteredUsers.map((user, index) => (
                        <React.Fragment key={user._id || index}>
                            <ListItem
                                alignItems="flex-start"
                                sx={{
                                    display: "flex",
                                    flexDirection: isMobile ? "column" : "row",
                                    justifyContent: isMobile ? "flex-start" : "space-between",
                                    alignItems: isMobile ? "flex-start" : "center",
                                    gap: 2,
                                }}
                            >
                                {/* ✅ User Info */}
                                <Box sx={{ flex: 1, width: "100%" }}>
                                    <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                        <ListItemAvatar>
                                            <Avatar src={user.profilePicture || ""}>
                                                {user.firstName[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {user.firstName} {user.lastName}
                                            </Typography>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                flexWrap="wrap"
                                                mt={0.5}
                                                mb={0.5}
                                            >
                                                <Chip
                                                    label={getBattalionLabel(user.battalion)}
                                                    size="small"
                                                    sx={{ fontWeight: "bold" }}
                                                />
                                                <Chip
                                                    label={
                                                        roleOptions.find(
                                                            (opt) => opt.value === user.role
                                                        )?.label || user.role
                                                    }
                                                    size="small"
                                                    color="primary"
                                                    sx={{ fontWeight: "bold" }}
                                                />
                                            </Stack>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ wordBreak: "break-word" }}
                                            >
                                                {user.email}
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                {user.phone || "No phone"}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>

                                {/* ✅ Role Selector */}
                                <Box sx={{ width: isMobile ? "100%" : "auto" }}>
                                    {user.role === "commander" ? (
                                        <Typography
                                            variant="body2"
                                            fontWeight="bold"
                                            color="text.secondary"
                                        >
                                            Commander
                                        </Typography>
                                    ) : (
                                        <Select
                                            fullWidth={isMobile}
                                            size="small"
                                            value={
                                                roleOptions.some((opt) => opt.value === user.role)
                                                    ? user.role
                                                    : ""
                                            }
                                            onChange={(e) => handleRoleChange(user, e.target.value)}
                                        >
                                            {roleOptions.map((opt) => (
                                                <MenuItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                </Box>
                            </ListItem>
                            {index < filteredUsers.length - 1 && (
                                <Divider component="li" sx={{ my: 1 }} />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>

            {/* ✅ Confirm Role Change */}
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
