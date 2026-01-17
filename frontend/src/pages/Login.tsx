import { useState } from "react";
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
  Chip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  VpnKey,
  Face,
  FamilyRestroom,
  AdminPanelSettings,
  Assignment,
  Quiz,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getUserByEmail } from "../services/userService";
import { setCurrentUser, getDefaultPathByUserType } from "../utils/session";
import type { UserType } from "../types";
import { UserTypeLabels } from "../types";

interface LoginForm {
  email: string;
  password: string;
  userType: UserType;
}

// 사용자 타입별 아이콘
const userTypeIcons: Record<UserType, React.ReactNode> = {
  STUDENT: <Face />,
  PARENT: <FamilyRestroom />,
  SCHOOL_ADMIN: <AdminPanelSettings />,
  ASSESSMENT_TEACHER: <Assignment />,
  QUESTION_DEVELOPER: <Quiz />,
  SYSTEM_ADMIN: <Settings />,
};

// 테스트 계정 정보
const testAccounts: Record<UserType, { email: string; password: string; label: string }> = {
  STUDENT: { email: "student1@example.com", password: "test1234", label: "학생" },
  PARENT: { email: "parent1@example.com", password: "test1234", label: "학부모" },
  SCHOOL_ADMIN: { email: "schooladmin1@example.com", password: "test1234", label: "학교관리자" },
  ASSESSMENT_TEACHER: { email: "teacher1@example.com", password: "test1234", label: "진단교사" },
  QUESTION_DEVELOPER: { email: "questiondev1@example.com", password: "test1234", label: "문항개발" },
  SYSTEM_ADMIN: { email: "admin1@example.com", password: "test1234", label: "시스템관리자" },
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
    userType: "STUDENT",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSelectChange = (event: SelectChangeEvent<UserType>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      const user = await getUserByEmail(formData.email);

      if (!user) {
        setError("사용자를 찾을 수 없습니다.");
        setLoading(false);
        return;
      }

      const userType = user.user_type as UserType;

      if (user.is_active === false) {
        setError("비활성화된 계정입니다.");
        setLoading(false);
        return;
      }

      setCurrentUser({
        userId: user.user_id,
        name: user.name,
        email: user.email,
        userType: userType,
        schoolId: user.school_id,
        schoolName: user.school_name,
        grade: user.grade,
        studentGradeLevel: user.student_grade_level,
        isActive: user.is_active,
      });

      const defaultPath = getDefaultPathByUserType(userType);
      navigate(defaultPath);
    } catch (err) {
      console.error('Login error:', err);
      setError("로그인에 실패했습니다. 이메일을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const fillTestData = (type: UserType) => {
    const account = testAccounts[type];
    setFormData({
      email: account.email,
      password: account.password,
      userType: type,
    });
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
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="리딩 PRO 로고"
              sx={{
                width: 180,
                height: 180,
                objectFit: "contain",
                mb: 3,
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.3, mt: 1 }}>
              리딩 PRO
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight="medium" sx={{ mt: 0.5 }}>
              문해력 진단 및 클리닉 프로그램
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>사용자 유형</InputLabel>
                <Select
                  name="userType"
                  value={formData.userType}
                  label="사용자 유형"
                  onChange={handleSelectChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {userTypeIcons[selected]}
                      <span>{UserTypeLabels[selected]}</span>
                    </Box>
                  )}
                >
                  <MenuItem value="STUDENT">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Face /> 학생 회원
                    </Box>
                  </MenuItem>
                  <MenuItem value="PARENT">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FamilyRestroom /> 학부모
                    </Box>
                  </MenuItem>
                  <MenuItem value="SCHOOL_ADMIN">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AdminPanelSettings /> 학교 관리자
                    </Box>
                  </MenuItem>
                  <MenuItem value="ASSESSMENT_TEACHER">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Assignment /> 독서 진단 담당 교사
                    </Box>
                  </MenuItem>
                  <MenuItem value="QUESTION_DEVELOPER">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Quiz /> 독서 진단 문항 개발 교사
                    </Box>
                  </MenuItem>
                  <MenuItem value="SYSTEM_ADMIN">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Settings /> 시스템 관리자
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

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
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

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
                  background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #5568d3 30%, #63408b 90%)",
                  },
                }}
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Link href="#" variant="body2" underline="hover" onClick={(e) => e.preventDefault()}>
                  비밀번호를 잊으셨나요?
                </Link>
                <Link href="#" variant="body2" underline="hover" onClick={(e) => e.preventDefault()}>
                  회원가입
                </Link>
              </Box>
            </Box>
          </form>

          <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #e0e0e0" }}>
            <Typography variant="body2" color="text.secondary" gutterBottom textAlign="center">
              테스트 계정 (개발용)
            </Typography>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap", mt: 2 }}>
              {(Object.keys(testAccounts) as UserType[]).map((type) => (
                <Chip
                  key={type}
                  icon={userTypeIcons[type] as React.ReactElement}
                  label={testAccounts[type].label}
                  onClick={() => fillTestData(type)}
                  variant="outlined"
                  clickable
                  size="small"
                  sx={{ fontSize: "0.75rem", "& .MuiChip-icon": { fontSize: "1rem" } }}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
