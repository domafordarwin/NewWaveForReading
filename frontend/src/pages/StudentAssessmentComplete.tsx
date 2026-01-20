import { Box, Paper, Typography, Button } from '@mui/material';
import { CheckCircle, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function StudentAssessmentComplete() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />

        <Typography variant="h4" gutterBottom>
          평가가 제출되었습니다!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          수고하셨습니다. 채점이 완료되면 결과를 확인하실 수 있습니다.
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<Home />}
          onClick={() => navigate('/student/assessments')}
        >
          평가 목록으로
        </Button>
      </Paper>
    </Box>
  );
}
