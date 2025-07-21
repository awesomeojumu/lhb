import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { getProfile, updateProfile } from "@services/userService";
import { useToast } from "@context/ToastContext";
import Spinner from "@components/feedback/Spinner";
import FormInput from "@components/forms/FormInput";
import SelectInput from "@components/forms/SelectInput";
import CheckboxInput from "@components/forms/CheckboxInput";
import DatePickerInput from "@components/forms/DatePickerInput";
import FormButtons from "@components/forms/FormButtons";
import {
  sexOptions,
  ageBrackets,
  battalions,
  leadershipRoles,
} from "@config/roles";
import { profileFields } from "@config/forms";

const Profile = () => {
  const { control, handleSubmit, reset } = useForm();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        reset(data);
      } catch (err) {
        showToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset, showToast]);

  const onSubmit = async (formData) => {
    try {
      await updateProfile(formData);
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      showToast("Profile update failed!", "error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Card>
        <CardContent>
          <Typography variant="h5" mb={2} fontWeight="bold">
            My Profile
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {profileFields.map((field) => {
              switch (field.type) {
                case "select":
                  return (
                    <SelectInput
                      key={field.name}
                      {...field}
                      control={control}
                      options={
                        field.optionsKey === "sexOptions"
                          ? sexOptions
                          : field.optionsKey === "ageBrackets"
                          ? ageBrackets
                          : battalions
                      }
                    />
                  );
                case "multi-select":
                  return (
                    <SelectInput
                      key={field.name}
                      {...field}
                      control={control}
                      multiple
                      options={leadershipRoles}
                    />
                  );
                case "checkbox":
                  return (
                    <CheckboxInput key={field.name} {...field} control={control} />
                  );
                case "date":
                  return (
                    <DatePickerInput key={field.name} {...field} control={control} />
                  );
                default:
                  return <FormInput key={field.name} {...field} control={control} />;
              }
            })}
            <FormButtons isSubmitting={false} onCancel={() => reset()} />
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
