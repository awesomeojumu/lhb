import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { useToast } from "@/components/feedback/ToastProvider";
import { createKPI } from "@services/kpiService";
import { listUsers } from "@services/userService";
import { useNavigate } from "react-router-dom";
import FormInput from "@components/forms/FormInput";
import DatePickerInput from "@components/forms/DatePickerInput";
import FormButtons from "@components/forms/FormButtons";
import MultiSelectInput from "@components/forms/MultiSelectInput";
import routes from "@config/routesConfig";
import { roleOptions } from "@/config/roles";

const KPICreate = () => {
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      assignmentType: "specific",
      userIds: [],
      role: "",
    },
  });
  const { showToast } = useToast();
  const navigate = useNavigate();
  const assignmentType = watch("assignmentType");

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (assignmentType === "specific") {
      (async () => {
        try {
          const data = await listUsers();
          setUsers(data);
        } catch {
          showToast("Failed to load users", "error");
        }
      })();
    }
  }, [assignmentType, showToast]);

  const onSubmit = async (data) => {
    try {
      // ✅ Convert userIds if needed
      const payload = {
        ...data,
        userIds: Array.isArray(data.userIds)
          ? data.userIds
          : data.userIds.split(",").map((id) => id.trim()),
      };
      await createKPI(payload);
      showToast("KPI created successfully!", "success");
      navigate(routes.kpis);
    } catch {
      showToast("Failed to create KPI", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" mb={3} fontWeight="bold">
            Create KPI
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormInput
                  name="title"
                  label="Title"
                  control={control}
                  rules={{ required: "Title is required" }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormInput
                  name="description"
                  label="Description"
                  control={control}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormInput
                  name="target"
                  label="Target"
                  control={control}
                  rules={{ required: "Target is required" }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DatePickerInput
                  name="deadline"
                  label="Deadline"
                  control={control}
                  rules={{ required: "Deadline is required" }}
                />
              </Grid>

              {/* ✅ Assignment Type */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Assignment Type</InputLabel>
                  <Select
                    value={assignmentType}
                    onChange={(e) => setValue("assignmentType", e.target.value)}
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="role">By Role</MenuItem>
                    <MenuItem value="specific">Specific Users</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* ✅ Role Assignment */}
              {assignmentType === "role" && (
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={watch("role")}
                      onChange={(e) => setValue("role", e.target.value)}
                    >
                      {roleOptions.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          {role.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* ✅ Specific Users */}
              {assignmentType === "specific" && (
                <Grid size={{ xs: 12 }}>
                  <MultiSelectInput
                    name="userIds"
                    label="Assign to Users"
                    control={control}
                    options={users.map((u) => ({
                      value: u._id,
                      label: `${u.firstName} ${u.lastName} (${u.email})`,
                    }))}
                  />
                </Grid>
              )}
            </Grid>

            <FormButtons
              sx={{ mt: 3 }}
              isSubmitting={false}
              onCancel={() => navigate(routes.kpis)}
            />
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default KPICreate;
