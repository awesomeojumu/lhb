import React from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  FormHelperText,
} from "@mui/material";

const MultiSelectInput = ({ name, control, label, options = [], rules = {} }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <Select
              {...field}
              multiple
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              error={!!error}
            >
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

export default MultiSelectInput;
