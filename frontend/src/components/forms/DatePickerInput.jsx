import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const DatePickerInput = ({ name, control, label, rules = {} }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type="date"
          label={label}
          InputLabelProps={{ shrink: true }}
          error={!!error}
          helperText={error ? error.message : ""}
        />
      )}
    />
  );
};

export default DatePickerInput;
