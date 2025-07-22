import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    Chip,
    MenuItem,
    Select,
    IconButton,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import Spinner from "@/components/feedback/Spinner";
import { useToast } from "@/components/feedback/ToastProvider";
import { listUsers, updateUserBattalion } from "@/services/userService";
import { battalions, roleOptions } from "@/config/roles";
import { useNavigate, useLocation } from "react-router-dom";
import { exportToExcel } from "@/utils/exportUtils";

const BattalionManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newBattalion, setNewBattalion] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [fieldModalOpen, setFieldModalOpen] = useState(false);
    const [selectedFields, setSelectedFields] = useState([]);

    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const filterBattalion = queryParams.get("name");

    const allFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "lhbCode",
        "battalion",
        "role",
        "relationshipStatus",
        "leadershipRoles",
        "createdAt",
        "lastActive",
    ];

    useEffect(() => {
        (async () => {
            try {
                let data = await listUsers();
                if (filterBattalion && filterBattalion !== "myBattalion") {
                    data = data.filter((u) => u.battalion === filterBattalion);
                }
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                showToast(error.message, "error");
            } finally {
                setLoading(false);
            }
        })();
    }, [showToast, filterBattalion]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();
        setFilteredUsers(
            users.filter(
                (u) =>
                    `${u.firstName} ${u.lastName}`.toLowerCase().includes(lowerQuery) ||
                    u.email.toLowerCase().includes(lowerQuery) ||
                    (u.lhbCode || "").toLowerCase().includes(lowerQuery)
            )
        );
    };

    const handleBattalionChange = (user, battalion) => {
        setSelectedUser(user);
        setNewBattalion(battalion);
        setConfirmOpen(true);
    };

    const handleConfirmChange = async () => {
        try {
            await updateUserBattalion(selectedUser._id, newBattalion);
            showToast(`Moved to "${newBattalion}" battalion successfully`, "success");
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === selectedUser._id ? { ...u, battalion: newBattalion } : u
                )
            );
            setFilteredUsers((prev) =>
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

    const getRoleLabel = (value) => roleOptions.find((opt) => opt.value === value)?.label || value;

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

    // ✅ Modal Helpers
    const handleFieldToggle = (field) => {
        setSelectedFields((prev) =>
            prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
        );
    };

    const handleConfirmDownload = (format) => {
        if (format === "excel") {
            exportToExcel(filteredUsers, "Battalion_Users", selectedFields);
        }
        setFieldModalOpen(false);
    };

    if (loading) return <Spinner />;

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", my: 4 }}>
            <Paper sx={{ p: 2 }}>
                {/* ✅ Back Button */}
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                {/* ✅ Toolbar */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={{ mb: 2 }}
                >
                    <Typography variant="h6">Battalion Management</Typography>
                    <Stack direction="row" spacing={1}>
                        <input
                            type="text"
                            placeholder="Search by name, email or LHB Code"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{
                                padding: "8px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={() => setFieldModalOpen(true)}
                        >
                            Download
                        </Button>
                    </Stack>
                </Stack>

                {/* ✅ Search List */}
                {filteredUsers.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No users found.
                    </Typography>
                ) : (
                    filteredUsers.map((user) => (
                        <Paper
                            key={user._id}
                            sx={{
                                p: 2,
                                mb: 1.5,
                                borderRadius: 2,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {user.firstName} {user.lastName} ({user.lhbCode || "N/A"})
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user.email} | {user.phone || "No phone"}
                                </Typography>
                                <Stack direction="row" spacing={1} mt={0.5}>
                                    <Chip
                                        label={getRoleLabel(user.role)}
                                        color={getRoleColor(user.role)}
                                        size="small"
                                    />
                                    <Chip
                                        label={user.battalion || "No Battalion"}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Stack>
                            </Box>
                            <Select
                                size="small"
                                value={user.battalion || ""}
                                onChange={(e) => handleBattalionChange(user, e.target.value)}
                            >
                                {battalions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Paper>
                    ))
                )}
            </Paper>

            {/* ✅ Confirm Battalion Change */}
            <ConfirmDialog
                open={confirmOpen}
                title="Confirm Battalion Change"
                message={`Are you sure you want to move ${selectedUser?.firstName} to "${newBattalion}" battalion?`}
                onConfirm={handleConfirmChange}
                onCancel={() => setConfirmOpen(false)}
            />

            {/* ✅ Field Selection Modal */}
            <Dialog open={fieldModalOpen} onClose={() => setFieldModalOpen(false)}>
                <DialogTitle>Select Fields to Export</DialogTitle>
                <DialogContent dividers>
                    {allFields.map((field) => (
                        <FormControlLabel
                            key={field}
                            control={
                                <Checkbox
                                    checked={selectedFields.includes(field)}
                                    onChange={() => handleFieldToggle(field)}
                                />
                            }
                            label={field}
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFieldModalOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleConfirmDownload("excel")} variant="contained">
                        Excel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BattalionManagement;
