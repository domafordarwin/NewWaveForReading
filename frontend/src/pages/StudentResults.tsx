import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllEvaluations } from '../services/api';
import { getCurrentUser } from '../utils/session';

const getGradeColor = (grade?: string) => {
  if (!grade) return 'default';
  if (grade.startsWith('A')) return 'success';
  if (grade.startsWith('B')) return 'primary';
  if (grade.startsWith('C')) return 'warning';
  return 'error';
};

export default function StudentResults() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);

  useEffect(() => {
    const loadResults = async () => {
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
        console.error('성적 로드 실패:', err);
        setError(err.message || '성적을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
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
        나의 성적
      </Typography>

      {evaluations.length === 0 ? (
        <Alert severity="info">아직 평가 결과가 없습니다.</Alert>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">검사 ID</TableCell>
                  <TableCell align="center">총점</TableCell>
                  <TableCell align="center">등급</TableCell>
                  <TableCell align="center">상세</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <TableRow key={evaluation.evaluationId} hover>
                    <TableCell align="center">#{evaluation.assessmentId || 'N/A'}</TableCell>
                    <TableCell align="center">{evaluation.totalScore ?? '-'}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={evaluation.grade || '-'}
                        color={getGradeColor(evaluation.grade)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={!evaluation.assessmentId}
                        onClick={() => navigate(`/student/result/${evaluation.assessmentId}`)}
                      >
                        결과 보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
