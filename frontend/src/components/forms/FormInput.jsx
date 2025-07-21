import React from "react";
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const FormInput = ({ name, control, label, type = "text", rules = {}, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          label={label}
          error={!!error}
          helperText={error ? error.message : ""}
          {...rest}
        />
      )}
    />
  );
};

export default FormInput;
