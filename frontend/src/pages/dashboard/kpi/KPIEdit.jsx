import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getKPIDetails, updateKPI } from "@services/kpiService";
import { listUsers } from "@services/userService";
import { useToast } from "@/components/feedback/ToastProvider";
import Spinner from "@components/feedback/Spinner";
import FormInput from "@components/forms/FormInput";
import DatePickerInput from "@components/forms/DatePickerInput";
import MultiSelectInput from "@components/forms/MultiSelectInput";
import FormButtons from "@components/forms/FormButtons";
import routes from "@config/routesConfig";
import { roleOptions } from "@/config/roles";

const KPIEdit = () => {
  const { kpiId } = useParams();
  const { control, handleSubmit, reset, watch, setValue } = useForm();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);

  const assignmentType = watch("assignmentType");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiData, allUsers] = await Promise.all([
          getKPIDetails(kpiId),
          listUsers(),
        ]);
        setUsers(allUsers);

        // ✅ Reset form with KPI details
        reset({
          title: kpiData.title,
          description: kpiData.description,
          target: kpiData.target,
          deadline: kpiData.deadline,
          assignmentType: kpiData.assignmentType || "all",
          role: kpiData.role || "",
          userIds: kpiData.userIds || [],
        });
      } catch {
        showToast("Failed to load KPI details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kpiId, reset, showToast]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      await updateKPI(kpiId, data);
      showToast("KPI updated successfully!", "success");
      navigate(routes.kpis);
    } catch {
      showToast("Failed to update KPI", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" mb={3} fontWeight="bold">
            Edit KPI
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
                    value={assignmentType || "all"}
                    onChange={(e) =>
                      setValue("assignmentType", e.target.value)
                    }
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
                      value={watch("role") || ""}
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
              isSubmitting={saving}
              onCancel={() => navigate(routes.kpis)}
            />
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default KPIEdit;
