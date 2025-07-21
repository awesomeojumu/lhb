import React from "react";
import { useForm } from "react-hook-form";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "@services/authService";
import { useToast } from "@/components/feedback/ToastProvider"; ;
import FormInput from "@components/forms/FormInput";
import FormButtons from "@components/forms/FormButtons";
import routes from "@config/routesConfig";

const ResetPassword = () => {
  const { control, handleSubmit } = useForm();
  const { token } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await resetPassword(token, data.password);
      showToast("Password reset successfully!", "success");
      navigate(routes.login);
    } catch (error) {
      showToast(error.message || "Password reset failed", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" mb={2} fontWeight="bold">
            Reset Password
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              name="password"
              label="New Password"
              type="password"
              control={control}
              rules={{ required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } }}
            />
            <FormButtons isSubmitting={false} onCancel={() => navigate(routes.login)} />
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPassword;
