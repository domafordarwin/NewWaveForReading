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
} from '@mui/material';
import {
  People,
  School,
  Assessment,
  Print,
  Visibility,
  Class,
  PersonAdd,
  TrendingUp,
} from '@mui/icons-material';
import { getCurrentUser } from '../utils/session';

interface StudentSummary {
  studentId: number;
  name: string;
  grade: number;
  className: string;
  assessmentCount: number;
  averageScore: number;
  lastAssessmentDate: string;
}

const SchoolAdminDashboard: React.FC = () => {
  const currentUser = getCurrentUser();
  const [students, setStudents] = useState<StudentSummary[]>([]);

  useEffect(() => {
    // TODO: API에서 학교 학생 데이터 로드
    setStudents([
      { studentId: 1, name: '김민준', grade: 3, className: '3-1', assessmentCount: 5, averageScore: 85, lastAssessmentDate: '2024-01-15' },
      { studentId: 2, name: '이서연', grade: 3, className: '3-1', assessmentCount: 4, averageScore: 92, lastAssessmentDate: '2024-01-14' },
      { studentId: 3, name: '박지호', grade: 4, className: '4-2', assessmentCount: 6, averageScore: 78, lastAssessmentDate: '2024-01-13' },
    ]);
  }, []);

  const stats = [
    { label: '전체 학생 수', value: '245명', icon: <People />, color: '#1976d2' },
    { label: '학급 수', value: '12개', icon: <Class />, color: '#2e7d32' },
    { label: '완료된 평가', value: '1,234건', icon: <Assessment />, color: '#ed6c02' },
    { label: '평균 점수', value: '82.5점', icon: <TrendingUp />, color: '#9c27b0' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          학교 관리자 대시보드
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {currentUser?.schoolName || '학교'} 학생 관리 및 평가 현황
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                빠른 작업
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" startIcon={<PersonAdd />}>
                  학생 등록
                </Button>
                <Button variant="outlined" startIcon={<Class />}>
                  학급 관리
                </Button>
                <Button variant="outlined" startIcon={<Print />}>
                  리포트 출력
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                학교 정보
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <School sx={{ fontSize: 48, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">{currentUser?.schoolName || '학교명'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    학교 코드: SCH001
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 학생 목록 */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              최근 평가 현황
            </Typography>
            <Button variant="text" size="small">
              전체 보기
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>학생명</TableCell>
                  <TableCell>학년/반</TableCell>
                  <TableCell align="center">평가 횟수</TableCell>
                  <TableCell align="center">평균 점수</TableCell>
                  <TableCell align="center">최근 평가일</TableCell>
                  <TableCell align="center">작업</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.studentId} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                          {student.name[0]}
                        </Avatar>
                        {student.name}
                      </Box>
                    </TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell align="center">{student.assessmentCount}회</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${student.averageScore}점`}
                        size="small"
                        color={student.averageScore >= 80 ? 'success' : student.averageScore >= 60 ? 'warning' : 'error'}
                      />
                    </TableCell>
                    <TableCell align="center">{student.lastAssessmentDate}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="상세 보기">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="리포트 출력">
                        <IconButton size="small">
                          <Print />
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

export default SchoolAdminDashboard;
