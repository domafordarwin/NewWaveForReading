import { Box, Container, Typography, Button, Stack, keyframes } from '@mui/material';
import { PlayArrow, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)',
        backgroundSize: '200% 200%',
        animation: `${gradientShift} 15s ease infinite`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          fontSize: '60px',
          opacity: 0.3,
          animation: `${float} 3s ease-in-out infinite`,
        }}
      >
        📚
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          right: '15%',
          fontSize: '50px',
          opacity: 0.3,
          animation: `${float} 4s ease-in-out infinite`,
          animationDelay: '1s',
        }}
      >
        ✍️
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.2,
              textShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            AI가 1분 만에 분석하는
            <br />
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(to right, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              당신의 문해력
            </Box>
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              color: 'rgba(255,255,255,0.95)',
              maxWidth: '700px',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            EBS 독서논술 기준으로 즉시 첨삭받고,
            <br />
            또래 대비 내 위치를 확인하세요
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/student/dashboard')}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
                animation: `${pulse} 2s infinite`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 30px -5px rgba(99, 102, 241, 0.5)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              무료로 시작하기
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PlayArrow />}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'white',
                borderColor: 'white',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: 'white',
                  background: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              2분 데모 보기
            </Button>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ mt: 2, color: 'white' }}
          >
            <Typography sx={{ fontSize: '1.2rem' }}>⭐⭐⭐⭐⭐</Typography>
            <Typography sx={{ fontSize: '0.95rem', opacity: 0.9 }}>
              이미 10,000명이 사용 중 | 평균 평점 4.8/5.0
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
