/**
 * 학생 대시보드 - 레거시 시스템 기반 현대화
 *
 * 기능:
 * - 진행 중인 진단 목록
 * - 최근 평가 결과 및 점수
 * - 성장 추이 차트
 * - 영역별 레이더 차트
 * - AI 피드백 보기
 */
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import {
  Assignment,
  TrendingUp,
  CheckCircle,
  Schedule,
  Star,
  PlayArrow,
  Visibility,
  Psychology,
  EmojiEvents,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/session";
import { useSupabase } from "../services/supabaseClient";

// 상태별 색상
const statusConfig: Record<
  string,
  { label: string; color: "default" | "warning" | "info" | "success" }
> = {
  assigned: { label: "대기 중", color: "default" },
  in_progress: { label: "진행 중", color: "warning" },
  submitted: { label: "제출 완료", color: "info" },
  ai_evaluated: { label: "AI 평가 완료", color: "info" },
  teacher_reviewed: { label: "검토 완료", color: "success" },
  completed: { label: "완료", color: "success" },
};

// 등급별 색상
const gradeColors: Record<string, string> = {
  A: "#4caf50",
  B: "#2196f3",
  C: "#ff9800",
  D: "#f44336",
};

interface AssessmentSession {
  session_id: number;
  student_id: number;
  grade_band: string;
  stimulus_id: number | null;
  status: string;
  time_limit_minutes: number;
  started_at: string | null;
  submitted_at: string | null;
  created_at: string;
  stimulus?: {
    title: string;
    content_type: string;
  };
}

interface AIEvaluation {
  evaluation_id: number;
  session_id: number;
  comprehension_score: number;
  inference_score: number;
  critical_score: number;
  expression_score: number;
  total_score: number;
  grade_level: string;
  percentile: number | null;
  student_feedback: {
    intro?: string;
    body?: string;
    conclusion?: string;
    overall?: string;
  };
  evaluated_at: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const supabase = useSupabase();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [evaluations, setEvaluations] = useState<AIEvaluation[]>([]);
  const [statistics, setStatistics] = useState({
    averageScore: 0,
    assessmentCount: 0,
    percentileRank: 0,
    currentGrade: "N/A",
  });

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      if (!supabase || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 진단 세션 로드
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("assessment_sessions")
          .select(
            `
            *,
            stimulus:stimuli(title, content_type)
          `,
          )
          .eq("student_id", user.userId)
          .order("created_at", { ascending: false });

        if (sessionsError) {
          console.warn("진단 세션 로드:", sessionsError);
        } else {
          setSessions(sessionsData || []);
        }

        // AI 평가 결과 로드
        const { data: evalData, error: evalError } = await supabase
          .from("ai_evaluations")
          .select("*")
          .in(
            "session_id",
            (sessionsData || []).map((s: AssessmentSession) => s.session_id),
          )
          .order("evaluated_at", { ascending: false });

        if (evalError) {
          console.warn("평가 결과 로드:", evalError);
        } else {
          setEvaluations(evalData || []);

          // 통계 계산
          if (evalData && evalData.length > 0) {
            const totalScore = evalData.reduce(
              (sum: number, e: AIEvaluation) => sum + e.total_score,
              0,
            );
            const avgScore = Math.round(totalScore / evalData.length);
            const latestGrade = evalData[0]?.grade_level || "N/A";

            setStatistics({
              averageScore: avgScore,
              assessmentCount: evalData.length,
              percentileRank: evalData[0]?.percentile || 65,
              currentGrade: latestGrade,
            });
          }
        }
      } catch (err: unknown) {
        console.error("데이터 로드 실패:", err);
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 불러오는데 실패했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [supabase, user]);

  // 진행 중인 진단
  const ongoingSessions = sessions.filter(
    (s) => s.status === "in_progress" || s.status === "assigned",
  );

  // 최근 평가 결과
  const latestEvaluation = evaluations.length > 0 ? evaluations[0] : null;

  // 성장 추이 차트 데이터
  const progressChartData = evaluations
    .slice(0, 6)
    .reverse()
    .map((e, index) => ({
      name: `${index + 1}회`,
      점수: e.total_score,
    }));

  // 영역별 레이더 차트 데이터
  const radarChartData = latestEvaluation
    ? [
        {
          subject: "이해력",
          score: latestEvaluation.comprehension_score,
          fullMark: 25,
        },
        {
          subject: "추론력",
          score: latestEvaluation.inference_score,
          fullMark: 25,
        },
        {
          subject: "비판적\n사고",
          score: latestEvaluation.critical_score,
          fullMark: 25,
        },
        {
          subject: "표현력",
          score: latestEvaluation.expression_score,
          fullMark: 25,
        },
      ]
    : [];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        학생 대시보드
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        안녕하세요, {user?.name || "학생"}님! 오늘도 열심히 읽고 생각해봐요. 📚
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 요약 카드들 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    완료한 진단
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {statistics.assessmentCount}
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    평균 점수
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {statistics.averageScore}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    백분위
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {statistics.percentileRank}%
                  </Typography>
                </Box>
                <EmojiEvents sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${gradeColors[statistics.currentGrade] || "#9e9e9e"} 0%, ${gradeColors[statistics.currentGrade] || "#757575"} 100%)`,
              color: "white",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    현재 등급
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {statistics.currentGrade}
                  </Typography>
                </Box>
                <Star sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* 진행 중인 진단 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <Schedule sx={{ mr: 1, verticalAlign: "middle" }} />
              진행 중인 진단
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {ongoingSessions.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CheckCircle
                  sx={{ fontSize: 48, color: "success.main", mb: 2 }}
                />
                <Typography color="text.secondary">
                  현재 진행 중인 진단이 없습니다.
                </Typography>
              </Box>
            ) : (
              ongoingSessions.map((session) => (
                <Card
                  key={session.session_id}
                  sx={{ mb: 2 }}
                  variant="outlined"
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {session.stimulus?.title || "독서 진단"}
                      </Typography>
                      <Chip
                        label={
                          statusConfig[session.status]?.label || session.status
                        }
                        color={statusConfig[session.status]?.color || "default"}
                        size="small"
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      학년군: {session.grade_band} · 제한시간:{" "}
                      {session.time_limit_minutes}분
                    </Typography>
                    {session.status === "in_progress" && (
                      <LinearProgress
                        variant="determinate"
                        value={50}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={() =>
                        navigate(`/student/assessment/${session.session_id}`)
                      }
                    >
                      {session.status === "in_progress"
                        ? "계속하기"
                        : "시작하기"}
                    </Button>
                  </CardActions>
                </Card>
              ))
            )}
          </Paper>
        </Grid>

        {/* 최근 피드백 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <Psychology sx={{ mr: 1, verticalAlign: "middle" }} />
              AI 피드백
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {latestEvaluation?.student_feedback ? (
              <Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {latestEvaluation.student_feedback.overall ||
                    "피드백을 확인해보세요."}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => navigate("/student/feedback")}
                >
                  자세히 보기
                </Button>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                아직 피드백이 없습니다. 진단을 완료하면 AI가 피드백을
                제공합니다.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* 성장 추이 차트 */}
        {progressChartData.length > 1 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <TrendingUp sx={{ mr: 1, verticalAlign: "middle" }} />
                성장 추이
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={progressChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="점수"
                    stroke="#667eea"
                    strokeWidth={2}
                    dot={{ fill: "#667eea" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}

        {/* 영역별 레이더 차트 */}
        {radarChartData.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                영역별 분석
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarChartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 25]} />
                  <Radar
                    name="점수"
                    dataKey="score"
                    stroke="#667eea"
                    fill="#667eea"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
