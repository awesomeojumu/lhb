import React, { useEffect, useState, useMemo } from "react";
import {
    Box,
    Grid,
    Typography,
    Chip,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Stack,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import Spinner from "@/components/feedback/Spinner";
import StatCard from "@/components/data/StatCard";
import TableToolbar from "@/components/data/TableToolbar";
import { useToast } from "@/components/feedback/ToastProvider";
import { listUsers } from "@/services/userService";
import { roleOptions, battalions } from "@/config/roles";

const Ranks = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
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

    const getRoleLabel = (value) => roleOptions.find((opt) => opt.value === value)?.label || value;

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

    const roleCounts = useMemo(
        () =>
            users.reduce(
                (acc, user) => {
                    acc[user.role] = (acc[user.role] || 0) + 1;
                    return acc;
                },
                { commander: 0, commando: 0, specialForce: 0, globalSoldier: 0 }
            ),
        [users]
    );

    const filteredUsers = useMemo(() => {
        if (!searchText.trim()) return users;
        return users.filter((u) =>
            [
                `${u.firstName} ${u.lastName}`,
                u.email,
                u.phone,
                getRoleLabel(u.role),
                getBattalionLabel(u.battalion),
            ]
                .join(" ")
                .toLowerCase()
                .includes(searchText.toLowerCase())
        );
    }, [searchText, users]);

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setSelectedUser(null);
        setDetailsOpen(false);
    };

    if (loading) return <Spinner />;

    return (
        <Box sx={{ p: 2, maxWidth: 1200, mx: "auto" }}>
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

            {/* ✅ Users List */}
            <Paper elevation={3} sx={{ p: 2 }}>
                <TableToolbar title={`All Members by Ranks (${filteredUsers.length})`} />

                <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                    <TextField
                        size="small"
                        placeholder="Search by name, email, battalion, rank..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        sx={{ maxWidth: 300, width: "100%" }}
                    />
                </Box>

                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    {filteredUsers.map((user, index) => (
                        <React.Fragment key={user._id || index}>
                            <ListItem
                                alignItems="flex-start"
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box sx={{ flex: 1, display: "flex", gap: 2 }}>
                                    <ListItemAvatar>
                                        <Avatar src={user.profilePicture || ""}>
                                            {user.firstName[0]}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="bold"
                                                component="span" // ✅ Avoid <p>
                                            >
                                                {user.firstName} {user.lastName}
                                            </Typography>
                                        }
                                        secondaryTypographyProps={{ component: "div" }} // ✅ Avoid <p>
                                        secondary={
                                            <Stack spacing={0.5}>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                    flexWrap="wrap"
                                                >
                                                    <Chip
                                                        label={getBattalionLabel(user.battalion)}
                                                        color="default"
                                                        size="small"
                                                    />
                                                    <Chip
                                                        label={getRoleLabel(user.role)}
                                                        color={getRoleColor(user.role)}
                                                        size="small"
                                                    />
                                                </Stack>
                                                <Typography
                                                    variant="body2"
                                                    color="text.primary"
                                                    component="span" // ✅ Avoid <p>
                                                >
                                                    📞 {user.phone || "No phone"}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    component="span" // ✅ Avoid <p>
                                                >
                                                    ✉ {user.email}
                                                </Typography>
                                            </Stack>
                                        }
                                    />
                                </Box>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleViewDetails(user)}
                                >
                                    View Details
                                </Button>
                            </ListItem>
                            {index < filteredUsers.length - 1 && (
                                <Divider variant="inset" component="li" />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>

            {/* ✅ View Details Modal */}
            <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        {selectedUser?.firstName} {selectedUser?.lastName} – Details
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Avatar
                            src={selectedUser?.profilePicture || ""}
                            alt={`${selectedUser?.firstName} ${selectedUser?.lastName}`}
                            sx={{ width: 100, height: 100, mb: 1 }}
                        >
                            {selectedUser?.firstName?.[0]}
                        </Avatar>
                        <Typography variant="subtitle1" color="text.secondary">
                            {getRoleLabel(selectedUser?.role)}
                        </Typography>
                        <Chip
                            label={getBattalionLabel(selectedUser?.battalion)}
                            color="default"
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    </Box>

                    <Stack spacing={1}>
                        <Typography variant="body1" component="div">
                            <strong>Full Name:</strong> {selectedUser?.firstName}{" "}
                            {selectedUser?.lastName}
                        </Typography>
                        <Typography variant="body1" component="div">
                            <strong>Email:</strong> {selectedUser?.email}
                        </Typography>
                        <Typography variant="body1" component="div">
                            <strong>Phone:</strong> {selectedUser?.phone || "No phone"}
                        </Typography>
                        <Typography variant="body1" component="div">
                            <strong>Role:</strong> {getRoleLabel(selectedUser?.role)}
                        </Typography>
                        <Typography variant="body1" component="div">
                            <strong>Battalion:</strong> {getBattalionLabel(selectedUser?.battalion)}
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails} variant="contained" color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Ranks;
