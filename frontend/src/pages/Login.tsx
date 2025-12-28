import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  Chip,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  Person,
  VpnKey,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getUserByEmail } from '../services/api';
import { setCurrentUser } from '../utils/session';
import type { StoredUserType } from '../utils/session';

type UserType = 'student' | 'teacher' | 'parent' | 'admin';

interface LoginForm {
  email: string;
  password: string;
  userType: UserType;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    userType: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
    setError('');
  };

  const handleSelectChange = (event: SelectChangeEvent<UserType>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 입력 검증
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      setLoading(false);
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      setLoading(false);
      return;
    }

    try {
      const user = await getUserByEmail(formData.email);
      const normalizedType = String(user.userType || '').toLowerCase() as StoredUserType;
      const resolvedType = normalizedType || formData.userType;

      if (!resolvedType) {
        setError('사용자 정보를 확인할 수 없습니다.');
        setLoading(false);
        return;
      }

      if (resolvedType !== formData.userType) {
        setFormData(prev => ({
          ...prev,
          userType: resolvedType,
        }));
      }

      if (user.isActive === false) {
        setError('비활성화된 계정입니다.');
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
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'teacher':
          navigate('/teacher/dashboard');
          break;
        case 'parent':
          navigate('/parent/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const problemCards = [
    { title: '글을 써도 뭐가 문제인지 모르겠어요', emoji: '😰' },
    { title: '첨삭을 받으려면 며칠씩 기다려야 해요', emoji: '😓' },
    { title: '내 실력이 어느 정도인지 모르겠어요', emoji: '😣' },
  ];

  const features = [
    { title: '실시간 AI 첨삭', desc: '맞춤법부터 논리까지 1분 내 분석' },
    { title: '성장 추적', desc: '과거 결과와 비교해 발전 확인' },
    { title: '맞춤 피드백', desc: '약점 보완을 위한 학습 가이드' },
    { title: '또래 비교', desc: '백분위로 내 위치 확인' },
    { title: 'EBS 기준', desc: '공신력 있는 평가 기준 적용' },
    { title: '교사 도구', desc: '학생 관리 효율화' },
  ];

  const testimonials = [
    {
      name: '김민준 (고2)',
      quote: '논술 점수가 50점에서 78점으로 올랐어요. 어떻게 고쳐야 하는지 명확해졌습니다.',
      rating: 5,
    },
    {
      name: '박지연 (학부모)',
      quote: '아이의 학습 현황이 한눈에 보여 안심이 됐어요.',
      rating: 5,
    },
    {
      name: '이선생 (국어 교사)',
      quote: '첨삭 시간이 크게 줄고 학생 지도에 집중할 수 있어요.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'AI 첨삭이 정말 정확한가요?',
      a: 'EBS 독서논술 기준으로 설계되어 문장력과 논리성을 정밀하게 분석합니다.',
    },
    {
      q: '무료 체험 후 자동 결제되나요?',
      a: '아니요. 체험 종료 후 자동 결제되지 않습니다.',
    },
    {
      q: '개인정보는 안전한가요?',
      a: '모든 데이터는 암호화되어 안전하게 저장됩니다.',
    },
  ];

  // 테스트용 자동 입력
  const fillTestData = (type: UserType) => {
    const testAccounts = {
      student: { email: 'student1@example.com', password: 'student123' },
      teacher: { email: 'teacher1@example.com', password: 'teacher123' },
      parent: { email: 'parent1@example.com', password: 'parent123' },
      admin: { email: 'admin1@example.com', password: 'admin123' },
    };

    setFormData({
      ...testAccounts[type],
      userType: type,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(circle at 20% 10%, #93c5fd 0%, transparent 40%), radial-gradient(circle at 80% 0%, #f0abfc 0%, transparent 35%), linear-gradient(135deg, #111827 0%, #1f2937 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' },
            alignItems: 'stretch',
          }}
        >
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              alignSelf: 'center',
            }}
          >
            {/* 로고 및 제목 */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <School
                sx={{
                  fontSize: 64,
                  color: 'primary.main',
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
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
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5568d3 30%, #63408b 90%)',
                    },
                  }}
                >
                  {loading ? '로그인 중...' : '로그인'}
                </Button>

                {/* 추가 링크 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Link
                    href="#"
                    variant="body2"
                    underline="hover"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('비밀번호 찾기 기능은 준비 중입니다.');
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
                      alert('회원가입 기능은 준비 중입니다.');
                    }}
                  >
                    회원가입
                  </Link>
                </Box>
              </Box>
            </form>

            {/* 테스트 계정 빠른 입력 */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom textAlign="center">
                테스트 계정 (개발용)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fillTestData('student')}
                >
                  학생
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fillTestData('teacher')}
                >
                  교사
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fillTestData('parent')}
                >
                  학부모
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fillTestData('admin')}
                >
                  관리자
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* 랜딩 페이지 */}
          <Box
            sx={{
              borderRadius: 4,
              p: { xs: 2, md: 3 },
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'white',
              maxHeight: { md: 'calc(100vh - 80px)' },
              overflow: 'auto',
              backdropFilter: 'blur(14px)',
              '@keyframes gradientShift': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
              '@keyframes float': {
                '0%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-10px)' },
                '100%': { transform: 'translateY(0px)' },
              },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                color: 'white',
                background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 12s ease infinite',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ position: 'absolute', top: 16, right: 16, opacity: 0.8, animation: 'float 6s ease-in-out infinite' }}>
                📘
              </Box>
              <Box sx={{ position: 'absolute', bottom: 18, right: 40, opacity: 0.8, animation: 'float 7s ease-in-out infinite' }}>
                ✍️
              </Box>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ fontFamily: '"Gmarket Sans", "Pretendard", sans-serif', lineHeight: 1.1 }}
              >
                AI가 1분 만에 분석하는
                <br />
                당신의 문해력
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, color: 'rgba(255,255,255,0.9)' }}>
                EBS 독서논술 기준으로 즉시 첨삭받고, 또래 대비 내 위치를 확인하세요
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                <Button variant="contained" sx={{ bgcolor: 'white', color: '#4f46e5', fontWeight: 700 }}>
                  무료로 시작하기 →
                </Button>
                <Button variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.6)', color: 'white' }}>
                  ▶ 2분 데모 보기
                </Button>
              </Box>
              <Typography sx={{ mt: 3, fontSize: 14 }}>
                ⭐ 이미 10,000명이 사용 중 · 평균 평점 4.8/5.0
              </Typography>
            </Paper>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                대한민국 문해력 교육의 표준
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                {['EBS', '서울대', '교육부', '한국교육과정평가원'].map((label) => (
                  <Chip key={label} label={label} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.15)' }} />

            <Typography variant="h6" fontWeight={700}>
              이런 고민, 혹시 당신도 하고 있나요?
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {problemCards.map((card) => (
                <Grid item xs={12} md={4} key={card.title}>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', color: 'white' }}>
                    <Typography variant="h5">{card.emoji}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      "{card.title}"
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                이제 AI가 당신의 글쓰기 선생님입니다
              </Typography>
              <Paper sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', color: 'white' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="rgba(255,255,255,0.7)">Before</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      - 모호한 피드백
                      <br />
                      - 며칠 대기
                      <br />
                      - 주관적 평가
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="rgba(255,255,255,0.7)">After</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      - 1분 만에 결과
                      <br />
                      - 구체적 개선안
                      <br />
                      - 객관적 점수
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                단 3단계로 완성되는 문해력 분석
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {['글 작성', 'AI 분석', '결과 확인'].map((step, index) => (
                  <Grid item xs={12} md={4} key={step}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', color: 'white' }}>
                      <Typography variant="subtitle2">STEP {index + 1}</Typography>
                      <Typography variant="h6" sx={{ mt: 1 }}>{step}</Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.7)' }}>
                        {index === 0 && '논제를 보고 자유롭게 작성'}
                        {index === 1 && '맞춤법, 논리, 표현력 분석'}
                        {index === 2 && '영역별 점수와 개선안 제공'}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                6가지 핵심 기능
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {features.map((feature) => (
                  <Grid item xs={12} md={4} key={feature.title}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', color: 'white' }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.7)' }}>
                        {feature.desc}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                숫자로 증명하는 효과
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {[
                  { label: '사용자', value: '10,000+' },
                  { label: '평균 점수 향상', value: '23%' },
                  { label: '만족도', value: '98%' },
                ].map((item) => (
                  <Grid item xs={12} md={4} key={item.label}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', color: 'white', textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={800}>
                        {item.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {item.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                실제 사용자 후기
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {testimonials.map((item) => (
                  <Grid item xs={12} md={4} key={item.name}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', color: 'white' }}>
                      <Typography variant="body2">{'⭐'.repeat(item.rating)}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        "{item.quote}"
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'rgba(255,255,255,0.7)' }}>
                        - {item.name}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                요금제
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {[
                  { name: '무료 체험', price: 'FREE', perks: ['2회 검사', '기본 첨삭', '7일 제한'] },
                  { name: '학생 요금', price: '9,900원/월', perks: ['무제한 검사', '상세 분석', '성장 추적'] },
                  { name: '학교/학원', price: '협의', perks: ['대량 관리', '관리자 기능', 'API 지원'] },
                ].map((plan) => (
                  <Grid item xs={12} md={4} key={plan.name}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', color: 'white' }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {plan.name}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        {plan.price}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.7)' }}>
                        {plan.perks.join(' · ')}
                      </Typography>
                      <Button variant="outlined" size="small" sx={{ mt: 2, borderColor: 'rgba(255,255,255,0.6)', color: 'white' }}>
                        시작하기
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                자주 묻는 질문
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {faqs.map((item) => (
                  <Grid item xs={12} key={item.q}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', color: 'white' }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {item.q}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.7)' }}>
                        {item.a}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                }}
              >
                <Typography variant="h5" fontWeight={800}>
                  지금 바로 시작하세요
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.8)' }}>
                  첫 문해력 검사는 무료입니다. 신용카드 없이 시작하세요.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                  <TextField size="small" placeholder="이메일을 입력하세요" sx={{ bgcolor: 'white', borderRadius: 1 }} />
                  <Button variant="contained" sx={{ bgcolor: 'white', color: '#4f46e5', fontWeight: 700 }}>
                    무료로 시작하기 →
                  </Button>
                </Box>
              </Paper>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
              <Typography variant="caption">
                ⓒ 2025 문해력검사. All rights reserved.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );

};

export default Login;
