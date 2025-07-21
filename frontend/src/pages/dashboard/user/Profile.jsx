import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { getProfile, updateProfile } from "@services/userService";
import { useToast } from "@/components/feedback/ToastProvider";
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
  const { control, handleSubmit, reset, formState } = useForm();
  const { isSubmitting } = formState;
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  /** ✅ Map option keys to actual data */
  const getOptions = useCallback((key) => {
    const optionsMap = {
      sexOptions,
      ageBrackets,
      battalions,
      leadershipRoles,
    };
    return optionsMap[key] || [];
  }, []);

  /** ✅ Fetch Profile */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        reset(data || {});
      } catch (err) {
        console.error("Profile fetch error:", err);
        showToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset, showToast]);

  /** ✅ Submit Handler */
  const onSubmit = async (formData) => {
    try {
      await updateProfile(formData);
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Profile update error:", err);
      showToast("Profile update failed!", "error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", my: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" mb={2} fontWeight="bold">
            My Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Update your personal information below.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            {profileFields.map((field) => {
              const commonProps = {
                key: field.name,
                control,
                ...field,
                sx: { mb: 2 }, // ✅ spacing between fields
              };

              switch (field.type) {
                case "select":
                  return (
                    <SelectInput
                      {...commonProps}
                      options={getOptions(field.optionsKey)}
                    />
                  );

                case "multi-select":
                  return (
                    <SelectInput
                      {...commonProps}
                      multiple
                      options={getOptions("leadershipRoles")}
                    />
                  );

                case "checkbox":
                  return <CheckboxInput {...commonProps} />;

                case "date":
                  return <DatePickerInput {...commonProps} />;

                default:
                  return <FormInput {...commonProps} />;
              }
            })}

            <FormButtons
              isSubmitting={isSubmitting}
              onCancel={() => reset()}
            />
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
