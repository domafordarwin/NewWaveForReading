import React, { useState } from "react";
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  VpnKey,
  School,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getUserByEmail } from "../services/api";
import { setCurrentUser } from "../utils/session";
import type { StoredUserType } from "../utils/session";

type UserType = "student" | "teacher" | "parent" | "admin";

interface LoginForm {
  email: string;
  password: string;
  userType: UserType;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
    userType: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
    setError("");
  };

  const handleSelectChange = (event: SelectChangeEvent<UserType>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 입력 검증
    if (!formData.email || !formData.password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      setLoading(false);
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      setLoading(false);
      return;
    }

    try {
      const user = await getUserByEmail(formData.email);
      const normalizedType = String(
        user.userType || ""
      ).toLowerCase() as StoredUserType;
      const resolvedType = normalizedType || formData.userType;

      if (!resolvedType) {
        setError("사용자 정보를 확인할 수 없습니다.");
        setLoading(false);
        return;
      }

      if (resolvedType !== formData.userType) {
        setFormData((prev) => ({
          ...prev,
          userType: resolvedType,
        }));
      }

      if (user.isActive === false) {
        setError("비활성화된 계정입니다.");
        setLoading(false);
        return;
      }

      setCurrentUser({
        userId: user.userId,
        name: user.name,
        email: user.email,
        userType: resolvedType,
        isActive: user.isActive,
      });

      // 사용자 유형에 따라 다른 페이지로 이동
      switch (resolvedType) {
        case "student":
          navigate("/student/dashboard");
          break;
        case "teacher":
          navigate("/teacher/dashboard");
          break;
        case "parent":
          navigate("/parent/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 20% 10%, #93c5fd 0%, transparent 40%), radial-gradient(circle at 80% 0%, #f0abfc 0%, transparent 35%), linear-gradient(135deg, #111827 0%, #1f2937 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          {/* 로고 및 제목 */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <School
              sx={{
                fontSize: 64,
                color: "primary.main",
                mb: 2,
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              문해력 검사 플랫폼
            </Typography>
            <Typography variant="body2" color="text.secondary">
              독서 새물결 문해력 검사 시스템
            </Typography>
          </Box>

          {/* 에러 메시지 */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* 사용자 유형 선택 */}
              <FormControl fullWidth>
                <InputLabel>사용자 유형</InputLabel>
                <Select
                  name="userType"
                  value={formData.userType}
                  label="사용자 유형"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="student">학생</MenuItem>
                  <MenuItem value="teacher">교사</MenuItem>
                  <MenuItem value="parent">학부모</MenuItem>
                  <MenuItem value="admin">관리자</MenuItem>
                </Select>
              </FormControl>

              {/* 이메일 입력 */}
              <TextField
                fullWidth
                label="이메일"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@school.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* 비밀번호 입력 */}
              <TextField
                fullWidth
                label="비밀번호"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                autoComplete="current-password"
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #5568d3 30%, #63408b 90%)",
                  },
                }}
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>

              {/* 추가 링크 */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Link
                  href="#"
                  variant="body2"
                  underline="hover"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("비밀번호 찾기 기능은 준비 중입니다.");
                  }}
                >
                  비밀번호를 잊으셨나요?
                </Link>
                <Link
                  href="#"
                  variant="body2"
                  underline="hover"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("회원가입 기능은 준비 중입니다.");
                  }}
                >
                  회원가입
                </Link>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
