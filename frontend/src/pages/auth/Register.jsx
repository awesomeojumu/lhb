import React from "react";
import { useForm } from "react-hook-form";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { register as registerService } from "@services/authService";
import { useToast } from "@context/ToastContext";
import { useNavigate } from "react-router-dom";
import { registerFields } from "@config/forms";
import routes from "@config/routesConfig";
import FormInput from "@components/forms/FormInput";
import SelectInput from "@components/forms/SelectInput";
import { battalions } from "@config/roles";
import FormButtons from "@components/forms/FormButtons";

const Register = () => {
  const { control, handleSubmit } = useForm();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerService(data);
      showToast("Registration successful!", "success");
      navigate(routes.login);
    } catch (error) {
      showToast(error.message || "Registration failed", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" mb={2} fontWeight="bold">
            Register
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {registerFields.map((field) =>
              field.type === "select" ? (
                <SelectInput
                  key={field.name}
                  {...field}
                  control={control}
                  options={battalions}
                />
              ) : (
                <FormInput key={field.name} {...field} control={control} />
              )
            )}
            <FormButtons isSubmitting={false} onCancel={() => navigate(routes.login)} />
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
