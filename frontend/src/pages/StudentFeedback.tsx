/**
 * 학생 피드백 페이지 - AI 평가 결과 및 교사 피드백 조회
 *
 * 기능:
 * - 평가 세션 목록
 * - AI 피드백 상세 보기
 * - 교사 피드백 상세 보기
 * - 루브릭별 점수 및 첨삭 내용
 */
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore, Psychology, School } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/session";
import { useSupabase } from "../services/supabaseClient";

interface EvaluationSession {
  session_id: number;
  status: string;
  submitted_at: string | null;
  created_at: string;
  stimulus?: {
    title: string;
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
  rubric_scores: RubricScore[];
  strengths: string[];
  weaknesses: string[];
  student_feedback: {
    intro?: string;
    body?: string;
    conclusion?: string;
    overall?: string;
  };
  line_edits: LineEdit[];
  spelling_errors: number;
  grammar_errors: number;
  evaluated_at: string;
}

interface TeacherFeedback {
  feedback_id: number;
  teacher_id: number;
  summary_intro: string | null;
  summary_body: string | null;
  summary_conclusion: string | null;
  topic_understanding: string | null;
  example_analysis: string | null;
  logical_flow: string | null;
  expression_quality: string | null;
  overall_comment: string | null;
  feedback_status: string;
  created_at: string;
  [key: string]: string | number | null;
}

interface RubricScore {
  criterion: string;
  level: string;
  score: number;
  maxScore: number;
  evidence: string;
  nextAction: string;
}

interface LineEdit {
  original: string;
  suggested: string;
  reason: string;
  category: string;
}

interface StudentAnswer {
  answer_id: number;
  answer_content: string;
}

const StudentFeedback = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const supabase = useSupabase();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<EvaluationSession[]>([]);
  const [evaluations, setEvaluations] = useState<Map<number, AIEvaluation>>(
    new Map(),
  );
  const [teacherFeedbacks, setTeacherFeedbacks] = useState<
    Map<number, TeacherFeedback>
  >(new Map());
  const [answers, setAnswers] = useState<Map<number, StudentAnswer>>(new Map());
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );
  const [tabValue, setTabValue] = useState(0);

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

        // 완료된 세션 로드
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("assessment_sessions")
          .select(
            `
            session_id,
            status,
            submitted_at,
            created_at,
            stimulus:stimuli(title)
          `,
          )
          .eq("student_id", user.userId)
          .in("status", ["ai_evaluated", "teacher_reviewed", "completed"])
          .order("submitted_at", { ascending: false });

        if (sessionsError) {
          console.warn("세션 로드 에러:", sessionsError);
          setError("피드백 데이터를 불러오는데 실패했습니다.");
          return;
        }

        if (!sessionsData || sessionsData.length === 0) {
          setError("아직 완료된 평가가 없습니다.");
          setLoading(false);
          return;
        }

        // 데이터 형식 변환
        const formattedSessions = sessionsData.map(
          (s: Record<string, unknown>) => ({
            session_id: s.session_id as number,
            status: s.status as string,
            submitted_at: s.submitted_at as string | null,
            created_at: s.created_at as string,
            stimulus:
              Array.isArray(s.stimulus) && s.stimulus[0]
                ? { title: (s.stimulus[0] as { title: string }).title }
                : undefined,
          }),
        );

        setSessions(formattedSessions);
        setSelectedSessionId(formattedSessions[0]?.session_id);

        const sessionIds = formattedSessions.map(
          (s: EvaluationSession) => s.session_id,
        );

        // AI 평가 결과 로드
        const { data: evalData } = await supabase
          .from("ai_evaluations")
          .select("*")
          .in("session_id", sessionIds);

        if (evalData) {
          const evalMap = new Map<number, AIEvaluation>();
          evalData.forEach((e: AIEvaluation) => {
            evalMap.set(e.session_id, e);
          });
          setEvaluations(evalMap);

          // 교사 피드백 로드
          const evalIds = evalData.map((e: AIEvaluation) => e.evaluation_id);
          const { data: teacherData } = await supabase
            .from("teacher_feedbacks")
            .select("*")
            .in("evaluation_id", evalIds);

          if (teacherData) {
            const feedbackMap = new Map<number, TeacherFeedback>();
            teacherData.forEach(
              (f: TeacherFeedback & { evaluation_id: number }) => {
                // evaluation_id를 session_id로 매핑
                const evaluation = evalData.find(
                  (e: AIEvaluation) => e.evaluation_id === f.evaluation_id,
                );
                if (evaluation) {
                  feedbackMap.set(evaluation.session_id, f);
                }
              },
            );
            setTeacherFeedbacks(feedbackMap);
          }
        }

        // 학생 답안 로드
        const { data: answerData } = await supabase
          .from("student_answers")
          .select("*")
          .in("session_id", sessionIds);

        if (answerData) {
          const answerMap = new Map<number, StudentAnswer>();
          answerData.forEach((a: StudentAnswer & { session_id: number }) => {
            answerMap.set(a.session_id, a);
          });
          setAnswers(answerMap);
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

  // 선택된 세션의 데이터
  const selectedSession = useMemo(() => {
    if (!selectedSessionId) return null;
    return sessions.find((s) => s.session_id === selectedSessionId);
  }, [sessions, selectedSessionId]);

  const selectedEvaluation = useMemo(() => {
    if (!selectedSessionId) return null;
    return evaluations.get(selectedSessionId);
  }, [evaluations, selectedSessionId]);

  const selectedTeacherFeedback = useMemo(() => {
    if (!selectedSessionId) return null;
    return teacherFeedbacks.get(selectedSessionId);
  }, [teacherFeedbacks, selectedSessionId]);

  const selectedAnswer = useMemo(() => {
    if (!selectedSessionId) return null;
    return answers.get(selectedSessionId);
  }, [answers, selectedSessionId]);

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

  if (error && sessions.length === 0) {
    return (
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          피드백
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/student/dashboard")}
        >
          대시보드로 이동
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        피드백
      </Typography>

      {/* 세션 목록 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          평가 세션
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>지문</TableCell>
                <TableCell>제출일</TableCell>
                <TableCell align="center">점수</TableCell>
                <TableCell align="center">등급</TableCell>
                <TableCell align="center">상태</TableCell>
                <TableCell align="center">보기</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => {
                const evaluation = evaluations.get(session.session_id);
                const hasFeedback = teacherFeedbacks.has(session.session_id);
                return (
                  <TableRow
                    key={session.session_id}
                    hover
                    selected={session.session_id === selectedSessionId}
                  >
                    <TableCell>
                      {session.stimulus?.title || "진단 평가"}
                    </TableCell>
                    <TableCell>
                      {session.submitted_at
                        ? new Date(session.submitted_at).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      {evaluation?.total_score || "-"}점
                    </TableCell>
                    <TableCell align="center">
                      {evaluation?.grade_level && (
                        <Chip
                          label={evaluation.grade_level}
                          size="small"
                          color={
                            evaluation.grade_level === "A"
                              ? "success"
                              : evaluation.grade_level === "B"
                                ? "primary"
                                : evaluation.grade_level === "C"
                                  ? "warning"
                                  : "error"
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={hasFeedback ? "교사 검토 완료" : "AI 평가 완료"}
                        color={hasFeedback ? "success" : "info"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant={
                          session.session_id === selectedSessionId
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() => setSelectedSessionId(session.session_id)}
                      >
                        보기
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 선택된 세션 상세 */}
      {selectedSession && selectedEvaluation && (
        <>
          {/* 탭 전환 */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              variant="fullWidth"
            >
              <Tab
                icon={<Psychology />}
                label="AI 피드백"
                iconPosition="start"
              />
              <Tab icon={<School />} label="교사 피드백" iconPosition="start" />
            </Tabs>
          </Paper>

          {/* 내 답안 */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              📝 내 답안
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                whiteSpace: "pre-wrap",
                maxHeight: 200,
                overflow: "auto",
              }}
            >
              {selectedAnswer?.answer_content ||
                "답안 내용을 찾을 수 없습니다."}
            </Box>
          </Paper>

          {/* AI 피드백 탭 */}
          {tabValue === 0 && (
            <>
              {/* 점수 요약 */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        총점
                      </Typography>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        color="primary"
                      >
                        {selectedEvaluation.total_score}
                      </Typography>
                      <Chip
                        label={`${selectedEvaluation.grade_level}등급`}
                        color="primary"
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={2.25}>
                  <Card>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        이해력
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {selectedEvaluation.comprehension_score}
                      </Typography>
                      <Typography variant="caption">/25</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={2.25}>
                  <Card>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        추론력
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {selectedEvaluation.inference_score}
                      </Typography>
                      <Typography variant="caption">/25</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={2.25}>
                  <Card>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        비판적 사고
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {selectedEvaluation.critical_score}
                      </Typography>
                      <Typography variant="caption">/25</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={2.25}>
                  <Card>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        표현력
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {selectedEvaluation.expression_score}
                      </Typography>
                      <Typography variant="caption">/25</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* AI 피드백 내용 */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  🤖 AI 피드백
                </Typography>
                <Grid container spacing={2}>
                  {(["intro", "body", "conclusion"] as const).map((section) => (
                    <Grid item xs={12} md={4} key={section}>
                      <Paper sx={{ p: 2, bgcolor: "grey.50", height: "100%" }}>
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          gutterBottom
                        >
                          [
                          {section === "intro"
                            ? "서론"
                            : section === "body"
                              ? "본론"
                              : "결론"}
                          ]
                        </Typography>
                        <Typography variant="body2">
                          {selectedEvaluation.student_feedback?.[section] ||
                            "피드백이 없습니다."}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {selectedEvaluation.student_feedback?.overall && (
                  <Box
                    sx={{ mt: 2, p: 2, bgcolor: "primary.50", borderRadius: 2 }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      💡 종합 피드백
                    </Typography>
                    <Typography variant="body2">
                      {selectedEvaluation.student_feedback.overall}
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* 강점 & 약점 */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      ✨ 강점
                    </Typography>
                    {selectedEvaluation.strengths?.map((s, i) => (
                      <Chip
                        key={i}
                        label={s}
                        color="success"
                        variant="outlined"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      📈 개선점
                    </Typography>
                    {selectedEvaluation.weaknesses?.map((w, i) => (
                      <Chip
                        key={i}
                        label={w}
                        color="warning"
                        variant="outlined"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Paper>
                </Grid>
              </Grid>

              {/* 문장별 첨삭 */}
              {selectedEvaluation.line_edits?.length > 0 && (
                <Paper sx={{ p: 3 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    ✏️ 문장별 첨삭
                  </Typography>
                  {selectedEvaluation.line_edits.map((edit, i) => (
                    <Accordion key={i}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Chip
                            label={
                              edit.category === "spelling"
                                ? "맞춤법"
                                : edit.category === "grammar"
                                  ? "문법"
                                  : edit.category === "expression"
                                    ? "표현"
                                    : "논리"
                            }
                            size="small"
                            color={
                              edit.category === "spelling"
                                ? "error"
                                : edit.category === "grammar"
                                  ? "warning"
                                  : "info"
                            }
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: "line-through",
                              color: "error.main",
                            }}
                          >
                            {edit.original.substring(0, 50)}...
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            원문:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: "line-through",
                              color: "error.main",
                            }}
                          >
                            {edit.original}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            수정 제안:
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            {edit.suggested}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          이유: {edit.reason}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Paper>
              )}
            </>
          )}

          {/* 교사 피드백 탭 */}
          {tabValue === 1 && (
            <Paper sx={{ p: 3 }}>
              {selectedTeacherFeedback ? (
                <>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    👨‍🏫 교사 피드백
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                      { key: "summary_intro", label: "서론" },
                      { key: "summary_body", label: "본론" },
                      { key: "summary_conclusion", label: "결론" },
                    ].map((item) => (
                      <Grid item xs={12} md={4} key={item.key}>
                        <Paper
                          sx={{ p: 2, bgcolor: "grey.50", height: "100%" }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="secondary"
                            gutterBottom
                          >
                            [{item.label}]
                          </Typography>
                          <Typography variant="body2">
                            {selectedTeacherFeedback[item.key] ||
                              "피드백이 없습니다."}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    {[
                      { key: "topic_understanding", label: "주제 이해" },
                      { key: "example_analysis", label: "사례 분석" },
                      { key: "logical_flow", label: "논리적 전개" },
                      { key: "expression_quality", label: "표현력" },
                    ].map((item) => (
                      <Grid item xs={12} md={6} key={item.key}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {item.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedTeacherFeedback[item.key] ||
                              "평가 내용이 없습니다."}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>

                  {selectedTeacherFeedback.overall_comment && (
                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        bgcolor: "secondary.50",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        💬 종합 코멘트
                      </Typography>
                      <Typography variant="body2">
                        {selectedTeacherFeedback.overall_comment}
                      </Typography>
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <School
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography color="text.secondary">
                    아직 교사 피드백이 등록되지 않았습니다.
                  </Typography>
                </Box>
              )}
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default StudentFeedback;
