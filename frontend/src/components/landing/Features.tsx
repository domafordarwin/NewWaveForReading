import { Box, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import { AutoAwesome, TrendingUp, PersonalVideo } from '@mui/icons-material';

export default function Features() {
  const features = [
    {
      icon: <AutoAwesome />,
      title: '실시간 AI 첨삭',
      description: '맞춤법부터 논리까지 종합 분석',
      color: '#6366F1',
    },
    {
      icon: <TrendingUp />,
      title: '성장 추적',
      description: '과거 결과와 비교하여 발전 확인',
      color: '#10B981',
    },
    {
      icon: <PersonalVideo />,
      title: '맞춤 피드백',
      description: '약점 보완을 위한 학습 자료 추천',
      color: '#EC4899',
    },
  ];

  return (
    <Box sx={{ py: 10, background: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              textAlign: 'center',
              color: 'text.primary',
            }}
          >
            핵심 기능
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: 'grey.200',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: `0 20px 40px -10px ${feature.color}40`,
                      borderColor: feature.color,
                    },
                  }}
                >
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `${feature.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        color: feature.color,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.7,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
