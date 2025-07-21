import React from "react";
import { Button, Stack } from "@mui/material";

const FormButtons = ({ isSubmitting, onCancel }) => {
  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
      <Button variant="outlined" color="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </Stack>
  );
};

export default FormButtons;
