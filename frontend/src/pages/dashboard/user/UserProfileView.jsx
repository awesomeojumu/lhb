import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Grid, Avatar, Divider, Button } from "@mui/material";
import Spinner from "@/components/feedback/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/feedback/ToastProvider";
import { getProfile, getUserById } from "@/services/userService";
import { roleOptions, battalions } from "@/config/roles";
import { useAuth } from "@/context/AuthContext";

const UserProfileView = ({ userId: propUserId, minimal = false }) => {
    const { id: routeId, userId: routeUserId } = useParams();
    const { user: loggedInUser } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const finalUserId = propUserId || routeUserId || routeId || "me";

    const getRoleLabel = (role) => roleOptions.find((opt) => opt.value === role)?.label || role;

    const getBattalionLabel = (battalion) =>
        battalions.find((opt) => opt.value === battalion)?.label || battalion;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let data;
                if (finalUserId === "me") {
                    data = await getProfile();
                } else {
                    data = await getUserById(finalUserId);
                }
                setUser(data);
            } catch {
                showToast("Failed to load user profile", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [finalUserId, showToast]);

    if (loading) return <Spinner />;

    if (!user) {
        return (
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <Typography variant="h6" color="text.secondary">
                    User profile not found.
                </Typography>
            </Box>
        );
    }

    const canEdit =
        loggedInUser?._id === user?._id ||
        loggedInUser?.role === "commander" ||
        loggedInUser?.role === "commando";

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
            <Card>
                <CardContent>
                    {/* Profile Header */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: minimal ? 1 : 3,
                            flexDirection: "column",
                        }}
                    >
                        {!minimal && (
                            <Avatar
                                src={user.profilePicture}
                                alt={`${user.firstName} ${user.lastName}`}
                                sx={{ width: 100, height: 100, mb: 1 }}
                            />
                        )}
                        <Typography
                            variant={minimal ? "h6" : "h5"}
                            fontWeight="bold"
                            textAlign="center"
                        >
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            {user.email}
                        </Typography>

                        {/* Edit Button → Navigates to Profile Page */}
                        {canEdit && !minimal && (
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ mt: 2 }}
                                onClick={() => navigate("/profile")}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* View-Only Mode */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                                Role
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                                {getRoleLabel(user.role)}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                                Battalion
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                                {getBattalionLabel(user.battalion)}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                                Phone
                            </Typography>
                            <Typography variant="body1">{user.phone || "N/A"}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                                Relationship Status
                            </Typography>
                            <Typography variant="body1">
                                {user.relationshipStatus || "Not specified"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                                Job Status
                            </Typography>
                            <Typography variant="body1">
                                {user.jobStatus || "Not specified"}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default UserProfileView;
