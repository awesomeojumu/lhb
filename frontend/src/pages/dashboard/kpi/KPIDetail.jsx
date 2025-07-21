import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import { useParams } from "react-router-dom";
import { getKPIDetails } from "@services/kpiService";
import Spinner from "@components/feedback/Spinner";

const KPIDetail = () => {
  const { kpiId } = useParams();
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!kpiId || kpiId.length !== 24) {
      setError("Invalid KPI ID");
      setLoading(false);
      return;
    }

    const fetchKPI = async () => {
      try {
        const data = await getKPIDetails(kpiId);
        setKpi(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load KPI details");
      } finally {
        setLoading(false);
      }
    };

    fetchKPI();
  }, [kpiId]);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: "center" }}>
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!kpi) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          No KPI details available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" mb={2} fontWeight="bold">
            {kpi.title}
          </Typography>
          {kpi.description && (
            <Typography variant="body1" gutterBottom>
              {kpi.description}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Target:</strong> {kpi.target}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Deadline:</strong>{" "}
            {kpi.deadline
              ? new Date(kpi.deadline).toLocaleDateString()
              : "No deadline"}
          </Typography>
          <Chip
            label={`Status: ${kpi.status || "Pending"}`}
            color={kpi.status === "Completed" ? "success" : "warning"}
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default KPIDetail;
