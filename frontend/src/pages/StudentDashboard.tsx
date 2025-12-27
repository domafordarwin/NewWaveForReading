import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
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
import { mockAssessments, mockEvaluations, mockProgressHistory, mockStatistics } from '../../utils/mockData';
import { AssessmentStatus } from '../../types';

export default function StudentDashboard() {
  const navigate = useNavigate();
  
  // 진행 중인 검사
  const ongoingAssessments = mockAssessments.filter(
    (a) => a.status === AssessmentStatus.IN_PROGRESS
  );
  
  // 대기 중인 검사
  const pendingAssessments = mockAssessments.filter(
    (a) => a.status === AssessmentStatus.NOT_STARTED
  );
  
  // 최근 평가 결과
  const recentEvaluation = mockEvaluations[0];
  
  // 성장 추이 차트 데이터
  const progressChartData = mockProgressHistory.map((h, index) => ({
    name: `${index + 1}회`,
    점수: h.totalScore,
  }));
  
  // 영역별 레이더 차트 데이터
  const radarChartData = [
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
      score: recentEvaluation.languageExpressionScore,
      fullMark: 25,
    },
  ];

  const getStatusColor = (status: AssessmentStatus) => {
    switch (status) {
      case AssessmentStatus.IN_PROGRESS:
        return 'warning';
      case AssessmentStatus.NOT_STARTED:
        return 'default';
      case AssessmentStatus.SUBMITTED:
        return 'info';
      case AssessmentStatus.EVALUATED:
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: AssessmentStatus) => {
    switch (status) {
      case AssessmentStatus.IN_PROGRESS:
        return '진행 중';
      case AssessmentStatus.NOT_STARTED:
        return '대기 중';
      case AssessmentStatus.SUBMITTED:
        return '제출 완료';
      case AssessmentStatus.EVALUATED:
        return '평가 완료';
      default:
        return status;
    }
  };

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
              {mockStatistics.averageScore}점
            </Typography>
            <Typography variant="body2" sx={{ mt: 'auto' }}>
              상위 {100 - mockStatistics.percentileRank}%
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
              {mockStatistics.assessmentCount}회
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

      {/* 검사 목록 */}
      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
        진행 중인 검사
      </Typography>
      <Grid container spacing={3}>
        {mockAssessments.map((assessment) => (
          <Grid item xs={12} md={6} lg={4} key={assessment.assessmentId}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {assessment.topic.topicText.substring(0, 50)}...
                  </Typography>
                  <Chip
                    label={getStatusText(assessment.status)}
                    color={getStatusColor(assessment.status)}
                    size="small"
                  />
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  도서: {mockAssessments[0].topic.topicText.includes('동물농장') ? '동물농장' : '어린왕자'}
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
                  {assessment.status === AssessmentStatus.IN_PROGRESS && (
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
                {assessment.status === AssessmentStatus.NOT_STARTED && (
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/student/assessment/${assessment.assessmentId}`)}
                  >
                    시작하기
                  </Button>
                )}
                {assessment.status === AssessmentStatus.IN_PROGRESS && (
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
                {assessment.status === AssessmentStatus.EVALUATED && (
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
    </Box>
  );
}
