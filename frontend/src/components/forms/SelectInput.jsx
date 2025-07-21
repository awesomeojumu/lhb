import React from "react";
import { Controller } from "react-hook-form";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

const SelectInput = ({ name, control, label, options = [], rules = {} }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <Select {...field} label={label} error={!!error}>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText error>{error.message}</FormHelperText>}
          </>
        )}
      />
    </FormControl>
  );
};

export default SelectInput;
