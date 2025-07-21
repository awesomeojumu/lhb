import React from "react";
import { Toolbar, Typography, TextField, Button, Stack } from "@mui/material";

const TableToolbar = ({ title, onSearch, onAdd }) => {
  return (
    <Toolbar sx={{ justifyContent: "space-between" }}>
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
      <Stack direction="row" spacing={2}>
        <TextField
          size="small"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
        />
        {onAdd && (
          <Button variant="contained" color="primary" onClick={onAdd}>
            Add New
          </Button>
        )}
      </Stack>
    </Toolbar>
  );
};

export default TableToolbar;
