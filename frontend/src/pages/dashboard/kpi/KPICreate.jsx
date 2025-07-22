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
      title: "",
      description: "",
      target: "",
      deadline: "",
      assignmentType: "specific",
      userIds: [],
      role: "",
    },
  });

  const { showToast } = useToast();
  const navigate = useNavigate();
  const assignmentType = watch("assignmentType");

  const [users, setUsers] = useState([]);

  // ✅ Fetch Users for "Specific Users" assignment
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

  // ✅ Handle Submit
  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        target: data.target,
        deadline: data.deadline,
        assignmentType: data.assignmentType,
      };

      if (data.assignmentType === "specific") {
        payload.userIds = Array.isArray(data.userIds)
          ? data.userIds
          : [];
      }

      if (data.assignmentType === "role") {
        payload.role = data.role;
      }

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
              {/* ✅ Title */}
              <Grid item xs={12}>
                <FormInput
                  name="title"
                  label="Title"
                  control={control}
                  rules={{ required: "Title is required" }}
                />
              </Grid>

              {/* ✅ Description */}
              <Grid item xs={12}>
                <FormInput
                  name="description"
                  label="Description"
                  control={control}
                  multiline
                  rows={3}
                />
              </Grid>

              {/* ✅ Target */}
              <Grid item xs={12} sm={6}>
                <FormInput
                  name="target"
                  label="Target"
                  control={control}
                  rules={{ required: "Target is required" }}
                />
              </Grid>

              {/* ✅ Deadline */}
              <Grid item xs={12} sm={6}>
                <DatePickerInput
                  name="deadline"
                  label="Deadline"
                  control={control}
                  rules={{ required: "Deadline is required" }}
                />
              </Grid>

              {/* ✅ Assignment Type */}
              <Grid item xs={12}>
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

              {/* ✅ Role (Only if assignmentType === role) */}
              {assignmentType === "role" && (
                <Grid item xs={12}>
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

              {/* ✅ Specific Users (Only if assignmentType === specific) */}
              {assignmentType === "specific" && (
                <Grid item xs={12}>
                  <MultiSelectInput
                    name="userIds"
                    label="Assign to Users"
                    control={control}
                    options={users.map((u) => ({
                      value: u._id,
                      label: `${u.firstName} ${u.lastName} (${u.email})`, // ✅ Shows proper names
                    }))}
                  />
                </Grid>
              )}
            </Grid>

            {/* ✅ Buttons */}
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
