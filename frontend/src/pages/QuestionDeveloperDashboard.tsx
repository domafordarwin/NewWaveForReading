import { Box, Paper, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, IconButton } from "@mui/material";
import { MenuBook, Quiz, Edit, Add, Visibility, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/session";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const QuestionDeveloperDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [bookCount, setBookCount] = useState<number>(0);

  useEffect(() => {
    const fetchBookCount = async () => {
      if (!supabase) return;

      try {
        const { count, error } = await supabase
          .from("stimuli")
          .select("*", { count: "exact", head: true });

        if (error) throw error;
        setBookCount(count || 0);
      } catch (error) {
        console.error("Error fetching book count:", error);
      }
    };

    fetchBookCount();
  }, []);

  const recentQuestions = [
    { id: 1, book: "동물농장", topic: "권력의 부패 분석", type: "분석형", status: "활성" },
    { id: 2, book: "어린왕자", topic: "관계의 본질", type: "비평형", status: "활성" },
    { id: 3, book: "사피엔스", topic: "미래 사회 예측", type: "창의형", status: "검토중" },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        문항 개발 교사 대시보드
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        안녕하세요, {user?.name || "선생님"}! 문항 개발 현황을 확인하세요.
      </Typography>

      <Grid container spacing={3}>
        {/* 요약 카드 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>등록된 도서</Typography>
                  <Typography variant="h4" fontWeight="bold">{bookCount}</Typography>
                </Box>
                <MenuBook sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>개발된 문항</Typography>
                  <Typography variant="h4" fontWeight="bold">45</Typography>
                </Box>
                <Quiz sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>검토 대기</Typography>
                  <Typography variant="h4" fontWeight="bold">3</Typography>
                </Box>
                <Edit sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>이번 달 신규</Typography>
                  <Typography variant="h4" fontWeight="bold">8</Typography>
                </Box>
                <Add sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 빠른 액션 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              빠른 액션
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<MenuBook />}
                fullWidth
                onClick={() => navigate("/question-dev/stimuli/new")}
              >
                새 도서 등록
              </Button>
              <Button
                variant="contained"
                startIcon={<Quiz />}
                fullWidth
                color="secondary"
                onClick={() => navigate("/question-dev/authoring")}
              >
                새 문항 개발
              </Button>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                fullWidth
                onClick={() => navigate("/question-dev/items")}
              >
                문항 검토하기
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* 최근 개발 문항 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                최근 개발 문항
              </Typography>
              <Button size="small" onClick={() => navigate("/question-dev/authoring")}>
                전체 보기
              </Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>도서</TableCell>
                  <TableCell>논제</TableCell>
                  <TableCell>유형</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell align="right">액션</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentQuestions.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.book}</TableCell>
                    <TableCell>{row.topic}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        color={row.status === "활성" ? "success" : "warning"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small"><Visibility /></IconButton>
                      <IconButton size="small"><Edit /></IconButton>
                      <IconButton size="small" color="error"><Delete /></IconButton>
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

export default QuestionDeveloperDashboard;
