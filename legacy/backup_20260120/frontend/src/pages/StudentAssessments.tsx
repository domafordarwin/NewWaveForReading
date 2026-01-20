import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAssessmentsByStudentId } from '../services/api';
import { getCurrentUser } from '../utils/session';

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

export default function StudentAssessments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          setError('로그인이 필요합니다.');
          return;
        }
        const data = await getAssessmentsByStudentId(currentUser.userId);
        setAssessments(data);
        setError(null);
      } catch (err: any) {
        console.error('검사 목록 로드 실패:', err);
        setError(err.message || '검사 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        검사 목록
      </Typography>

      {assessments.length === 0 ? (
        <Alert severity="info">아직 배정된 검사가 없습니다.</Alert>
      ) : (
        <Grid container spacing={3}>
          {assessments.map((assessment) => (
            <Grid item xs={12} md={6} lg={4} key={assessment.assessmentId}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6">
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
                  <Typography variant="body2" color="text.secondary">
                    제한 시간: {assessment.timeLimitMinutes}분
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {assessment.wordCountMin}-{assessment.wordCountMax}자
                  </Typography>
                  {assessment.status === 'IN_PROGRESS' && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress variant="determinate" value={45} />
                      <Typography variant="caption" color="text.secondary">
                        진행률: 45%
                      </Typography>
                    </Box>
                  )}
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
