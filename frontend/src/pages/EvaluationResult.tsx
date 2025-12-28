import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Button,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  TrendingUp,
  EmojiEvents,
  Error as ErrorIcon,
} from '@mui/icons-material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { getAssessmentById, getEvaluationByAnswerId, getAnswerByAssessment } from '../services/api';

export default function EvaluationResult() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        setLoading(true);
        
        // 검사 정보 로드
        const assessmentData = await getAssessmentById(Number(assessmentId));
        
        if (assessmentData.status === 'EVALUATED') {
          const answerData = await getAnswerByAssessment(Number(assessmentId));
          const evaluationResponse = await getEvaluationByAnswerId(answerData.answerId);
          setEvaluation(evaluationResponse.evaluation || null);
        } else {
          setError('아직 평가가 완료되지 않았습니다.');
        }
        
      } catch (err: any) {
        console.error('평가 결과 로드 실패:', err);
        setError(err.message || '평가 결과를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      loadEvaluation();
    }
  }, [assessmentId]);

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
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/student/dashboard')}>
          대시보드로 돌아가기
        </Button>
      </Box>
    );
  }

  if (!evaluation) {
    return (
      <Box>
        <Alert severity="info" sx={{ mb: 2 }}>
          평가 결과를 찾을 수 없습니다.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/student/dashboard')}>
          대시보드로 돌아가기
        </Button>
      </Box>
    );
  }

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
      score: evaluation.expressionScore,
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

  const strengths = evaluation.strengths ? evaluation.strengths.split(',') : [];
  const weaknesses = evaluation.weaknesses ? evaluation.weaknesses.split(',') : [];
  const improvements = evaluation.improvements ? evaluation.improvements.split(',') : [];

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
            <Typography variant="h6" gutterBottom fontWeight="bold">
              종합 평가
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              {evaluation.comprehensiveFeedback}
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              {evaluation.detailedFeedback}
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
              {radarChartData.map((item) => (
                <Box key={item.subject} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.subject.replace('\n', ' ')}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {item.score}/{item.fullMark}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getScorePercentage(item.score, item.fullMark)}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: item.score >= 20 ? 'success.main' : 'primary.main',
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              영역별 점수 차트
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

      {/* 강점 및 약점 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'success.50', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  강점
                </Typography>
              </Box>
              <List>
                {strengths.map((strength: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText primary={strength} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'warning.50', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  개선 필요
                </Typography>
              </Box>
              <List>
                {weaknesses.map((weakness: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Warning color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={weakness} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI 상세 분석 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          AI 상세 분석
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ErrorIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {evaluation.spellingErrors}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  맞춤법 오류
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Warning sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {evaluation.spacingErrors}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  띄어쓰기 오류
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ErrorIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {evaluation.grammarErrors}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  문법 오류
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  3.8/5.0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  어휘 수준
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* 학습 가이드 */}
      <Alert severity="info" icon={<TrendingUp />}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          학습 가이드
        </Typography>
        <List dense>
          {improvements.map((improvement: string, index: number) => (
            <ListItem key={index}>
              <ListItemText primary={`${index + 1}. ${improvement}`} />
            </ListItem>
          ))}
        </List>
      </Alert>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/student/dashboard')}
          size="large"
        >
          대시보드로 돌아가기
        </Button>
      </Box>
    </Box>
  );
}
