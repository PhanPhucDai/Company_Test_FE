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
import { register } from "../../services/userservice";
 
const DangKi: React.FC = () => {
  const [form, setForm] = useState({
    hoTen: "",
    tenDangNhap: "",
    email: "",
    matKhau: "",
    matKhauLapLai: "",
  });

  const [errors, setErrors] = useState({
    hoTen: "",
    tenDangNhap: "",
    email: "",
    matKhau: "",
    matKhauLapLai: "",
  });

  const [thongBao, setThongBao] = useState({ msg: "", type: "" }); // type: "success" | "error"

  // ======================= VALIDATION =======================
  const validateForm = async () => {
    let valid = true;
    const newErrors = { ...errors };

    // Họ tên
    if (!form.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống";
      valid = false;
    } else newErrors.hoTen = "";

    // Tên đăng nhập
    if (!form.tenDangNhap.trim()) {
      newErrors.tenDangNhap = "Tên đăng nhập không được để trống";
      valid = false;
    } else {
      // Check backend tồn tại
      try {
        const resp = await fetch(
          `https://companytest.onrender.com/auth/exists/username/${form.tenDangNhap}`
        );
        const exists = await resp.text();
        if (exists === "true") {
          newErrors.tenDangNhap = "Tên đăng nhập đã tồn tại";
          valid = false;
        } else newErrors.tenDangNhap = "";
      } catch {
        newErrors.tenDangNhap = "Lỗi kiểm tra username";
        valid = false;
      }
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống";
      valid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
      valid = false;
    } else {
      try {
        const resp = await fetch(
          `https://companytest.onrender.com/exists/email/${form.email}`
        );
        const exists = await resp.text();
        if (exists === "true") {
          newErrors.email = "Email đã tồn tại";
          valid = false;
        } else newErrors.email = "";
      } catch {
        newErrors.email = "Lỗi kiểm tra email";
        valid = false;
      }
    }

    // Mật khẩu
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!form.matKhau.trim()) {
      newErrors.matKhau = "Mật khẩu không được để trống";
      valid = false;
    } else if (!passwordRegex.test(form.matKhau)) {
      newErrors.matKhau =
        "Mật khẩu >= 8 ký tự và ít nhất 1 ký tự đặc biệt";
      valid = false;
    } else newErrors.matKhau = "";

    // Mật khẩu nhập lại
    if (form.matKhauLapLai !== form.matKhau) {
      newErrors.matKhauLapLai = "Mật khẩu nhập lại không khớp";
      valid = false;
    } else newErrors.matKhauLapLai = "";

    setErrors(newErrors);
    return valid;
  };

  // ======================= HANDLE =======================
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setThongBao({ msg: "", type: "" });

    if (await validateForm()) {
      try {
        await register({
          username: form.tenDangNhap,
          email: form.email,
          password: form.matKhau,
          fullName: form.hoTen,
        });
        setThongBao({ msg: "Đăng ký thành công!", type: "success" });
        // Reset form
        setForm({
          hoTen: "",
          tenDangNhap: "",
          email: "",
          matKhau: "",
          matKhauLapLai: "",
        });
        setTimeout(() => (window.location.href = "/login"), 1500);
      } catch (error: any) {
        setThongBao({
          msg: error?.message || "Đăng ký thất bại, vui lòng thử lại",
          type: "error",
        });
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
            <Grid sx={{ xs: "12", md: "6" }}>
              <TextField
                label="Họ Tên"
                fullWidth
                margin="normal"
                value={form.hoTen}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, hoTen: e.target.value }))
                }
                error={!!errors.hoTen}
                helperText={errors.hoTen}
              />
              <TextField
                label="Tên đăng nhập"
                fullWidth
                margin="normal"
                value={form.tenDangNhap}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, tenDangNhap: e.target.value }))
                }
                error={!!errors.tenDangNhap}
                helperText={errors.tenDangNhap}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                margin="normal"
                value={form.matKhau}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, matKhau: e.target.value }))
                }
                error={!!errors.matKhau}
                helperText={errors.matKhau}
              />
              <TextField
                label="Nhập lại mật khẩu"
                type="password"
                fullWidth
                margin="normal"
                value={form.matKhauLapLai}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    matKhauLapLai: e.target.value,
                  }))
                }
                error={!!errors.matKhauLapLai}
                helperText={errors.matKhauLapLai}
              />
            </Grid>
          </Grid>

          <Box textAlign="center" mt={4}>
            <Button type="submit" variant="contained" size="large">
              Đăng ký
            </Button>
          </Box>
          <Typography variant="body2" mt={2}>
            Bạn đã có tài khoản ? {" "}
            <a
              href="/login"
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontWeight: 500,
              }}
            >
              Đăng nhập
            </a>
          </Typography>
          {thongBao.msg && (
            <Typography
              variant="body1"
              color={thongBao.type === "success" ? "green" : "error"}
              align="center"
              mt={3}
            >
              {thongBao.msg}
            </Typography>
          )}
        </Box>
      </Paper>

    </Container>
  );
};

export default DangKi;
