import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useToast } from "@context/ToastContext";
import { register as registerService } from "@services/authService";
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
    <Box
      sx={{
        height: "100vh", // ✅ full-screen height
        display: "flex",
        justifyContent: "center", // ✅ center horizontally
        alignItems: "center", // ✅ center vertically
        backgroundColor: "#f9f9f9", // light background for contrast
        p: 2, // padding for mobile responsiveness
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={3} fontWeight="bold">
            Register
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ✅ Stack automatically spaces fields */}
            <Stack spacing={2}>
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
            </Stack>

            {/* ✅ Extra space before buttons */}
            <FormButtons
              isSubmitting={false}
              onCancel={() => navigate(routes.login)}
              sx={{ mt: 3 }}
            />
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
