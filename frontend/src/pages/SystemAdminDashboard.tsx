import { Box, Paper, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemText, ListItemIcon, Chip, LinearProgress } from "@mui/material";
import { Storage, People, Security, Speed, Warning, CheckCircle, School } from "@mui/icons-material";
import { getCurrentUser } from "../utils/session";

const SystemAdminDashboard = () => {
  const user = getCurrentUser();

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        시스템 관리자 대시보드
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        안녕하세요, {user?.name || "관리자"}님! 시스템 현황을 확인하세요.
      </Typography>

      <Grid container spacing={3}>
        {/* 시스템 현황 카드 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>전체 사용자</Typography>
                  <Typography variant="h4" fontWeight="bold">1,234</Typography>
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
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>등록 학교</Typography>
                  <Typography variant="h4" fontWeight="bold">15</Typography>
                </Box>
                <School sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>DB 사용량</Typography>
                  <Typography variant="h4" fontWeight="bold">45%</Typography>
                </Box>
                <Storage sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>시스템 상태</Typography>
                  <Typography variant="h4" fontWeight="bold">정상</Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 시스템 상태 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              시스템 리소스
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">CPU 사용량</Typography>
                  <Typography variant="body2">23%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={23} color="primary" />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">메모리 사용량</Typography>
                  <Typography variant="body2">58%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={58} color="secondary" />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">스토리지</Typography>
                  <Typography variant="body2">45%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={45} color="success" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* 빠른 메뉴 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              관리 메뉴
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth startIcon={<People />} sx={{ py: 2 }}>
                  사용자 관리
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth startIcon={<School />} sx={{ py: 2 }}>
                  학교 관리
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth startIcon={<Security />} sx={{ py: 2 }}>
                  권한 관리
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth startIcon={<Storage />} sx={{ py: 2 }}>
                  DB 관리
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* 시스템 로그 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              최근 시스템 로그
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                <ListItemText
                  primary="데이터베이스 백업 완료"
                  secondary="2024.12.20 03:00:00"
                />
                <Chip label="성공" size="small" color="success" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Speed color="primary" /></ListItemIcon>
                <ListItemText
                  primary="API 응답 시간 정상"
                  secondary="2024.12.20 02:30:00 | 평균 45ms"
                />
                <Chip label="정상" size="small" color="primary" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Warning color="warning" /></ListItemIcon>
                <ListItemText
                  primary="높은 트래픽 감지"
                  secondary="2024.12.19 14:00:00 | 일시적 부하"
                />
                <Chip label="주의" size="small" color="warning" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemAdminDashboard;
