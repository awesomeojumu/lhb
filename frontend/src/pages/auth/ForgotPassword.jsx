import React from "react";
import { useForm } from "react-hook-form";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { forgotPassword } from "@services/authService";
import { useToast } from "@/components/feedback/ToastProvider"; ;
import FormInput from "@components/forms/FormInput";
import FormButtons from "@components/forms/FormButtons";

const ForgotPassword = () => {
  const { control, handleSubmit } = useForm();
  const { showToast } = useToast();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      showToast("Password reset email sent!", "success");
    } catch (error) {
      showToast(error.message || "Failed to send reset email", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" mb={2} fontWeight="bold">
            Forgot Password
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              name="email"
              label="Email"
              type="email"
              control={control}
              rules={{ required: "Email is required" }}
            />
            <FormButtons isSubmitting={false} onCancel={() => window.history.back()} />
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
