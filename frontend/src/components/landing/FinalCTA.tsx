import { Box, Container, Typography, Stack, Button, keyframes } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

export default function FinalCTA() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: 'white',
            }}
          >
            지금 바로 시작하세요
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            첫 문해력 검사는 무료입니다
          </Typography>

          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/student/dashboard')}
            sx={{
              px: 6,
              py: 2.5,
              fontSize: '1.2rem',
              fontWeight: 700,
              background: 'white',
              color: 'primary.main',
              animation: `${pulse} 2s infinite`,
              '&:hover': {
                background: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
              mt: 3,
            }}
          >
            무료로 시작하기
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
