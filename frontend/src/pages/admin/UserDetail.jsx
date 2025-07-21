import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "@services/userService";
import { useToast } from "@context/ToastContext";
import { Card, CardContent, Typography } from "@mui/material";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setUser(data);
      } catch (error) {
        showToast(error.message, "error");
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <p style={{ padding: "20px" }}>Loading user details...</p>;

  return (
    <Card sx={{ maxWidth: 400, margin: "20px" }}>
      <CardContent>
        <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>Role: {user.role}</Typography>
        <Typography>Battalion: {user.battalion || "N/A"}</Typography>
        <Typography>Phone: {user.phone || "N/A"}</Typography>
        <Typography>Country: {user.country || "N/A"}</Typography>
      </CardContent>
    </Card>
  );
}
