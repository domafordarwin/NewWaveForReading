import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { getAllUsers, getAllAssessments, getAllEvaluations } from '../services/api';
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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [userTab, setUserTab] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          setError('로그인이 필요합니다.');
          return;
        }
        const [userData, assessmentData, evaluationData] = await Promise.all([
          getAllUsers(),
          getAllAssessments(),
          getAllEvaluations(),
        ]);
        setUsers(userData);
        setAssessments(assessmentData);
        setEvaluations(evaluationData);
        setError(null);
      } catch (err: any) {
        console.error('관리자 डेटा 로드 실패:', err);
        setError(err.message || '관리자 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
      </Box>
    );
  }

  const countsByRole = users.reduce(
    (acc: any, user: any) => {
      acc[user.userType] = (acc[user.userType] || 0) + 1;
      return acc;
    },
    {}
  );

  const usersByRole = {
    TEACHER: users.filter((user) => user.userType === 'TEACHER'),
    STUDENT: users.filter((user) => user.userType === 'STUDENT'),
    PARENT: users.filter((user) => user.userType === 'PARENT'),
  };

  const currentUserList =
    userTab === 0 ? usersByRole.TEACHER : userTab === 1 ? usersByRole.STUDENT : usersByRole.PARENT;

  const countsByStatus = assessments.reduce(
    (acc: any, assessment: any) => {
      acc[assessment.status] = (acc[assessment.status] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        관리자 대시보드
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              전체 사용자
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {users.length}명
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              학생
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {countsByRole.STUDENT || 0}명
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              교사
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {countsByRole.TEACHER || 0}명
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              평가 완료
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {evaluations.length}건
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom fontWeight="bold">
        검사 상태 요약
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {Object.entries(countsByStatus).map(([status, count]) => (
            <Chip
              key={status}
              label={`${status}: ${count}`}
              color={getStatusColor(status)}
              variant="outlined"
            />
          ))}
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom fontWeight="bold">
        최근 평가
      </Typography>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">평가 ID</TableCell>
                <TableCell align="center">검사 ID</TableCell>
                <TableCell align="center">학생 ID</TableCell>
                <TableCell align="center">총점</TableCell>
                <TableCell align="center">등급</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evaluations.slice(0, 10).map((evaluation) => (
                <TableRow key={evaluation.evaluationId}>
                  <TableCell align="center">{evaluation.evaluationId}</TableCell>
                  <TableCell align="center">{evaluation.assessmentId || '-'}</TableCell>
                  <TableCell align="center">{evaluation.studentId || '-'}</TableCell>
                  <TableCell align="center">{evaluation.totalScore ?? '-'}</TableCell>
                  <TableCell align="center">{evaluation.grade || '-'}</TableCell>
                </TableRow>
              ))}
              {evaluations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary" py={3}>
                      평가 데이터가 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
        사용자 현황
      </Typography>
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={userTab}
          onChange={(_, value) => setUserTab(value)}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`교사 (${usersByRole.TEACHER.length})`} />
          <Tab label={`학생 (${usersByRole.STUDENT.length})`} />
          <Tab label={`학부모 (${usersByRole.PARENT.length})`} />
        </Tabs>
      </Paper>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">사용자 ID</TableCell>
                <TableCell align="center">이름</TableCell>
                <TableCell align="center">이메일</TableCell>
                <TableCell align="center">학교</TableCell>
                <TableCell align="center">학년</TableCell>
                <TableCell align="center">상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUserList.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell align="center">{user.userId}</TableCell>
                  <TableCell align="center">{user.name}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.schoolName || '-'}</TableCell>
                  <TableCell align="center">{user.grade ? `${user.grade}학년` : '-'}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={user.isActive === false ? '비활성' : '활성'}
                      color={user.isActive === false ? 'default' : 'success'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {currentUserList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary" py={3}>
                      표시할 사용자가 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
