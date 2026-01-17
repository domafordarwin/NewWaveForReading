import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Quiz,
  Add,
  Edit,
  Delete,
  Visibility,
  LibraryBooks,
  CheckCircle,
  PendingActions,
  TrendingUp,
} from '@mui/icons-material';
interface Question {
  questionId: number;
  bookTitle: string;
  topicText: string;
  difficultyLevel: number;
  status: 'draft' | 'review' | 'approved' | 'active';
  createdAt: string;
  usageCount: number;
}

const QuestionDeveloperDashboard: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // TODO: API에서 문항 데이터 로드
    setQuestions([
      { questionId: 1, bookTitle: '어린 왕자', topicText: '어린 왕자가 지구에서 만난 여우의 가르침은 무엇인가요?', difficultyLevel: 3, status: 'active', createdAt: '2024-01-10', usageCount: 156 },
      { questionId: 2, bookTitle: '데미안', topicText: '싱클레어가 깨달은 자기 자신의 의미는?', difficultyLevel: 4, status: 'approved', createdAt: '2024-01-12', usageCount: 89 },
      { questionId: 3, bookTitle: '1984', topicText: '빅브라더 사회에서의 개인의 자유란?', difficultyLevel: 5, status: 'review', createdAt: '2024-01-14', usageCount: 0 },
      { questionId: 4, bookTitle: '노인과 바다', topicText: '산티아고의 고독과 투쟁의 의미를 분석하세요.', difficultyLevel: 4, status: 'draft', createdAt: '2024-01-15', usageCount: 0 },
    ]);
  }, []);

  const stats = [
    { label: '총 문항 수', value: '48개', icon: <Quiz />, color: '#1976d2' },
    { label: '활성 문항', value: '32개', icon: <CheckCircle />, color: '#2e7d32' },
    { label: '검토 중', value: '8개', icon: <PendingActions />, color: '#ed6c02' },
    { label: '총 사용 횟수', value: '2,456회', icon: <TrendingUp />, color: '#9c27b0' },
  ];

  const getStatusChip = (status: Question['status']) => {
    const config = {
      draft: { label: '초안', color: 'default' as const },
      review: { label: '검토중', color: 'warning' as const },
      approved: { label: '승인됨', color: 'info' as const },
      active: { label: '활성', color: 'success' as const },
    };
    return <Chip label={config[status].label} color={config[status].color} size="small" />;
  };

  const getDifficultyBar = (level: number) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <LinearProgress
        variant="determinate"
        value={level * 20}
        sx={{ width: 60, height: 8, borderRadius: 4 }}
        color={level >= 4 ? 'error' : level >= 3 ? 'warning' : 'success'}
      />
      <Typography variant="body2">{level}/5</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          문항 개발 대시보드
        </Typography>
        <Typography variant="body1" color="text.secondary">
          독서 진단 문항 개발 및 관리
        </Typography>
      </Box>

      {/* 통계 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 빠른 작업 */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            빠른 작업
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<Add />}>
              새 문항 작성
            </Button>
            <Button variant="outlined" startIcon={<LibraryBooks />}>
              도서 목록
            </Button>
            <Button variant="outlined" startIcon={<PendingActions />}>
              검토 대기 문항
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 문항 목록 */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              내가 개발한 문항
            </Typography>
            <Button variant="text" size="small">
              전체 보기
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>도서</TableCell>
                  <TableCell>문항 내용</TableCell>
                  <TableCell align="center">난이도</TableCell>
                  <TableCell align="center">상태</TableCell>
                  <TableCell align="center">사용 횟수</TableCell>
                  <TableCell align="center">작성일</TableCell>
                  <TableCell align="center">작업</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.questionId} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LibraryBooks fontSize="small" color="primary" />
                        {question.bookTitle}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {question.topicText}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {getDifficultyBar(question.difficultyLevel)}
                    </TableCell>
                    <TableCell align="center">
                      {getStatusChip(question.status)}
                    </TableCell>
                    <TableCell align="center">{question.usageCount}회</TableCell>
                    <TableCell align="center">{question.createdAt}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="상세 보기">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="수정">
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuestionDeveloperDashboard;
