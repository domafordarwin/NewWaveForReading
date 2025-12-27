import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import {
  People,
  Assignment,
  CheckCircle,
  TrendingUp,
  School,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getAllAssessments, getAllEvaluations } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    totalAssessments: 0,
    completedAssessments: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 사용자 목록 로드 (학생만 필터링)
        const allUsers = await getAllUsers();
        const studentList = allUsers.filter((u: any) => u.userType === 'STUDENT');
        setStudents(studentList);
        
        // 검사 목록 로드
        const assessmentData = await getAllAssessments();
        setAssessments(assessmentData);
        
        // 평가 결과 로드
        const evaluationData = await getAllEvaluations();
        setEvaluations(evaluationData);
        
        // 통계 계산
        const completed = assessmentData.filter((a: any) => a.status === 'EVALUATED').length;
        const avgScore = evaluationData.length > 0
          ? Math.round(evaluationData.reduce((sum: number, e: any) => sum + e.totalScore, 0) / evaluationData.length)
          : 0;
        
        setStatistics({
          totalStudents: studentList.length,
          totalAssessments: assessmentData.length,
          completedAssessments: completed,
          averageScore: avgScore,
        });
        
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

  // 상태별 검사 수 계산
  const statusData = [
    { name: '대기 중', value: assessments.filter(a => a.status === 'NOT_STARTED').length },
    { name: '진행 중', value: assessments.filter(a => a.status === 'IN_PROGRESS').length },
    { name: '제출 완료', value: assessments.filter(a => a.status === 'SUBMITTED').length },
    { name: '평가 완료', value: assessments.filter(a => a.status === 'EVALUATED').length },
  ];

  // 최근 평가 결과 (상위 5개)
  const recentEvaluations = evaluations.slice(0, 5);

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
        <Button variant="contained" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        교사 대시보드
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
              <People sx={{ mr: 1 }} />
              <Typography variant="h6">전체 학생</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {statistics.totalStudents}명
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
              <Assignment sx={{ mr: 1 }} />
              <Typography variant="h6">총 검사</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {statistics.totalAssessments}건
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
              <CheckCircle sx={{ mr: 1 }} />
              <Typography variant="h6">완료</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {statistics.completedAssessments}건
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
              <TrendingUp sx={{ mr: 1 }} />
              <Typography variant="h6">평균 점수</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {statistics.averageScore}점
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 차트 영역 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              검사 상태 현황
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#1976d2" name="검사 수" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              상태 분포
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* 최근 평가 결과 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          최근 평가 결과
        </Typography>
        {recentEvaluations.length === 0 ? (
          <Alert severity="info">평가 결과가 없습니다.</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>학생</TableCell>
                  <TableCell>검사 ID</TableCell>
                  <TableCell align="center">총점</TableCell>
                  <TableCell align="center">등급</TableCell>
                  <TableCell align="center">평가일</TableCell>
                  <TableCell align="center">작업</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentEvaluations.map((evaluation: any) => (
                  <TableRow key={evaluation.evaluationId}>
                    <TableCell>학생 #{evaluation.studentId || 'N/A'}</TableCell>
                    <TableCell>검사 #{evaluation.assessmentId || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <Typography fontWeight="bold">{evaluation.totalScore}점</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={evaluation.grade}
                        color={evaluation.totalScore >= 90 ? 'success' : evaluation.totalScore >= 80 ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {evaluation.createdAt ? new Date(evaluation.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/teacher/evaluation/${evaluation.evaluationId}`)}
                      >
                        상세보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* 빠른 액션 버튼 */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<People />}
            onClick={() => navigate('/teacher/students')}
            sx={{ py: 2 }}
          >
            학생 관리
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={<Assignment />}
            onClick={() => navigate('/teacher/assessments')}
            sx={{ py: 2 }}
          >
            검사 배정
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            color="info"
            startIcon={<School />}
            onClick={() => navigate('/teacher/statistics')}
            sx={{ py: 2 }}
          >
            반별 통계
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/teacher/reports')}
            sx={{ py: 2 }}
          >
            리포트 생성
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
