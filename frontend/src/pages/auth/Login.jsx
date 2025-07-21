import React from "react";
import { useForm } from "react-hook-form";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { useToast } from "@/components/feedback/ToastProvider";
import { loginFields } from "@config/forms";
import routes from "@config/routesConfig";
import FormInput from "@components/forms/FormInput";
import FormButtons from "@components/forms/FormButtons";

const Login = () => {
  const { control, handleSubmit } = useForm();
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      showToast("Login successful!", "success");
      navigate(routes.dashboard);
    } catch (error) {
      showToast(error.message || "Login failed", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" mb={2} fontWeight="bold">
            Login
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {loginFields.map((field) => (
              <FormInput key={field.name} {...field} control={control} />
            ))}
            <FormButtons isSubmitting={false} onCancel={() => navigate("/")} />
            <Typography
              variant="body2"
              sx={{ mt: 2, cursor: "pointer", color: "primary.main" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
