import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Assessment,
  PlayArrow,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { getDiagnosticAssessments } from '../services/diagnosticAssessmentService';
import type { DiagnosticAssessmentWithItems } from '../types/diagnosticAssessment';

export default function StudentAssessmentList() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<DiagnosticAssessmentWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      setError(null);

      // 배포된 평가만 조회
      const data = await getDiagnosticAssessments({ status: 'published' });
      setAssessments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = (assessmentId: number) => {
    navigate(`/student/assessments/${assessmentId}/take`);
  };

  const getGradeBandLabel = (gradeBand: string) => {
    const labels = {
      '초저': '초등 저학년',
      '초고': '초등 고학년',
      '중저': '중등 저학년',
      '중고': '중등 고학년',
    };
    return labels[gradeBand as keyof typeof labels] || gradeBand;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Assessment sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" component="h1">
          진단 평가
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {assessments.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 8, textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                현재 응시 가능한 평가가 없습니다.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          assessments.map((assessment) => (
            <Grid item xs={12} md={6} lg={4} key={assessment.assessment_id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Assessment color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                      {assessment.title}
                    </Typography>
                  </Box>

                  {assessment.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {assessment.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
                      icon={<Schedule />}
                      label={getGradeBandLabel(assessment.grade_band)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`${assessment.item_count || 0}문항`}
                      size="small"
                      variant="outlined"
                    />
                    {assessment.time_limit_minutes && (
                      <Chip
                        icon={<Schedule />}
                        label={`${assessment.time_limit_minutes}분`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {/* TODO: 응시 상태 표시 (미응시/진행중/완료) */}
                  <Chip
                    icon={<PlayArrow />}
                    label="응시 가능"
                    size="small"
                    color="success"
                  />
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() => handleStartAssessment(assessment.assessment_id)}
                  >
                    평가 시작
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
