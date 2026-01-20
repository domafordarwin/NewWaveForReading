import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import { People, Assignment, Grading, Schedule } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/session";
import { useSupabase } from "../services/supabaseClient";

const TeacherDashboard = () => {
  const user = getCurrentUser();
  const supabase = useSupabase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentsCount, setStudentsCount] = useState(0);
  const [sessions, setSessions] = useState<
    {
      session_id: number;
      status: string;
      submitted_at: string | null;
      created_at: string;
      student?: { name: string };
      stimulus?: { title: string };
    }[]
  >([]);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!supabase || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (!user.schoolId) {
          setStudentsCount(0);
        } else {
          const { count, error: studentsError } = await supabase
            .from("users")
            .select("user_id", { count: "exact", head: true })
            .eq("user_type", "STUDENT")
            .eq("school_id", user.schoolId);

          if (studentsError) {
            throw studentsError;
          }

          setStudentsCount(count ?? 0);
        }

        const { data: sessionsData, error: sessionsError } = await supabase
          .from("assessment_sessions")
          .select(
            `
            session_id,
            status,
            submitted_at,
            created_at,
            student:users!assessment_sessions_student_id_fkey(name),
            stimulus:stimuli(title)
          `,
          )
          .eq("assigned_by", user.userId)
          .order("created_at", { ascending: false });

        if (sessionsError) {
          throw sessionsError;
        }

        interface RawSession {
          session_id: number | string;
          status: string;
          submitted_at: string | null;
          created_at: string;
          student?: { name: string }[]; // as returned by Supabase join
          stimulus?: { title: string }[]; // as returned by Supabase join
        }

        setSessions(
          (sessionsData || []).map((item: RawSession) => ({
            session_id: Number(item.session_id),
            status: String(item.status),
            submitted_at: item.submitted_at ? String(item.submitted_at) : null,
            created_at: String(item.created_at),
            student: Array.isArray(item.student) && item.student.length > 0
              ? { name: String(item.student[0].name) }
              : undefined,
            stimulus: Array.isArray(item.stimulus) && item.stimulus.length > 0
              ? { title: String(item.stimulus[0].title) }
              : undefined,
          }))
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "대시보드를 불러오는데 실패했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [supabase, user]);

  const pendingEvaluations = useMemo(
    () =>
      sessions.filter((session) =>
        ["submitted", "ai_evaluated"].includes(session.status),
      ),
    [sessions],
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        진단 담당 교사 대시보드
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        안녕하세요, {user?.name || "선생님"}! 학생들의 진단 현황을 확인하세요.
      </Typography>
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* 요약 카드 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>담당 학생</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {studentsCount}
                  </Typography>
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
                  <Typography variant="h4" fontWeight="bold">
                    {pendingEvaluations.length}
                  </Typography>
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
                  <Typography variant="h4" fontWeight="bold">
                    {sessions.length}
                  </Typography>
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
                  <Typography variant="h4" fontWeight="bold">0</Typography>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : pendingEvaluations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      평가 대기 항목이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingEvaluations.map((row) => {
                    const submittedAt = row.submitted_at || row.created_at;
                    const statusLabel =
                      row.status === "ai_evaluated" ? "AI 평가 완료" : "대기중";

                    return (
                      <TableRow key={row.session_id}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                              {(row.student?.name || "?")[0]}
                            </Avatar>
                            {row.student?.name || "알 수 없음"}
                          </Box>
                        </TableCell>
                        <TableCell>{row.stimulus?.title || "-"}</TableCell>
                        <TableCell>
                          {new Date(submittedAt).toLocaleDateString("ko-KR")}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={statusLabel}
                            size="small"
                            color={
                              row.status === "ai_evaluated" ? "info" : "warning"
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate("/teacher/dashboard-new")}
                          >
                            평가하기
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherDashboard;
