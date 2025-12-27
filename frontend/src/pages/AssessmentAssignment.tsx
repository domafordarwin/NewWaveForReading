import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
} from '@mui/icons-material';
import { getAllUsers, getAllBooks, createAssessment } from '../services/api';
import { useNavigate } from 'react-router-dom';

const steps = ['학생 선택', '도서 및 논제 선택', '검사 설정', '확인 및 배정'];

export default function AssessmentAssignment() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    studentId: '',
    bookId: '',
    topicId: '',
    timeLimitMinutes: 90,
    wordCountMin: 800,
    wordCountMax: 1200,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allUsers, allBooks] = await Promise.all([
        getAllUsers(),
        getAllBooks(),
      ]);
      
      const studentList = allUsers.filter((u: any) => u.userType === 'STUDENT');
      setStudents(studentList);
      setBooks(allBooks);
      setError(null);
    } catch (err: any) {
      console.error('데이터 로드 실패:', err);
      setError(err.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // 검사 배정 API 호출
      // Note: topicId는 실제로는 도서에서 선택해야 하지만, 
      // 현재는 간단히 하기 위해 1로 설정
      const assessmentData = {
        student: { userId: parseInt(formData.studentId) },
        topic: { topicId: 1 }, // TODO: 실제 논제 선택 구현 필요
        timeLimitMinutes: formData.timeLimitMinutes,
        wordCountMin: formData.wordCountMin,
        wordCountMax: formData.wordCountMax,
        status: 'NOT_STARTED',
      };
      
      await createAssessment(assessmentData);
      setActiveStep(steps.length);
    } catch (err: any) {
      console.error('검사 배정 실패:', err);
      setError(err.message || '검사 배정에 실패했습니다.');
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              검사를 배정할 학생을 선택하세요
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>학생</InputLabel>
              <Select
                value={formData.studentId}
                label="학생"
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              >
                {students.map((student) => (
                  <MenuItem key={student.userId} value={student.userId}>
                    {student.name} ({student.email}) - {student.schoolName} {student.grade}학년
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              도서 및 논제를 선택하세요
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>도서</InputLabel>
              <Select
                value={formData.bookId}
                label="도서"
                onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
              >
                {books.map((book) => (
                  <MenuItem key={book.bookId} value={book.bookId}>
                    {book.title} - {book.author} ({book.difficultyLevel})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Alert severity="info" sx={{ mt: 2 }}>
              논제는 선택한 도서에 따라 자동으로 배정됩니다.
            </Alert>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              검사 설정
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="제한 시간 (분)"
                  type="number"
                  value={formData.timeLimitMinutes}
                  onChange={(e) => setFormData({ ...formData, timeLimitMinutes: parseInt(e.target.value) })}
                  inputProps={{ min: 30, max: 180 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="최소 글자 수"
                  type="number"
                  value={formData.wordCountMin}
                  onChange={(e) => setFormData({ ...formData, wordCountMin: parseInt(e.target.value) })}
                  inputProps={{ min: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="최대 글자 수"
                  type="number"
                  value={formData.wordCountMax}
                  onChange={(e) => setFormData({ ...formData, wordCountMax: parseInt(e.target.value) })}
                  inputProps={{ min: formData.wordCountMin }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 3:
        const selectedStudent = students.find(s => s.userId === parseInt(formData.studentId));
        const selectedBook = books.find(b => b.bookId === parseInt(formData.bookId));
        
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              검사 배정 정보 확인
            </Typography>
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">학생</Typography>
                    <Typography variant="body1">
                      {selectedStudent?.name} ({selectedStudent?.email})
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">도서</Typography>
                    <Typography variant="body1">
                      {selectedBook?.title} - {selectedBook?.author}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">제한 시간</Typography>
                    <Typography variant="body1">{formData.timeLimitMinutes}분</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">최소 글자 수</Typography>
                    <Typography variant="body1">{formData.wordCountMin}자</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">최대 글자 수</Typography>
                    <Typography variant="body1">{formData.wordCountMax}자</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );
      
      default:
        return '알 수 없는 단계';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (activeStep === steps.length) {
    return (
      <Box textAlign="center" py={8}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          검사가 성공적으로 배정되었습니다!
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          학생은 이제 검사를 시작할 수 있습니다.
        </Typography>
        <Box>
          <Button
            variant="contained"
            onClick={() => {
              setActiveStep(0);
              setFormData({
                studentId: '',
                bookId: '',
                topicId: '',
                timeLimitMinutes: 90,
                wordCountMin: 800,
                wordCountMax: 1200,
              });
            }}
            sx={{ mr: 2 }}
          >
            추가 배정
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/teacher/dashboard')}
          >
            대시보드로
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        검사 배정
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 300 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            이전
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!formData.studentId || !formData.bookId}
              >
                배정 완료
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && !formData.studentId) ||
                  (activeStep === 1 && !formData.bookId)
                }
              >
                다음
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
