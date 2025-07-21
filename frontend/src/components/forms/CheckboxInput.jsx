import React from "react";
import { Controller } from "react-hook-form";
import { FormControlLabel, Checkbox, FormHelperText } from "@mui/material";

const CheckboxInput = ({ name, control, label, rules = {} }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <>
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value || false} />}
            label={label}
          />
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </>
      )}
    />
  );
};

export default CheckboxInput;
