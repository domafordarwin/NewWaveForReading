import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { healthCheck, getAllUsers, getAllBooks, getAllAssessments } from '../services/api';

export default function APITest() {
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const testHealthCheck = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await healthCheck();
      setHealth(data);
      console.log('Health Check:', data);
    } catch (err: any) {
      setError('Health Check 실패: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const testGetAllUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllUsers();
      setUsers(data);
      console.log('All Users:', data);
    } catch (err: any) {
      setError('사용자 목록 조회 실패: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const testGetAllBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllBooks();
      setBooks(data);
      console.log('All Books:', data);
    } catch (err: any) {
      setError('도서 목록 조회 실패: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const testGetAllAssessments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllAssessments();
      setAssessments(data);
      console.log('All Assessments:', data);
    } catch (err: any) {
      setError('검사 목록 조회 실패: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testHealthCheck();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        백엔드 API 연동 테스트
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Health Check */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              1. Health Check
            </Typography>
            <Button
              variant="contained"
              onClick={testHealthCheck}
              disabled={loading}
              fullWidth
            >
              Health Check 테스트
            </Button>
            {health && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>상태:</strong> {health.status}
                </Typography>
                <Typography variant="body2">
                  <strong>메시지:</strong> {health.message}
                </Typography>
                <Typography variant="body2">
                  <strong>버전:</strong> {health.version}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Users */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              2. 사용자 목록 ({users.length}명)
            </Typography>
            <Button
              variant="contained"
              onClick={testGetAllUsers}
              disabled={loading}
              fullWidth
            >
              사용자 조회
            </Button>
            {users.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {users.map((user) => (
                  <Typography key={user.userId} variant="body2">
                    • {user.name} ({user.email})
                  </Typography>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Books */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              3. 도서 목록 ({books.length}권)
            </Typography>
            <Button
              variant="contained"
              onClick={testGetAllBooks}
              disabled={loading}
              fullWidth
            >
              도서 조회
            </Button>
            {books.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {books.map((book) => (
                  <Typography key={book.bookId} variant="body2">
                    • {book.title} - {book.author}
                  </Typography>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Assessments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              4. 검사 목록 ({assessments.length}개)
            </Typography>
            <Button
              variant="contained"
              onClick={testGetAllAssessments}
              disabled={loading}
              fullWidth
            >
              검사 조회
            </Button>
            {assessments.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {assessments.map((assessment) => (
                  <Typography key={assessment.assessmentId} variant="body2">
                    • 검사 #{assessment.assessmentId} - {assessment.status}
                  </Typography>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
