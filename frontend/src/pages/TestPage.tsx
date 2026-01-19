import { useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

const TestPage = () => {
  const { id } = useParams();

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          테스트 페이지
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          라우팅이 정상적으로 작동하고 있습니다!
        </Typography>
        {id && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            URL 파라미터 ID: <strong>{id}</strong>
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          현재 경로: {window.location.pathname}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          React Router가 올바르게 이 컴포넌트를 렌더링했습니다.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TestPage;
