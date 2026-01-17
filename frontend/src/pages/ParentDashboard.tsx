import { Box, Paper, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import { ChildCare, Assessment, TrendingUp, Event, Chat } from "@mui/icons-material";
import { getCurrentUser } from "../utils/session";

const ParentDashboard = () => {
  const user = getCurrentUser();

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        학부모 대시보드
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        안녕하세요, {user?.name || "학부모"}님! 자녀의 학습 현황을 확인하세요.
      </Typography>

      <Grid container spacing={3}>
        {/* 자녀 정보 카드 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <ChildCare sx={{ fontSize: 48 }} />
                <Box>
                  <Typography variant="h6">김민준</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>서울중학교 2학년</Typography>
                </Box>
              </Box>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.3)", my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>현재 등급</Typography>
                  <Typography variant="h5" fontWeight="bold">A</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>평균 점수</Typography>
                  <Typography variant="h5" fontWeight="bold">78점</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 최근 진단 결과 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                최근 진단 결과
              </Typography>
              <Button size="small">전체보기</Button>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon><Assessment color="primary" /></ListItemIcon>
                <ListItemText
                  primary="동물농장 - 권력의 부패 분석"
                  secondary="2024.12.20 | 75점 (B등급)"
                />
                <Button variant="outlined" size="small">상세보기</Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon><Assessment color="primary" /></ListItemIcon>
                <ListItemText
                  primary="어린왕자 - 관계의 의미"
                  secondary="2024.12.15 | 82점 (A등급)"
                />
                <Button variant="outlined" size="small">상세보기</Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* 학습 추이 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TrendingUp color="primary" />
              <Typography variant="h6" fontWeight="bold">학습 추이</Typography>
            </Box>
            <Box sx={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f5f5f5", borderRadius: 2 }}>
              <Typography color="text.secondary">차트 영역 (추후 구현)</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* 상담 신청 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Chat color="primary" />
              <Typography variant="h6" fontWeight="bold">상담</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                담당 선생님과 자녀의 학습에 대해 상담하세요.
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<Event />} fullWidth>
              상담 신청하기
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ParentDashboard;
