import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { login } from "../services/userservice"; 

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

  

    try {
      setLoading(true);

      // Gọi API login  
      const res = await login(username, password);

      console.log("Login thành công:", res);
      // Lưu token vào localStorage 
      localStorage.setItem("token", res.data); 
      // Redirect sang trang 
      window.location.href = "/postmanagement";
    } catch (err: any) {
      console.error("Login thất bại:", err);
      setError(err?.message || "Sai username hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={4}
          sx={{ p: 4, borderRadius: 3, textAlign: "center" }}
        >
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Đăng nhập
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Chào mừng bạn trở lại 👋
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              type="text"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              fullWidth
              label="Mật khẩu"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 3, py: 1.2, fontWeight: "bold", borderRadius: 2 }}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <Typography variant="body2" mt={2}>
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontWeight: 500,
                }}
              >
                Đăng ký ngay
              </a>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
