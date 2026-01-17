import { Box, Paper, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemText, ListItemIcon, Chip } from "@mui/material";
import { School, People, Class, Assessment, PersonAdd, Settings } from "@mui/icons-material";
import { getCurrentUser } from "../utils/session";

const SchoolAdminDashboard = () => {
  const user = getCurrentUser();

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        학교 관리자 대시보드
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        안녕하세요, {user?.name || "관리자"}님! {user?.schoolName || "학교"} 현황을 확인하세요.
      </Typography>

      <Grid container spacing={3}>
        {/* 학교 현황 카드 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>전체 학생</Typography>
                  <Typography variant="h4" fontWeight="bold">156</Typography>
                </Box>
                <People sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>반 수</Typography>
                  <Typography variant="h4" fontWeight="bold">8</Typography>
                </Box>
                <Class sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>담당 교사</Typography>
                  <Typography variant="h4" fontWeight="bold">5</Typography>
                </Box>
                <School sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>진행 중 진단</Typography>
                  <Typography variant="h4" fontWeight="bold">12</Typography>
                </Box>
                <Assessment sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 빠른 메뉴 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              빠른 메뉴
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth startIcon={<PersonAdd />} sx={{ py: 2 }}>
                  사용자 등록
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth startIcon={<Class />} sx={{ py: 2 }}>
                  반 편성
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth startIcon={<Assessment />} sx={{ py: 2 }}>
                  진단 현황
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth startIcon={<Settings />} sx={{ py: 2 }}>
                  학교 설정
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* 최근 활동 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              최근 활동
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><PersonAdd color="primary" /></ListItemIcon>
                <ListItemText
                  primary="신규 학생 5명 등록"
                  secondary="2024.12.20 14:30"
                />
                <Chip label="완료" size="small" color="success" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Class color="primary" /></ListItemIcon>
                <ListItemText
                  primary="2학년 3반 생성"
                  secondary="2024.12.19 10:00"
                />
                <Chip label="완료" size="small" color="success" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Assessment color="primary" /></ListItemIcon>
                <ListItemText
                  primary="1학기 진단 배정"
                  secondary="2024.12.18 09:00"
                />
                <Chip label="진행중" size="small" color="warning" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SchoolAdminDashboard;
