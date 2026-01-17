import { Box, Paper, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, Avatar } from "@mui/material";
import { People, Assignment, Grading, Schedule } from "@mui/icons-material";
import { getCurrentUser } from "../utils/session";

const TeacherDashboard = () => {
  const user = getCurrentUser();

  const pendingEvaluations = [
    { id: 1, student: "김민준", assessment: "동물농장", submittedAt: "2024.12.20", status: "대기중" },
    { id: 2, student: "이서연", assessment: "어린왕자", submittedAt: "2024.12.19", status: "대기중" },
    { id: 3, student: "박지훈", assessment: "사피엔스", submittedAt: "2024.12.18", status: "진행중" },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        진단 담당 교사 대시보드
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        안녕하세요, {user?.name || "선생님"}! 학생들의 진단 현황을 확인하세요.
      </Typography>

      <Grid container spacing={3}>
        {/* 요약 카드 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>담당 학생</Typography>
                  <Typography variant="h4" fontWeight="bold">24</Typography>
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
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>평가 대기</Typography>
                  <Typography variant="h4" fontWeight="bold">8</Typography>
                </Box>
                <Grading sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>배정된 진단</Typography>
                  <Typography variant="h4" fontWeight="bold">15</Typography>
                </Box>
                <Assignment sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>상담 예정</Typography>
                  <Typography variant="h4" fontWeight="bold">3</Typography>
                </Box>
                <Schedule sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 평가 대기 목록 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                평가 대기 목록
              </Typography>
              <Button variant="contained" size="small">
                전체 보기
              </Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>학생</TableCell>
                  <TableCell>진단명</TableCell>
                  <TableCell>제출일</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell align="right">액션</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingEvaluations.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                          {row.student[0]}
                        </Avatar>
                        {row.student}
                      </Box>
                    </TableCell>
                    <TableCell>{row.assessment}</TableCell>
                    <TableCell>{row.submittedAt}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        color={row.status === "대기중" ? "warning" : "info"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" size="small">
                        평가하기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherDashboard;
