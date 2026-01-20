/**
 * 학부모 대시보드 - 자녀 학습 현황 조회
 *
 * 기능:
 * - 자녀 정보 및 연결
 * - 자녀의 진단 결과 조회
 * - 성장 추이 차트
 * - AI 생성 학부모 리포트
 */
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  TrendingUp,
  School,
  EmojiEvents,
  Person,
  Assignment,
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
import { getCurrentUser } from "../utils/session";
import type { CounselPost } from "../services/counselBoardService";
import {
  generateParentReport,
  type AIEvaluationResult,
} from "../services/aiFeedbackService";
import { useSupabase } from "../services/supabaseClient";
import {
  type CounselComment,
  fetchComments,
} from "../services/counselCommentService";

interface ChildInfo {
  user_id: number;
  name: string;
  grade: number;
  school_name: string;
  student_grade_level: string;
  student_code?: string;
}

interface EvaluationData {
  evaluation_id: number;
  session_id: number;
  comprehension_score: number;
  inference_score: number;
  critical_score: number;
  expression_score: number;
  total_score: number;
  grade_level: string;
  percentile: number;
  strengths: string[];
  weaknesses: string[];
  evaluated_at: string;
}

const ParentDashboardNew = () => {
  const user = useMemo(() => getCurrentUser(), []);
  const userId = user?.userId ?? null;
  const supabase = useSupabase();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildInfo | null>(null);
  const [evaluations, setEvaluations] = useState<EvaluationData[]>([]);
  const [aiReport, setAiReport] = useState<{
    summary: string;
    progressAnalysis: string;
    recommendations: string[];
    homeSupport: string[];
  } | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  // const [posting, setPosting] = useState(false);
  const [counselLoading, setCounselLoading] = useState(false);
  const [counselError, setCounselError] = useState<string | null>(null);

  const demoEvaluations = useMemo<Record<number, EvaluationData[]>>(
    () => ({
      1: [
        {
          evaluation_id: 9001,
          session_id: 101,
          comprehension_score: 18,
          inference_score: 17,
          critical_score: 16,
          expression_score: 19,
          total_score: 70,
          grade_level: "B",
          percentile: 62,
          strengths: ["논리적인 흐름", "주제 이해"],
          weaknesses: ["근거 보강 필요"],
          evaluated_at: "2025-01-11T10:00:00Z",
        },
      ],
      2: [
        {
          evaluation_id: 9101,
          session_id: 201,
          comprehension_score: 20,
          inference_score: 19,
          critical_score: 18,
          expression_score: 20,
          total_score: 77,
          grade_level: "B",
          percentile: 70,
          strengths: ["표현력", "구체성"],
          weaknesses: ["핵심 요약 보완"],
          evaluated_at: "2025-01-13T10:00:00Z",
        },
      ],
    }),
    [],
  );

  useEffect(() => {
    const loadChildren = async () => {
      if (!supabase || !userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: relationsData, error: relationsError } = await supabase
          .from("student_parent_relations")
          .select(
            `
            student_id,
            student_code,
            student:users!student_parent_relations_student_id_fkey(
              user_id,
              name,
              grade,
              school_name,
              student_grade_level
            )
          `,
          )
          .eq("parent_id", userId);

        if (relationsError) {
          setError(relationsError.message);
          setChildren([]);
          setSelectedChild(null);
          return;
        }

        const relationCodes = (relationsData || [])
          .map((r: { student_code?: string | null }) => r.student_code || "")
          .filter((code) => Boolean(code));

        if (relationCodes.length === 0) {
          setChildren([]);
          setSelectedChild(null);
          return;
        }

        const { data: studentsData, error: studentsError } = await supabase
          .from("users")
          .select(
            "user_id, name, grade, school_name, student_grade_level, student_code",
          )
          .in("student_code", relationCodes)
          .order("name");

        if (studentsError) {
          setError(studentsError.message);
          setChildren([]);
          setSelectedChild(null);
          return;
        }

        const childList = (studentsData || []) as ChildInfo[];
        setChildren(childList);
        setSelectedChild(childList[0] ?? null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "자녀 정보를 불러오는데 실패했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
  }, [supabase, userId]);

  const selectedChildId = selectedChild?.user_id ?? null;
  useEffect(() => {
    if (!selectedChildId) return;
    setEvaluations(demoEvaluations[selectedChildId] || []);
  }, [selectedChildId, demoEvaluations]);

  // AI 리포트 생성
  const handleGenerateReport = async () => {
    if (!selectedChild || evaluations.length === 0) return;

    setReportLoading(true);
    try {
      // AIEvaluationResult 형식으로 변환
      const evalResults: AIEvaluationResult[] = evaluations.map((e) => ({
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
      }));

      const report = await generateParentReport({
        studentName: selectedChild.name,
        evaluations: evalResults,
        gradeBand: selectedChild.student_grade_level || "초고",
      });

      setAiReport(report);
    } catch (err) {
      console.error("AI 리포트 생성 실패:", err);
      setError("리포트 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setReportLoading(false);
    }
  };

  // 통계 계산
  const stats = {
    totalAssessments: evaluations.length,
    averageScore:
      evaluations.length > 0
        ? Math.round(
            evaluations.reduce((sum, e) => sum + e.total_score, 0) /
              evaluations.length,
          )
        : 0,
    latestGrade: evaluations[0]?.grade_level || "N/A",
    percentile: evaluations[0]?.percentile || 0,
  };

  // 성장 추이 차트 데이터
  const progressChartData = evaluations
    .slice(0, 6)
    .reverse()
    .map((e, index) => ({
      name: `${index + 1}회`,
      점수: e.total_score,
    }));

  // 영역별 레이더 차트 데이터
  const radarChartData =
    evaluations.length > 0
      ? [
          {
            subject: "이해력",
            score: evaluations[0].comprehension_score,
            fullMark: 25,
          },
          {
            subject: "추론력",
            score: evaluations[0].inference_score,
            fullMark: 25,
          },
          {
            subject: "비판적\n사고",
            score: evaluations[0].critical_score,
            fullMark: 25,
          },
          {
            subject: "표현력",
            score: evaluations[0].expression_score,
            fullMark: 25,
          },
        ]
      : [];

  // 상담 게시판: 게시글 작성
  const handleAddPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    if (!supabase) {
      setCounselError("데이터베이스 연결에 실패했습니다.");
      return;
    }
    // setPosting(true);
    setCounselError(null);
    try {
      const { error } = await supabase
        .from("counsel_posts")
        .insert([
          {
            title: newPostTitle,
            content: newPostContent,
            user_id: userId,
            created_at: new Date().toISOString(),
          },
        ])
        .single();

      if (error) throw error;

      // setCounselPosts((prev) => [...prev, data]);
      setNewPostTitle("");
      setNewPostContent("");
    } catch {
      setCounselError("게시글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      // setPosting(false);
    }
  };

  // 댓글 상태
  // const [, setCommentError] = useState<
  //   Record<number, string | null>
  // >({});
  // 게시글별 댓글 불러오기
  // (미사용 함수: loadComments 제거)
  // 댓글 작성
  // const handleAddComment = async (postId: number) => {
  //   if (!userId || !commentInput[postId]?.trim()) return;
  //   setCommentLoading((prev) => ({ ...prev, [postId]: true }));
  //   setCommentError((prev) => ({ ...prev, [postId]: null }));
  //   try {
  //     await addComment(postId, userId, commentInput[postId]);
  //     setCommentInput((prev) => ({ ...prev, [postId]: "" }));
  //     await loadComments(postId);
  //   } catch (e: any) {
  //     setCommentError((prev) => ({
  //       ...prev,
  //       [postId]: e.message || "댓글 작성에 실패했습니다.",
  //     }));
  //   } finally {
  //     setCommentLoading((prev) => ({ ...prev, [postId]: false }));
  //   }
  // };

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
        학부모 대시보드
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        자녀의 독서 진단 현황을 확인하세요 📊
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* 왼쪽 컬럼: 학생 정보/진단 결과/추이/분석 */}
        <Grid item xs={12} md={7}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* 자녀 정보 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <Person sx={{ mr: 1, verticalAlign: "middle" }} />
                자녀 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {children.length === 0 ? (
                <Typography color="text.secondary">
                  연결된 자녀가 없습니다.
                </Typography>
              ) : (
                <List>
                  {children.map((child) => (
                    <ListItem
                      key={child.user_id}
                      button
                      selected={selectedChild?.user_id === child.user_id}
                      onClick={() => setSelectedChild(child)}
                      sx={{ borderRadius: 2, mb: 1 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {child.name?.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={child.name}
                        secondary={`${child.school_name || "학교"} ${child.grade || ""}학년`}
                      />
                      {selectedChild?.user_id === child.user_id && (
                        <ListItemSecondaryAction>
                          <Chip label="선택됨" size="small" color="primary" />
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>

            {/* 요약 통계 */}
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: "primary.main", color: "white" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Assignment sx={{ fontSize: 32 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {stats.totalAssessments}
                    </Typography>
                    <Typography variant="body2">완료 진단</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: "secondary.main", color: "white" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <TrendingUp sx={{ fontSize: 32 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {stats.averageScore}
                    </Typography>
                    <Typography variant="body2">평균 점수</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: "success.main", color: "white" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <EmojiEvents sx={{ fontSize: 32 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {stats.latestGrade}
                    </Typography>
                    <Typography variant="body2">현재 등급</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: "info.main", color: "white" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <School sx={{ fontSize: 32 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {stats.percentile}%
                    </Typography>
                    <Typography variant="body2">백분위</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* 성장 추이 차트 */}
            {progressChartData.length > 1 && (
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
            )}

            {/* 영역별 분석 */}
            {radarChartData.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  영역별 분석 (최근)
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
                      stroke="#764ba2"
                      fill="#764ba2"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Paper>
            )}
          </Box>
        </Grid>

        {/* 오른쪽 컬럼: AI 리포트/가정 지도/상담 게시판 */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* AI 리포트 섹션 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🤖 AI 학부모 리포트
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateReport}
                disabled={
                  reportLoading || !selectedChild || evaluations.length === 0
                }
                sx={{ mb: 2 }}
              >
                {reportLoading ? <CircularProgress size={20} /> : "리포트 생성"}
              </Button>
              {aiReport && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mt: 2 }}
                  >
                    요약
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {aiReport.summary}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mt: 2 }}
                  >
                    성장 분석
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {aiReport.progressAnalysis}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mt: 2 }}
                  >
                    추천 사항
                  </Typography>
                  <ul>
                    {aiReport.recommendations.map((rec, idx) => (
                      <li key={idx}>
                        <Typography variant="body2">{rec}</Typography>
                      </li>
                    ))}
                  </ul>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mt: 2 }}
                  >
                    가정 지도 팁
                  </Typography>
                  <ul>
                    {aiReport.homeSupport.map((tip, idx) => (
                      <li key={idx}>
                        <Typography variant="body2">{tip}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
              {!aiReport && !reportLoading && (
                <Typography color="text.secondary">
                  AI 리포트는 자녀의 진단 결과를 바탕으로 생성됩니다.
                </Typography>
              )}
            </Paper>
            {/* 상담 게시판 섹션 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                💬 상담 게시판
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <input
                  type="text"
                  placeholder="제목"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  style={{
                    width: "100%",
                    marginBottom: 8,
                    padding: 8,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />
                <textarea
                  placeholder="내용을 입력하세요"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: 60,
                    marginBottom: 8,
                    padding: 8,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim()}
                  fullWidth
                >
                  게시글 작성
                </Button>
                {counselError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {counselError}
                  </Alert>
                )}
              </Box>
              {/* 게시글 목록 렌더링 자리 (생략 가능) */}
            </Paper>
            {/* 추천 도서 섹션 */}
            <Paper sx={{ p: 3, bgcolor: "info.50" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📚 추천 도서
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                자녀의 독서 수준에 맞는 추천 도서를 확인하세요.
              </Typography>
              <Button
                variant="contained"
                color="info"
                href="/parent/recommended-books"
                fullWidth
                sx={{ mt: 1 }}
              >
                추천 도서 전체 보기
              </Button>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ParentDashboardNew;
