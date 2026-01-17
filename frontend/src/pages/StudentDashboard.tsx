import { Box, Paper, Typography, Grid, Card, CardContent, Button, Chip, LinearProgress } from "@mui/material";
import { Assignment, TrendingUp, MenuBook, Star } from "@mui/icons-material";
import { getCurrentUser } from "../utils/session";

const StudentDashboard = () => {
  const user = getCurrentUser();

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        학생 대시보드
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        안녕하세요, {user?.name || "학생"}님! 오늘도 열심히 읽고 생각해봐요.
      </Typography>

      <Grid container spacing={3}>
        {/* 요약 카드들 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>완료한 진단</Typography>
                  <Typography variant="h4" fontWeight="bold">3</Typography>
                </Box>
                <Assignment sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>평균 점수</Typography>
                  <Typography variant="h4" fontWeight="bold">78</Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>읽은 도서</Typography>
                  <Typography variant="h4" fontWeight="bold">5</Typography>
                </Box>
                <MenuBook sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>현재 등급</Typography>
                  <Typography variant="h4" fontWeight="bold">A</Typography>
                </Box>
                <Star sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 진행 중인 진단 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              진행 중인 진단
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography>어린왕자 - 독서 감상문</Typography>
                <Chip label="진행중" color="warning" size="small" />
              </Box>
              <LinearProgress variant="determinate" value={60} sx={{ mb: 2 }} />
              <Button variant="contained" size="small">
                계속하기
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* 최근 피드백 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              최근 피드백
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                "논리적 전개가 좋아졌습니다. 근거를 더 구체적으로 제시하면 더 좋겠어요."
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                - 김선생님, 2024.12.20
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
