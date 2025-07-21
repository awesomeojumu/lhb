import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import { useToast } from "@/components/feedback/ToastProvider"; ;

const Settings = () => {
  const { showToast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    showToast("Settings saved successfully!", "success");
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "0 auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Settings
        </Typography>

        <Stack spacing={2} mt={2}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
            }
            label="Enable Dark Mode"
          />

          <Divider />

          <FormControlLabel
            control={
              <Switch
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            }
            label="Enable Email Notifications"
          />

          <Divider />

          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Settings;
