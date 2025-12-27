import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  TrendingUp,
  TrendingDown,
  EmojiEvents,
} from '@mui/icons-material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { mockEvaluations } from '../../utils/mockData';

export default function EvaluationResult() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  
  // Mock 데이터
  const evaluation = mockEvaluations[0];

  const radarChartData = [
    {
      subject: '대상도서\n분석력',
      score: evaluation.bookAnalysisScore,
      fullMark: 25,
    },
    {
      subject: '창의적\n사고력',
      score: evaluation.creativeThinkingScore,
      fullMark: 25,
    },
    {
      subject: '문제\n해결력',
      score: evaluation.problemSolvingScore,
      fullMark: 25,
    },
    {
      subject: '문장력/\n표현력',
      score: evaluation.languageExpressionScore,
      fullMark: 25,
    },
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'primary';
    if (grade.startsWith('C')) return 'warning';
    return 'error';
  };

  const getScorePercentage = (score: number, maxScore: number) => {
    return (score / maxScore) * 100;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        평가 결과 리포트
      </Typography>

      {/* 총점 및 등급 */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4} textAlign="center">
            <EmojiEvents sx={{ fontSize: 60, mb: 1 }} />
            <Typography variant="h2" fontWeight="bold">
              {evaluation.totalScore}점
            </Typography>
            <Chip
              label={evaluation.grade}
              color={getGradeColor(evaluation.grade)}
              sx={{ mt: 1, fontSize: '1.2rem', px: 2, py: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                백분위: 상위 {100 - evaluation.percentile}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={evaluation.percentile}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white',
                  },
                }}
              />
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {evaluation.overallComment}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* 영역별 점수 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              영역별 점수
            </Typography>
            <Box sx={{ mt: 3 }}>
              {[
                { name: '대상도서 분석력', score: evaluation.bookAnalysisScore, max: 25 },
                { name: '창의적 사고력', score: evaluation.creativeThinkingScore, max: 25 },
                { name: '문제해결력', score: evaluation.problemSolvingScore, max: 25 },
                { name: '문장력 및 표현력', score: evaluation.languageExpressionScore, max: 25 },
              ].map((area, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {area.name}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      {area.score} / {area.max}점
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getScorePercentage(area.score, area.max)}
                    sx={{ height: 8, borderRadius: 4 }}
                    color={getScorePercentage(area.score, area.max) >= 80 ? 'success' : 'primary'}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              영역별 분포
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

      {/* 강점과 약점 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'success.50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  강점
                </Typography>
              </Box>
              <List>
                {evaluation.strengths.map((strength, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={strength}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'warning.50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDown sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="warning.main">
                  개선이 필요한 부분
                </Typography>
              </Box>
              <List>
                {evaluation.weaknesses.map((weakness, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Warning color="warning" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={weakness}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 상세 분석 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          AI 상세 분석
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="error.main" fontWeight="bold">
                {evaluation.spellingErrors}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                맞춤법 오류
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {evaluation.spacingErrors}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                띄어쓰기 오류
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {evaluation.grammarErrors}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                문법 오류
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {evaluation.vocabularyLevel.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                어휘 수준 (1-5)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 학습 가이드 */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body1" fontWeight="bold" gutterBottom>
          💡 학습 가이드
        </Typography>
        <Typography variant="body2">
          • 논리적 구조 강화를 위해 개요를 먼저 작성하는 습관을 들이세요.<br />
          • 주장과 근거를 명확히 연결하는 연결어를 활용하세요.<br />
          • 맞춤법과 띄어쓰기 검사 도구를 활용하여 작성 후 검토하세요.
        </Typography>
      </Alert>
    </Box>
  );
}
