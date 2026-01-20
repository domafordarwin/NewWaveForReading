/**
 * 교사 대시보드 - 학급 관리 및 학생 분석
 *
 * 기능:
 * - 학급별 학생 목록
 * - 진단 배정 및 관리
 * - 학생별 평가 결과 조회
 * - AI 학급 분석 리포트
 * - 교사 피드백 작성
 */
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  People,
  Assignment,
  CheckCircle,
  TrendingUp,
  Visibility,
  Add,
  Psychology,
  Send,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/session";
import { useSupabase } from "../services/supabaseClient";
import {
  generateClassAnalysis,
  type AIEvaluationResult,
} from "../services/aiFeedbackService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface Student {
  user_id: number;
  name: string;
  email: string;
  grade: number;
  school_name: string;
}

interface ClassInfo {
  class_id: number;
  class_name: string;
  grade: number;
  academic_year: number;
  student_count?: number;
}

interface AssessmentSession {
  session_id: number;
  student_id: number;
  status: string;
  submitted_at: string | null;
  created_at: string;
  student?: {
    name: string;
  };
  stimulus?: {
    title: string;
  };
}

interface EvaluationWithStudent {
  evaluation_id: number;
  session_id: number;
  total_score: number;
  grade_level: string;
  comprehension_score: number;
  inference_score: number;
  critical_score: number;
  expression_score: number;
  strengths: string[];
  weaknesses: string[];
  student_name?: string;
}

interface Stimulus {
  stimulus_id: number;
  title: string;
  grade_band: string;
}

const TeacherDashboardNew = () => {
  const user = getCurrentUser();
  const supabase = useSupabase();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 데이터 상태
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationWithStudent[]>([]);
  const [stimuli, setStimuli] = useState<Stimulus[]>([]);

  // 진단 배정 다이얼로그 상태
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignTargetStudent, setAssignTargetStudent] = useState<number | "">(
    "",
  );
  const [assignTargetStimulus, setAssignTargetStimulus] = useState<number | "">(
    "",
  );

  // 통계
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    totalAssessments: 0,
    completedAssessments: 0,
    averageScore: 0,
  });

  // AI 분석
  const [classAnalysis, setClassAnalysis] = useState<{
    classOverview: string;
    strengthAreas: string[];
    improvementAreas: string[];
    teachingRecommendations: string[];
    individualAttention: { studentName: string; note: string }[];
  } | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // 피드백 다이얼로그
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<
    number | null
  >(null);
  const [feedbackData, setFeedbackData] = useState({
    summaryIntro: "",
    summaryBody: "",
    summaryConclusion: "",
    overallComment: "",
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

        // 학생 목록 로드 (동일 학교)
        const { data: studentsData, error: studentsError } = await supabase
          .from("users")
          .select("*")
          .eq("user_type", "STUDENT")
          .eq("is_active", true)
          .eq("school_id", user?.schoolId || 0)
          .order("name");

        if (studentsError) {
          console.warn("학생 로드 에러:", studentsError);
        } else {
          setStudents(studentsData || []);
        }

        // 학급 목록 로드
        const { data: classesData } = await supabase
          .from("classes")
          .select("*")
          .eq("is_active", true)
          .eq("school_id", user?.schoolId || 0)
          .order("grade");

        setClasses(classesData || []);

        // 지문 목록 로드 (진단 배정용)
        const { data: stimuliData } = await supabase
          .from("stimuli")
          .select("stimulus_id, title, grade_band")
          .order("title");
        setStimuli(stimuliData || []);

        // 진단 세션 로드
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("assessment_sessions")
          .select(
            `
            *,
            student:users!assessment_sessions_student_id_fkey(name),
            stimulus:stimuli(title)
          `,
          )
          .eq("school_id", user?.schoolId || 0)
          .order("created_at", { ascending: false })
          .limit(50);

        if (sessionsError) {
          console.warn("세션 로드 에러:", sessionsError);
        } else {
          setSessions(sessionsData || []);
        }

        // 평가 결과 로드
        const completedSessionIds = (sessionsData || [])
          .filter((s: AssessmentSession) =>
            ["ai_evaluated", "teacher_reviewed", "completed"].includes(
              s.status,
            ),
          )
          .map((s: AssessmentSession) => s.session_id);

        if (completedSessionIds.length > 0) {
          const { data: evalData } = await supabase
            .from("ai_evaluations")
            .select("*")
            .in("session_id", completedSessionIds);

          if (evalData) {
            // 학생 이름 매핑
            interface EvalRecord {
              evaluation_id: number;
              session_id: number;
              total_score: number;
              grade_level: string;
              comprehension_score: number;
              inference_score: number;
              critical_score: number;
              expression_score: number;
              strengths: string[];
              weaknesses: string[];
            }

            const evalsWithNames = evalData.map((e: EvalRecord) => {
              const session = (sessionsData || []).find(
                (s: AssessmentSession) => s.session_id === e.session_id,
              );
              return {
                ...e,
                student_name: session?.student?.name || "알 수 없음",
              };
            });
            setEvaluations(evalsWithNames);
          }
        }

        // 통계 계산
        const completed = (sessionsData || []).filter(
          (s: AssessmentSession) =>
            s.status === "completed" || s.status === "teacher_reviewed",
        ).length;

        // 평균 점수 계산 - 새로 로드된 데이터 사용
        const loadedEvals = evaluations;
        const avgScore =
          loadedEvals.length > 0
            ? Math.round(
                loadedEvals.reduce((sum, e) => sum + e.total_score, 0) /
                  loadedEvals.length,
              )
            : 0;

        setStatistics({
          totalStudents: (studentsData || []).length,
          totalAssessments: (sessionsData || []).length,
          completedAssessments: completed,
          averageScore: avgScore,
        });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, user, refreshTrigger]);

  // 상태별 세션 수
  const statusData = [
    {
      name: "대기 중",
      value: sessions.filter((s) => s.status === "assigned").length,
    },
    {
      name: "진행 중",
      value: sessions.filter((s) => s.status === "in_progress").length,
    },
    {
      name: "제출 완료",
      value: sessions.filter((s) => s.status === "submitted").length,
    },
    {
      name: "평가 완료",
      value: sessions.filter((s) =>
        ["ai_evaluated", "teacher_reviewed", "completed"].includes(s.status),
      ).length,
    },
  ];

  // AI 학급 분석 생성
  const handleGenerateAnalysis = async () => {
    if (evaluations.length === 0) return;

    setAnalysisLoading(true);
    try {
      const evalResults = evaluations.map((e) => ({
        studentName: e.student_name || "학생",
        result: {
          comprehensionScore: e.comprehension_score,
          inferenceScore: e.inference_score,
          criticalScore: e.critical_score,
          expressionScore: e.expression_score,
          totalScore: e.total_score,
          gradeLevel: e.grade_level as "A" | "B" | "C" | "D",
          rubricScores: [],
          strengths: e.strengths || [],
          weaknesses: e.weaknesses || [],
          studentFeedback: { intro: "", body: "", conclusion: "", overall: "" },
          lineEdits: [],
          spellingErrors: 0,
          grammarErrors: 0,
        } as AIEvaluationResult,
      }));

      const analysis = await generateClassAnalysis({
        className: classes[0]?.class_name || "학급",
        studentCount: students.length,
        evaluations: evalResults,
      });

      setClassAnalysis(analysis);
    } catch (err) {
      console.error("학급 분석 생성 실패:", err);
      setError("학급 분석 생성에 실패했습니다.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  // 피드백 저장
  const handleSaveFeedback = async () => {
    if (!supabase || !selectedEvaluationId || !user) return;

    try {
      const { error: insertError } = await supabase
        .from("teacher_feedbacks")
        .insert({
          evaluation_id: selectedEvaluationId,
          teacher_id: user.userId,
          summary_intro: feedbackData.summaryIntro,
          summary_body: feedbackData.summaryBody,
          summary_conclusion: feedbackData.summaryConclusion,
          overall_comment: feedbackData.overallComment,
          feedback_status: "completed",
        });

      if (insertError) throw insertError;

      setFeedbackDialogOpen(false);
      setFeedbackData({
        summaryIntro: "",
        summaryBody: "",
        summaryConclusion: "",
        overallComment: "",
      });
      // 성공 메시지 표시
    } catch (err) {
      console.error("피드백 저장 실패:", err);
      setError("피드백 저장에 실패했습니다.");
    }
  };

  // 진단 배정 실행
  const handleAssignAssessment = async () => {
    if (!supabase || !user || !assignTargetStudent || !assignTargetStimulus)
      return;

    try {
      // 선택된 지문의 학년군 정보 가져오기 (간소화를 위해 stimuli 상태에서 찾음)
      const selectedStimulus = stimuli.find(
        (s) => s.stimulus_id === assignTargetStimulus,
      );

      const { error: assignError } = await supabase
        .from("assessment_sessions")
        .insert({
          student_id: assignTargetStudent,
          stimulus_id: assignTargetStimulus,
          assigned_by: user.userId,
          grade_band: selectedStimulus?.grade_band || "초고", // 기본값 또는 지문 정보 사용
          status: "assigned",
        });

      if (assignError) throw assignError;

      setAssignDialogOpen(false);
      setAssignTargetStudent("");
      setAssignTargetStimulus("");
      setRefreshTrigger((prev) => prev + 1); // 목록 갱신
    } catch (err) {
      console.error("진단 배정 실패:", err);
      setError("진단 배정에 실패했습니다.");
    }
  };

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
        교사 대시보드
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 통계 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <People sx={{ mr: 1 }} />
              <Typography variant="h6">전체 학생</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {statistics.totalStudents}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "secondary.main",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Assignment sx={{ mr: 1 }} />
              <Typography variant="h6">진단 배정</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {statistics.totalAssessments}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "success.main",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CheckCircle sx={{ mr: 1 }} />
              <Typography variant="h6">완료</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {statistics.completedAssessments}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "info.main",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TrendingUp sx={{ mr: 1 }} />
              <Typography variant="h6">평균 점수</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">
              {statistics.averageScore}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 탭 */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          variant="fullWidth"
        >
          <Tab label="학생 목록" icon={<People />} iconPosition="start" />
          <Tab label="평가 결과" icon={<Assignment />} iconPosition="start" />
          <Tab label="AI 분석" icon={<Psychology />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* 학생 목록 탭 */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              학생 목록
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAssignDialogOpen(true)}
            >
              진단 배정
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell>이름</TableCell>
                  <TableCell>학년</TableCell>
                  <TableCell>학교</TableCell>
                  <TableCell align="center">진단 현황</TableCell>
                  <TableCell align="center">관리</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.slice(0, 10).map((student) => {
                  const studentSessions = sessions.filter(
                    (s) => s.student_id === student.user_id,
                  );
                  const completed = studentSessions.filter((s) =>
                    ["completed", "teacher_reviewed"].includes(s.status),
                  ).length;
                  return (
                    <TableRow
                      key={student.user_id}
                      hover
                      onClick={() =>
                        navigate(`/teacher/students/${student.user_id}`)
                      }
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.grade}학년</TableCell>
                      <TableCell>{student.school_name || "-"}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${completed}/${studentSessions.length}`}
                          size="small"
                          color={completed > 0 ? "success" : "default"}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="상세 보기">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/teacher/students/${student.user_id}`);
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* 평가 결과 탭 */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                최근 평가 결과
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell>학생</TableCell>
                      <TableCell align="center">총점</TableCell>
                      <TableCell align="center">등급</TableCell>
                      <TableCell align="center">피드백</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {evaluations.slice(0, 10).map((evaluation) => (
                      <TableRow key={evaluation.evaluation_id} hover>
                        <TableCell>{evaluation.student_name}</TableCell>
                        <TableCell align="center">
                          {evaluation.total_score}점
                        </TableCell>
                        <TableCell align="center">
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
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="피드백 작성">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedEvaluationId(
                                  evaluation.evaluation_id,
                                );
                                setFeedbackDialogOpen(true);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                상태별 현황
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* AI 분석 탭 */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              <Psychology sx={{ mr: 1, verticalAlign: "middle" }} />
              AI 학급 분석
            </Typography>
            <Button
              variant="contained"
              onClick={handleGenerateAnalysis}
              disabled={analysisLoading || evaluations.length === 0}
              startIcon={
                analysisLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Psychology />
                )
              }
            >
              {analysisLoading ? "분석 중..." : "분석 생성"}
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {classAnalysis ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    📊 학급 현황 분석
                  </Typography>
                  <Typography variant="body2">
                    {classAnalysis.classOverview}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "success.50",
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    ✨ 강점 영역
                  </Typography>
                  {classAnalysis.strengthAreas.map((area, i) => (
                    <Chip
                      key={i}
                      label={area}
                      color="success"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "warning.50",
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    📈 개선 필요 영역
                  </Typography>
                  {classAnalysis.improvementAreas.map((area, i) => (
                    <Chip
                      key={i}
                      label={area}
                      color="warning"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: "primary.50", borderRadius: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    💡 수업 개선 제안
                  </Typography>
                  {classAnalysis.teachingRecommendations.map((rec, i) => (
                    <Typography key={i} variant="body2" sx={{ mb: 1 }}>
                      {i + 1}. {rec}
                    </Typography>
                  ))}
                </Box>
              </Grid>
              {classAnalysis.individualAttention.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: "error.50", borderRadius: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      🎯 개별 관심 필요 학생
                    </Typography>
                    {classAnalysis.individualAttention.map((student, i) => (
                      <Box key={i} sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          <strong>{student.studentName}:</strong> {student.note}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Psychology
                sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
              />
              <Typography color="text.secondary">
                {evaluations.length === 0
                  ? "분석할 평가 결과가 없습니다."
                  : "'분석 생성' 버튼을 클릭하면 AI가 학급 현황을 분석해드립니다."}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* 피드백 작성 다이얼로그 */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>교사 피드백 작성</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="서론 피드백"
                multiline
                rows={2}
                value={feedbackData.summaryIntro}
                onChange={(e) =>
                  setFeedbackData({
                    ...feedbackData,
                    summaryIntro: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="본론 피드백"
                multiline
                rows={2}
                value={feedbackData.summaryBody}
                onChange={(e) =>
                  setFeedbackData({
                    ...feedbackData,
                    summaryBody: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="결론 피드백"
                multiline
                rows={2}
                value={feedbackData.summaryConclusion}
                onChange={(e) =>
                  setFeedbackData({
                    ...feedbackData,
                    summaryConclusion: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="종합 코멘트"
                multiline
                rows={3}
                value={feedbackData.overallComment}
                onChange={(e) =>
                  setFeedbackData({
                    ...feedbackData,
                    overallComment: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>취소</Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSaveFeedback}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 진단 배정 다이얼로그 */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>진단 배정</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>학생 선택</InputLabel>
              <Select
                value={assignTargetStudent}
                label="학생 선택"
                onChange={(e) =>
                  setAssignTargetStudent(e.target.value as number)
                }
              >
                {students.map((s) => (
                  <MenuItem key={s.user_id} value={s.user_id}>
                    {s.name} ({s.grade}학년)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>진단 지문 선택</InputLabel>
              <Select
                value={assignTargetStimulus}
                label="진단 지문 선택"
                onChange={(e) =>
                  setAssignTargetStimulus(e.target.value as number)
                }
              >
                {stimuli.map((s) => (
                  <MenuItem key={s.stimulus_id} value={s.stimulus_id}>
                    {s.title} ({s.grade_band})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>취소</Button>
          <Button
            variant="contained"
            onClick={handleAssignAssessment}
            disabled={!assignTargetStudent || !assignTargetStimulus}
          >
            배정하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherDashboardNew;
