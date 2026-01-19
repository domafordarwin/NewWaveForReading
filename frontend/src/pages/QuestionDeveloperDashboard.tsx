import { Box, Paper, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, IconButton, CircularProgress } from "@mui/material";
import { MenuBook, Quiz, Edit, Add, Visibility, Article } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/session";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const itemTypeLabels: Record<string, string> = {
  mcq_single: "객관식(단일)",
  mcq_multi: "객관식(복수)",
  short_text: "단답형",
  essay: "서술형",
  fill_blank: "빈칸 채우기",
  composite: "복합문항",
  survey: "설문",
};

interface RecentQuestion {
  item_id: number;
  stimulus_title: string;
  stem: string;
  item_type: string;
  is_active: boolean;
}

const QuestionDeveloperDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [bookCount, setBookCount] = useState<number>(0);
  const [stimuliCount, setStimuliCount] = useState<number>(0);
  const [itemCount, setItemCount] = useState<number>(0);
  const [reviewPendingCount, setReviewPendingCount] = useState<number>(0);
  const [monthlyNewCount, setMonthlyNewCount] = useState<number>(0);
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!supabase) return;

      try {
        // 등록된 도서 수 (books 테이블)
        const { count: booksCount } = await supabase
          .from("books")
          .select("*", { count: "exact", head: true });
        setBookCount(booksCount || 0);

        // 등록된 지문 수 (stimuli 테이블)
        const { count: stimuliCountData } = await supabase
          .from("stimuli")
          .select("*", { count: "exact", head: true });
        setStimuliCount(stimuliCountData || 0);

        // 개발된 문항 수
        const { count: itemsCount } = await supabase
          .from("item_bank")
          .select("*", { count: "exact", head: true });
        setItemCount(itemsCount || 0);

        // 검토 대기 문항 수 (is_active가 false인 항목으로 추정)
        const { count: reviewCount } = await supabase
          .from("item_bank")
          .select("*", { count: "exact", head: true })
          .eq("is_active", false);
        setReviewPendingCount(reviewCount || 0);

        // 이번 달 신규 문항 수
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: monthlyCount } = await supabase
          .from("item_bank")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfMonth.toISOString());
        setMonthlyNewCount(monthlyCount || 0);

        // 최근 개발 문항 (최근 3개)
        const { data: recentItems } = await supabase
          .from("item_bank")
          .select(`
            item_id,
            stem,
            item_type,
            is_active,
            stimuli:stimulus_id (
              title
            )
          `)
          .order("created_at", { ascending: false })
          .limit(3);

        if (recentItems) {
          const formattedQuestions: RecentQuestion[] = recentItems.map((item: any) => ({
            item_id: item.item_id,
            stimulus_title: item.stimuli?.title || "지문 없음",
            stem: item.stem,
            item_type: item.item_type,
            is_active: item.is_active,
          }));
          setRecentQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          문항 개발 교사 대시보드
        </Typography>
        <Typography variant="body1" color="text.secondary">
          안녕하세요, {user?.name || "선생님"}! 문항 개발 현황을 확인하세요.
        </Typography>
      </Paper>

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
          <Card sx={{ background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>등록된 지문</Typography>
                  <Typography variant="h4" fontWeight="bold">{stimuliCount}</Typography>
                </Box>
                <Article sx={{ fontSize: 48, opacity: 0.8 }} />
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
                  <Typography variant="h4" fontWeight="bold">{itemCount}</Typography>
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
                  <Typography variant="h4" fontWeight="bold">{reviewPendingCount}</Typography>
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
                  <Typography variant="h4" fontWeight="bold">{monthlyNewCount}</Typography>
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
                onClick={() => navigate("/question-dev/books/new")}
              >
                새 도서 등록
              </Button>
              <Button
                variant="contained"
                startIcon={<Article />}
                fullWidth
                color="info"
                onClick={() => navigate("/question-dev/stimuli/new")}
              >
                새 지문 등록
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
              <Button size="small" onClick={() => navigate("/question-dev/items")}>
                전체 보기
              </Button>
            </Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>도서</TableCell>
                    <TableCell>문항 내용</TableCell>
                    <TableCell>유형</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell align="right">액션</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentQuestions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          최근 개발된 문항이 없습니다.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentQuestions.map((row) => (
                      <TableRow key={row.item_id}>
                        <TableCell>{row.stimulus_title}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 300,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.stem}
                          </Typography>
                        </TableCell>
                        <TableCell>{itemTypeLabels[row.item_type] || row.item_type}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.is_active ? "활성" : "비활성"}
                            size="small"
                            color={row.is_active ? "success" : "default"}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => navigate(`/question-dev/items/${row.item_id}`)}>
                            <Visibility />
                          </IconButton>
                          <IconButton size="small" onClick={() => navigate(`/question-dev/items/${row.item_id}/edit`)}>
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionDeveloperDashboard;
