import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { getAllEvaluations } from '../services/api';
import { getCurrentUser } from '../utils/session';

export default function StudentProgress() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          setError('로그인이 필요합니다.');
          return;
        }
        const data = await getAllEvaluations();
        const filtered = data.filter((e: any) => e.studentId === currentUser.userId);
        setEvaluations(filtered);
        setError(null);
      } catch (err: any) {
        console.error('학습 이력 로드 실패:', err);
        setError(err.message || '학습 이력을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/student/dashboard')}>
          대시보드로 돌아가기
        </Button>
      </Box>
    );
  }

  if (evaluations.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          학습 이력
        </Typography>
        <Alert severity="info">아직 학습 이력이 없습니다.</Alert>
      </Box>
    );
  }

  const progressChartData = evaluations.slice(0, 10).reverse().map((e: any, index: number) => ({
    name: `${index + 1}회`,
    점수: e.totalScore,
  }));

  const recent = evaluations[0];
  const radarChartData = recent ? [
    {
      subject: '대상도서\n분석력',
      score: recent.bookAnalysisScore,
      fullMark: 25,
    },
    {
      subject: '창의적\n사고력',
      score: recent.creativeThinkingScore,
      fullMark: 25,
    },
    {
      subject: '문제\n해결력',
      score: recent.problemSolvingScore,
      fullMark: 25,
    },
    {
      subject: '문장력/\n표현력',
      score: recent.expressionScore,
      fullMark: 25,
    },
  ] : [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        학습 이력
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              성장 추이
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="점수" stroke="#1976d2" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              최근 영역별 점수
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" style={{ fontSize: '12px' }} />
                <PolarRadiusAxis domain={[0, 25]} />
                <Radar
                  name="점수"
                  dataKey="score"
                  stroke="#1976d2"
                  fill="#1976d2"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
