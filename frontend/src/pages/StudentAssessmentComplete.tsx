import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { CheckCircle, Home, Visibility } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function StudentAssessmentComplete() {
  const navigate = useNavigate();
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 가장 최근 응시 ID 조회
    const fetchAttemptId = async () => {
      if (!assessmentId || !supabase) return;

      try {
        const studentId = 1; // TODO: 실제 로그인 사용자 ID
        const { data, error } = await supabase
          .from('assessment_attempts')
          .select('attempt_id')
          .eq('assessment_id', parseInt(assessmentId))
          .eq('student_id', studentId)
          .eq('status', 'submitted')
          .order('submitted_at', { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          setAttemptId(data.attempt_id);
        }
      } catch (err) {
        console.error('Failed to fetch attempt:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptId();
  }, [assessmentId]);

  const handleViewResults = () => {
    if (attemptId) {
      navigate(`/student/assessments/results/${attemptId}`);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />

        <Typography variant="h4" gutterBottom>
          평가가 제출되었습니다!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          수고하셨습니다. 채점이 완료되었습니다.
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate('/student/assessments')}
            >
              평가 목록으로
            </Button>
            {attemptId && (
              <Button
                variant="contained"
                size="large"
                startIcon={<Visibility />}
                onClick={handleViewResults}
              >
                결과 보기
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
