import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useToast } from "@context/ToastContext";
import { createKPI } from "@services/kpiService";
import { useNavigate } from "react-router-dom";
import FormInput from "@components/forms/FormInput";
import DatePickerInput from "@components/forms/DatePickerInput";
import FormButtons from "@components/forms/FormButtons";
import routes from "@config/routesConfig";

const KPICreate = () => {
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      assignmentType: "specific",
      userIds: [],
    },
  });
  const { showToast } = useToast();
  const navigate = useNavigate();
  const assignmentType = watch("assignmentType");

  const onSubmit = async (data) => {
    try {
      await createKPI(data);
      showToast("KPI created successfully!", "success");
      navigate(routes.kpis);
    } catch {
      showToast("Failed to create KPI", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Card>
        <CardContent>
          <Typography variant="h5" mb={2} fontWeight="bold">
            Create KPI
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              name="title"
              label="Title"
              control={control}
              rules={{ required: "Title is required" }}
            />
            <FormInput name="description" label="Description" control={control} />
            <FormInput name="target" label="Target" control={control} />
            <DatePickerInput
              name="deadline"
              label="Deadline"
              control={control}
              rules={{ required: "Deadline is required" }}
            />

            {/* Assignment Type */}
            <FormControl fullWidth sx={{ mt: 2 }}>
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

            {/* Additional Fields */}
            {assignmentType === "role" && (
              <FormInput name="role" label="Role" control={control} />
            )}
            {assignmentType === "specific" && (
              <FormInput
                name="userIds"
                label="User IDs (comma separated)"
                control={control}
              />
            )}

            <FormButtons
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
