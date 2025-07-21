import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";
import Spinner from "@/components/feedback/Spinner";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/feedback/ToastProvider";
import { getUserById } from "@/services/userService";
import { roleOptions, battalions } from "@/config/roles";

const ViewProfile = () => {
  const { userId } = useParams(); // ✅ e.g., /dashboard/users/:userId
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const getRoleLabel = (role) =>
    roleOptions.find((opt) => opt.value === role)?.label || role;

  const getBattalionLabel = (battalion) =>
    battalions.find((opt) => opt.value === battalion)?.label || battalion;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        setUser(data);
      } catch {
        showToast("Failed to load user profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, showToast]);

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

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          {/* ✅ Profile Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              flexDirection: "column",
            }}
          >
            <Avatar
              src={user.profilePicture}
              alt={`${user.firstName} ${user.lastName}`}
              sx={{ width: 100, height: 100, mb: 1 }}
            />
            <Typography variant="h5" fontWeight="bold">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* ✅ Profile Details */}
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
                Age Bracket
              </Typography>
              <Typography variant="body1">
                {user.ageBracket || "Not specified"}
              </Typography>
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
                Five-Fold Gift
              </Typography>
              <Typography variant="body1">
                {user.fiveFoldGift || "Not specified"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Education
              </Typography>
              <Typography variant="body1">
                {user.education || "Not specified"}
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

export default ViewProfile;
