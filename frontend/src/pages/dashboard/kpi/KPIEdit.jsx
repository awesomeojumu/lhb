import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getKPIDetails, updateKPI } from "@services/kpiService";
import { useToast } from "@/components/feedback/ToastProvider";
import Spinner from "@components/feedback/Spinner";
import FormInput from "@components/forms/FormInput";
import DatePickerInput from "@components/forms/DatePickerInput";
import FormButtons from "@components/forms/FormButtons";
import routes from "@config/routesConfig";

const KPIEdit = () => {
  const { kpiId } = useParams();
  const { control, handleSubmit, reset } = useForm();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const data = await getKPIDetails(kpiId);
        reset(data);
      } catch {
        showToast("Failed to load KPI details", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchKPI();
  }, [kpiId, reset, showToast]);

  const onSubmit = async (data) => {
    try {
      await updateKPI(kpiId, data);
      showToast("KPI updated successfully!", "success");
      navigate(routes.kpis);
    } catch {
      showToast("Failed to update KPI", "error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Card>
        <CardContent>
          <Typography variant="h5" mb={2} fontWeight="bold">
            Edit KPI
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput name="title" label="Title" control={control} />
            <FormInput name="description" label="Description" control={control} />
            <FormInput name="target" label="Target" control={control} />
            <DatePickerInput name="deadline" label="Deadline" control={control} />
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

export default KPIEdit;
