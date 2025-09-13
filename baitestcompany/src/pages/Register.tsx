import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { register } from "../services/UserService";

const DangKi: React.FC = () => {
  // State cho form
  const [tenDangNhap, setTenDangNhap] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [hoTen, setHoTen] = useState<string>("");
  const [matKhau, setMatKhau] = useState<string>("");
  const [matKhauLapLai, setMatKhauLapLai] = useState<string>("");
  const [thongBao, setThongBao] = useState<string>("");

  // State lỗi
  const [errorTenDangNhap, setErrorTenDangNhap] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorMatKhau, setErrorMatKhau] = useState<string>("");
  const [errorMatKhauLapLai, setErrorMatKhauLapLai] = useState<string>("");

  // ======================= API CHECK Email, Username =======================
  const kiemTraTenDangNhapDaTonTai = async (tenDangNhap: string) => {
    const url = `http://localhost:8080/auth/exists/username/${tenDangNhap}`;
    try {
      const respone = await fetch(url);
      const data = await respone.text(); // backend trả true/false
      if (data === "true") {
        setErrorTenDangNhap("Tên đăng nhập đã tồn tại");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const kiemTraEmailDaTonTai = async (email: string) => {
    const url = `http://localhost:8080/auth/exists/email/${email}`;
    try {
      const respone = await fetch(url);
      const data = await respone.text();
      if (data === "true") {
        setErrorEmail("Email đã tồn tại");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const kiemTraMatKhau = (matKhau: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(matKhau)) {
      setErrorMatKhau("Mật khẩu >= 8 ký tự và có ít nhất 1 ký tự đặc biệt");
      return false;
    }
    return true;
  };

  const kiemTraMatKhauLapLai = (matKhauLapLai: string) => {
    if (matKhauLapLai !== matKhau) {
      setErrorMatKhauLapLai("Mật khẩu nhập lại không khớp");
      return false;
    }
    return true;
  };

  // ======================= HANDLE =======================
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorTenDangNhap("");
    setErrorEmail("");
    setErrorMatKhau("");
    setErrorMatKhauLapLai("");
    setThongBao("");

    const isTenDangNhapValid = !(await kiemTraTenDangNhapDaTonTai(tenDangNhap));
    const isEmailValid = !(await kiemTraEmailDaTonTai(email));
    const isMatKhauValid = kiemTraMatKhau(matKhau);
    const isMatKhauLapLaiValid = kiemTraMatKhauLapLai(matKhauLapLai);

    if (isTenDangNhapValid && isEmailValid && isMatKhauValid && isMatKhauLapLaiValid) {
      try {
        const result = await register({
          username: tenDangNhap,
          email: email,
          password: matKhau,
          fullName: hoTen,
        });

        setThongBao("Tài khoản đăng ký thành công");
        console.log("Register result:", result);
        window.location.href = "/login";

        // reset form
        setTenDangNhap("");
        setEmail("");
        setMatKhau("");
        setMatKhauLapLai("");
        setHoTen("");
      } catch (error: any) {
        console.error("Register error:", error);
        setThongBao(error?.message || "Đăng ký thất bại, vui lòng thử lại");
      }
    }
  };



  // ======================= UI =======================
  return (
    <Container maxWidth="md">
      <Paper elevation={4} sx={{ p: 4, mt: 6, borderRadius: 3 }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Đăng ký tài khoản
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Cột trái */}
            <Grid sx={{ xs: '12', md: '6' }}>
              <TextField
                label="Họ Tên"
                fullWidth
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Tên đăng nhập"
                fullWidth
                value={tenDangNhap}
                onChange={(e) => setTenDangNhap(e.target.value)}
                error={!!errorTenDangNhap}
                helperText={errorTenDangNhap}
                margin="normal"
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errorEmail}
                helperText={errorEmail}
                margin="normal"
              />
              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                error={!!errorMatKhau}
                helperText={errorMatKhau}
                margin="normal"
              />
              <TextField
                label="Nhập lại mật khẩu"
                type="password"
                fullWidth
                value={matKhauLapLai}
                onChange={(e) => setMatKhauLapLai(e.target.value)}
                error={!!errorMatKhauLapLai}
                helperText={errorMatKhauLapLai}
                margin="normal"
              />
            </Grid>

          </Grid>

          {/* Submit */}
          <Box textAlign="center" mt={4}>
            <Button type="submit" variant="contained" size="large">
              Đăng ký
            </Button>
          </Box>

          {/* Thông báo */}
          {thongBao && (
            <Typography
              variant="body1"
              color={thongBao.includes("thành công") ? "green" : "error"}
              align="center"
              mt={3}
            >
              {thongBao}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default DangKi;
