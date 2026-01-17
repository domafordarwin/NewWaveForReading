import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  Assignment,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
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
  Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { getAssessmentsByStudentId, getAllEvaluations } from '../services/api';
import { getCurrentUser } from '../utils/session';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    averageScore: 0,
    assessmentCount: 0,
    percentileRank: 0,
  });

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          setError('로그인이 필요합니다.');
          setLoading(false);
          return;
        }

        const studentId = currentUser.userId;
        
        // 검사 목록 로드
        const assessmentData = await getAssessmentsByStudentId(studentId);
        setAssessments(assessmentData);
        
        // 평가 결과 로드
        const evaluationData = await getAllEvaluations();
        const studentEvaluations = evaluationData.filter((e: any) => e.studentId === currentUser.userId);
        setEvaluations(studentEvaluations);
        
        // 통계 계산
        if (studentEvaluations.length > 0) {
          const totalScore = studentEvaluations.reduce((sum: number, e: any) => sum + e.totalScore, 0);
          const avgScore = Math.round(totalScore / studentEvaluations.length);
          setStatistics({
            averageScore: avgScore,
            assessmentCount: studentEvaluations.length,
            percentileRank: 65, // 임시 백분위
          });
        }
        
        setError(null);
      } catch (err: any) {
        console.error('데이터 로드 실패:', err);
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  
  // 진행 중인 검사
  const ongoingAssessments = assessments.filter(
    (a) => a.status === 'IN_PROGRESS'
  );
  
  // 대기 중인 검사
  const pendingAssessments = assessments.filter(
    (a) => a.status === 'NOT_STARTED'
  );
  
  // 최근 평가 결과
  const recentEvaluation = evaluations.length > 0 ? evaluations[0] : null;
  
  // 성장 추이 차트 데이터
  const progressChartData = evaluations.slice(0, 5).reverse().map((e: any, index: number) => ({
    name: `${index + 1}회`,
    점수: e.totalScore,
  }));
  
  // 영역별 레이더 차트 데이터
  const radarChartData = recentEvaluation ? [
    {
      subject: '대상도서\n분석력',
      score: recentEvaluation.bookAnalysisScore,
      fullMark: 25,
    },
    {
      subject: '창의적\n사고력',
      score: recentEvaluation.creativeThinkingScore,
      fullMark: 25,
    },
    {
      subject: '문제\n해결력',
      score: recentEvaluation.problemSolvingScore,
      fullMark: 25,
    },
    {
      subject: '문장력/\n표현력',
      score: recentEvaluation.expressionScore,
      fullMark: 25,
    },
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'warning';
      case 'NOT_STARTED':
        return 'default';
      case 'SUBMITTED':
        return 'info';
      case 'EVALUATED':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return '진행 중';
      case 'NOT_STARTED':
        return '대기 중';
      case 'SUBMITTED':
        return '제출 완료';
      case 'EVALUATED':
        return '평가 완료';
      default:
        return status;
    }
  };

  // 로딩 중
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        대시보드
      </Typography>

      {/* 통계 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.main',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUp sx={{ mr: 1 }} />
              <Typography variant="h6">평균 점수</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {statistics.averageScore}점
            </Typography>
            <Typography variant="body2" sx={{ mt: 'auto' }}>
              상위 {100 - statistics.percentileRank}%
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.main',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircle sx={{ mr: 1 }} />
              <Typography variant="h6">완료한 검사</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {statistics.assessmentCount}회
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'warning.main',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Schedule sx={{ mr: 1 }} />
              <Typography variant="h6">진행 중</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {ongoingAssessments.length}건
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'info.main',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Assignment sx={{ mr: 1 }} />
              <Typography variant="h6">대기 중</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {pendingAssessments.length}건
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 차트 영역 */}
      {evaluations.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
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
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="점수"
                    stroke="#1976d2"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                영역별 점수
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
      )}

      {/* 검사 목록 */}
      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
        검사 목록
      </Typography>
      
      {assessments.length === 0 ? (
        <Alert severity="info">
          아직 배정된 검사가 없습니다.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {assessments.map((assessment) => (
            <Grid item xs={12} md={6} lg={4} key={assessment.assessmentId}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {assessment.topic?.topicText?.substring(0, 50) || '검사'}...
                    </Typography>
                    <Chip
                      label={getStatusText(assessment.status)}
                      color={getStatusColor(assessment.status)}
                      size="small"
                    />
                  </Box>
                  <Typography color="text.secondary" gutterBottom>
                    도서: {assessment.topic?.book?.title || '미정'}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        제한 시간: {assessment.timeLimitMinutes}분
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {assessment.wordCountMin}-{assessment.wordCountMax}자
                      </Typography>
                    </Box>
                    {assessment.status === 'IN_PROGRESS' && (
                      <Box sx={{ mb: 1 }}>
                        <LinearProgress variant="determinate" value={45} />
                        <Typography variant="caption" color="text.secondary">
                          진행률: 45%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
                <CardActions>
                  {assessment.status === 'NOT_STARTED' && (
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/student/assessment/${assessment.assessmentId}`)}
                    >
                      시작하기
                    </Button>
                  )}
                  {assessment.status === 'IN_PROGRESS' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      fullWidth
                      onClick={() => navigate(`/student/assessment/${assessment.assessmentId}`)}
                    >
                      이어서 작성
                    </Button>
                  )}
                  {assessment.status === 'EVALUATED' && (
                    <Button
                      size="small"
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate(`/student/result/${assessment.assessmentId}`)}
                    >
                      결과 보기
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
