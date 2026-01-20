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
  Lightbulb,
  Home,
  Psychology,
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
import {
  generateParentReport,
  type AIEvaluationResult,
} from "../services/aiFeedbackService";

interface ChildInfo {
  user_id: number;
  name: string;
  grade: number;
  school_name: string;
  student_grade_level: string;
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

  const demoChildren: ChildInfo[] = [
    {
      user_id: 1,
      name: "김민준",
      grade: 2,
      school_name: "신명중학교",
      student_grade_level: "중저",
    },
    {
      user_id: 2,
      name: "이서연",
      grade: 3,
      school_name: "신명중학교",
      student_grade_level: "중저",
    },
  ];

  const demoEvaluations: Record<number, EvaluationData[]> = {
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
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    setChildren(demoChildren);
    setSelectedChild(demoChildren[0] ?? null);
    setLoading(false);
  }, [userId]);

  const selectedChildId = selectedChild?.user_id ?? null;
  useEffect(() => {
    if (!selectedChildId) return;
    setEvaluations(demoEvaluations[selectedChildId] || []);
  }, [selectedChildId]);

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

        {/* 오른쪽 컬럼: 상담 게시판/지도 전략/추천 도서 */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* 상담 게시판 (임시) */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                상담 게시판
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                상담 내역 및 신청 기능은 곧 제공됩니다.
              </Typography>
              <Button variant="outlined" color="primary" disabled>
                상담 신청하기
              </Button>
            </Paper>

            {/* 가정 지도 전략 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <Home sx={{ mr: 1, verticalAlign: "middle" }} />
                가정에서 지도 방안
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {aiReport && aiReport.homeSupport.length > 0 ? (
                <List dense>
                  {aiReport.homeSupport.map((support, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={`${i + 1}. ${support}`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  AI 리포트 생성 후 가정 지도 전략이 제공됩니다.
                </Typography>
              )}
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

        {/* AI 리포트 (기존 위치 유지) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                <Psychology sx={{ mr: 1, verticalAlign: "middle" }} />
                AI 학습 리포트
              </Typography>
              <Button
                variant="contained"
                onClick={handleGenerateReport}
                disabled={reportLoading || evaluations.length === 0}
                startIcon={
                  reportLoading ? <CircularProgress size={16} /> : <Lightbulb />
                }
              >
                {reportLoading ? "생성 중..." : "리포트 생성"}
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {aiReport ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      📋 학습 현황 요약
                    </Typography>
                    <Typography variant="body2">{aiReport.summary}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: "primary.50", borderRadius: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      📈 성장 분석
                    </Typography>
                    <Typography variant="body2">
                      {aiReport.progressAnalysis}
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
                      <Lightbulb sx={{ mr: 1, verticalAlign: "middle" }} />
                      권장 사항
                    </Typography>
                    <List dense>
                      {aiReport.recommendations.map((rec, i) => (
                        <ListItem key={i}>
                          <ListItemText primary={`${i + 1}. ${rec}`} />
                        </ListItem>
                      ))}
                    </List>
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
                      <Home sx={{ mr: 1, verticalAlign: "middle" }} />
                      가정에서 도울 수 있는 방법
                    </Typography>
                    <List dense>
                      {aiReport.homeSupport.map((support, i) => (
                        <ListItem key={i}>
                          <ListItemText primary={`${i + 1}. ${support}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Psychology
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
                <Typography color="text.secondary">
                  {evaluations.length === 0
                    ? "아직 완료된 평가가 없습니다."
                    : "'리포트 생성' 버튼을 클릭하면 AI가 자녀의 학습 현황을 분석해드립니다."}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ParentDashboardNew;
