import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  People,
} from '@mui/icons-material';
import { getAllUsers, getAllEvaluations } from '../services/api';

export default function ClassStatistics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [students, setStudents] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (students.length > 0 && evaluations.length > 0) {
      calculateStatistics();
    }
  }, [selectedGrade, students, evaluations]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allUsers, allEvaluations] = await Promise.all([
        getAllUsers(),
        getAllEvaluations(),
      ]);
      
      const studentList = allUsers.filter((u: any) => u.userType === 'STUDENT');
      setStudents(studentList);
      setEvaluations(allEvaluations);
      setError(null);
    } catch (err: any) {
      console.error('데이터 로드 실패:', err);
      setError(err.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = () => {
    // 학년 필터링
    const filteredStudents = selectedGrade === 'all'
      ? students
      : students.filter(s => s.grade === parseInt(selectedGrade));

    if (evaluations.length === 0) {
      setStatistics({
        totalStudents: filteredStudents.length,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        scoreDistribution: [],
        categoryAverages: [],
        trend: [],
      });
      return;
    }

    // 평균 점수
    const totalScore = evaluations.reduce((sum, e) => sum + e.totalScore, 0);
    const avgScore = Math.round(totalScore / evaluations.length);

    // 최고/최저 점수
    const scores = evaluations.map(e => e.totalScore);
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    // 점수 분포
    const distribution = [
      { range: '0-59', count: evaluations.filter(e => e.totalScore < 60).length },
      { range: '60-69', count: evaluations.filter(e => e.totalScore >= 60 && e.totalScore < 70).length },
      { range: '70-79', count: evaluations.filter(e => e.totalScore >= 70 && e.totalScore < 80).length },
      { range: '80-89', count: evaluations.filter(e => e.totalScore >= 80 && e.totalScore < 90).length },
      { range: '90-100', count: evaluations.filter(e => e.totalScore >= 90).length },
    ];

    // 영역별 평균
    const categoryAverages = [
      {
        category: '대상도서\n분석력',
        score: Math.round(evaluations.reduce((sum, e) => sum + e.bookAnalysisScore, 0) / evaluations.length),
        fullMark: 25,
      },
      {
        category: '창의적\n사고력',
        score: Math.round(evaluations.reduce((sum, e) => sum + e.creativeThinkingScore, 0) / evaluations.length),
        fullMark: 25,
      },
      {
        category: '문제\n해결력',
        score: Math.round(evaluations.reduce((sum, e) => sum + e.problemSolvingScore, 0) / evaluations.length),
        fullMark: 25,
      },
      {
        category: '문장력/\n표현력',
        score: Math.round(evaluations.reduce((sum, e) => sum + e.expressionScore, 0) / evaluations.length),
        fullMark: 25,
      },
    ];

    // 최근 추이 (최대 5개)
    const recentEvaluations = evaluations.slice(0, 5).reverse();
    const trend = recentEvaluations.map((e, index) => ({
      name: `${index + 1}회`,
      점수: e.totalScore,
    }));

    setStatistics({
      totalStudents: filteredStudents.length,
      averageScore: avgScore,
      highestScore,
      lowestScore,
      scoreDistribution: distribution,
      categoryAverages,
      trend,
    });
  };

  // 사용 가능한 학년 목록
  const availableGrades = Array.from(new Set(students.map(s => s.grade))).filter(g => g).sort();

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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          반별 통계
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>학년 선택</InputLabel>
          <Select
            value={selectedGrade}
            label="학년 선택"
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <MenuItem value="all">전체</MenuItem>
            {availableGrades.map(grade => (
              <MenuItem key={grade} value={grade.toString()}>
                {grade}학년
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 요약 통계 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <People sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  학생 수
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {statistics.totalStudents}명
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  평균 점수
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {statistics.averageScore}점
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                최고 점수
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {statistics.highestScore}점
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingDown sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  최저 점수
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {statistics.lowestScore}점
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {evaluations.length === 0 ? (
        <Alert severity="info">
          평가 데이터가 없습니다. 검사를 완료한 후 통계를 확인할 수 있습니다.
        </Alert>
      ) : (
        <>
          {/* 차트 영역 */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* 점수 분포 */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  점수 분포
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statistics.scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#1976d2" name="학생 수" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* 영역별 평균 */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  영역별 평균 점수
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={statistics.categoryAverages}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" style={{ fontSize: '12px' }} />
                    <PolarRadiusAxis domain={[0, 25]} />
                    <Radar
                      name="평균 점수"
                      dataKey="score"
                      stroke="#1976d2"
                      fill="#1976d2"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* 최근 추이 */}
            {statistics.trend && statistics.trend.length > 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    최근 성적 추이
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={statistics.trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="점수"
                        stroke="#1976d2"
                        strokeWidth={3}
                        dot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            )}
          </Grid>

          {/* 상세 분석 */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              분석 요약
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  강점 영역
                </Typography>
                <Typography variant="body1">
                  {statistics.categoryAverages && statistics.categoryAverages.length > 0
                    ? statistics.categoryAverages.reduce((prev: any, current: any) => 
                        (prev.score > current.score) ? prev : current
                      ).category.replace('\n', ' ')
                    : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  개선 필요 영역
                </Typography>
                <Typography variant="body1">
                  {statistics.categoryAverages && statistics.categoryAverages.length > 0
                    ? statistics.categoryAverages.reduce((prev: any, current: any) => 
                        (prev.score < current.score) ? prev : current
                      ).category.replace('\n', ' ')
                    : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );
}
