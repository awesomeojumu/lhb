import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const KPIAssignModal = ({ open, onClose, onSave, ranks = [] }) => {
  const [selectedRank, setSelectedRank] = useState("");

  const handleSave = () => {
    if (!selectedRank) return;
    onSave(selectedRank);
    setSelectedRank("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign KPI Creator (Rank)</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Rank</InputLabel>
          <Select
            value={selectedRank}
            onChange={(e) => setSelectedRank(e.target.value)}
            label="Rank"
          >
            {ranks.map((rank) => (
              <MenuItem key={rank} value={rank}>
                {rank}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KPIAssignModal;
