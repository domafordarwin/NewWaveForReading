import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getAssessmentsByStudentId, getAllEvaluations } from '../services/api';
import { getCurrentUser } from '../utils/session';

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

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          setError('로그인이 필요합니다.');
          return;
        }
        const allUsers = await getAllUsers();
        const studentList = allUsers.filter((u: any) => u.userType === 'STUDENT' && u.isActive !== false);
        const emailMatch = currentUser.email?.match(/parent_student(\d+)@/);
        const matchedByEmail = emailMatch
          ? studentList.find((student: any) => student.email === `student${emailMatch[1]}@example.com`)
          : null;
        const parentName = currentUser.name?.replace(' 학부모', '');
        const matchedByName = parentName
          ? studentList.find((student: any) => student.name === parentName)
          : null;
        const resolvedStudent = matchedByEmail || matchedByName || studentList[0];
        if (!resolvedStudent) {
          setError('연결된 학생 정보를 찾을 수 없습니다.');
          return;
        }
        setStudentId(resolvedStudent.userId);
        setError(null);
      } catch (err: any) {
        console.error('학생 목록 로드 실패:', err);
        setError(err.message || '학생 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, []);

  useEffect(() => {
    const loadStudentData = async () => {
      if (!studentId) {
        setAssessments([]);
        setEvaluations([]);
        return;
      }
      try {
        setLoading(true);
        const [assessmentData, evaluationData] = await Promise.all([
          getAssessmentsByStudentId(studentId),
          getAllEvaluations(),
        ]);
        const filteredEvaluations = evaluationData.filter((e: any) => e.studentId === studentId);
        setAssessments(assessmentData);
        setEvaluations(filteredEvaluations);
        setError(null);
      } catch (err: any) {
        console.error('학생 데이터 로드 실패:', err);
        setError(err.message || '학생 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [studentId]);

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
        <Button variant="contained" onClick={() => navigate('/login')}>
          다시 로그인
        </Button>
      </Box>
    );
  }

  const averageScore = evaluations.length
    ? Math.round(evaluations.reduce((sum: number, e: any) => sum + e.totalScore, 0) / evaluations.length)
    : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        학부모 대시보드
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              평균 점수
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {averageScore}점
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              총 검사
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {assessments.length}회
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              평가 완료
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {evaluations.length}회
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom fontWeight="bold">
        검사 현황
      </Typography>

      {assessments.length === 0 ? (
        <Alert severity="info">아직 배정된 검사가 없습니다.</Alert>
      ) : (
        <Grid container spacing={2}>
          {assessments.map((assessment) => (
            <Grid item xs={12} md={6} key={assessment.assessmentId}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {assessment.topic?.topicText?.substring(0, 40) || '검사'}...
                    </Typography>
                    <Chip
                      size="small"
                      label={getStatusText(assessment.status)}
                      color={getStatusColor(assessment.status)}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    제한 시간: {assessment.timeLimitMinutes}분
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {assessment.wordCountMin}-{assessment.wordCountMax}자
                  </Typography>
                  {assessment.status === 'EVALUATED' && (
                    <Button
                      sx={{ mt: 2 }}
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/student/result/${assessment.assessmentId}`)}
                    >
                      평가 결과 보기
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
