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
    if (!kpiId) {
      setError("Invalid KPI ID");
      setLoading(false);
      return;
    }

    const fetchKPI = async () => {
      try {
        const data = await getKPIDetails(kpiId);
        setKpi(data);
      } catch {
        setError("Failed to load KPI details");
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
        <Typography color="error" variant="body1">{error}</Typography>
      </Box>
    );
  }

  if (!kpi) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: "center" }}>
        <Typography color="text.secondary">No KPI details available.</Typography>
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
          <Typography variant="body1" gutterBottom>
            {kpi.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Target: {kpi.target}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Deadline: {new Date(kpi.deadline).toDateString()}
          </Typography>
          {/* Status is not in the KPI model, so fallback to Pending */}
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
