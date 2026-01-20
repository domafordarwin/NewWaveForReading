import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import {
  Assessment,
  CheckCircle,
  HourglassTop,
  Schedule,
} from "@mui/icons-material";
import { getCurrentUser } from "../utils/session";
import { getStudentAssessments } from "../services/diagnosticAssessmentService";
import type { AssessmentAttempt } from "../types/diagnosticAssessment";

interface AttemptWithAssessment extends AssessmentAttempt {
  diagnostic_assessments?: {
    assessment_id: number;
    title: string;
    description: string | null;
    grade_band: "초저" | "초고" | "중저" | "중고";
    assessment_type: "diagnostic" | "formative" | "summative";
  };
}

const gradeBandLabels: Record<string, string> = {
  초저: "초등 저학년",
  초고: "초등 고학년",
  중저: "중등 저학년",
  중고: "중등 고학년",
};

const statusLabel: Record<AssessmentAttempt["status"], string> = {
  in_progress: "진행 중",
  submitted: "채점 대기",
  graded: "채점 완료",
};

const statusColor: Record<
  AssessmentAttempt["status"],
  "default" | "info" | "warning" | "success"
> = {
  in_progress: "info",
  submitted: "warning",
  graded: "success",
};

export default function StudentResults() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptWithAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const user = getCurrentUser();
      if (!user?.userId) {
        setError("로그인 정보를 확인할 수 없습니다.");
        setLoading(false);
        return;
      }

      try {
        const data = await getStudentAssessments(user.userId);
        setAttempts(data as AttemptWithAssessment[]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "평가 결과 로드 실패",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const summary = useMemo(() => {
    const total = attempts.length;
    const graded = attempts.filter((a) => a.status === "graded");
    const avgScore =
      graded.length > 0
        ? graded.reduce((sum, a) => sum + (a.total_score || 0), 0) /
          graded.length
        : 0;
    const avgPercent =
      graded.length > 0
        ? graded.reduce((sum, a) => {
            const percentage =
              a.max_score > 0 ? ((a.total_score || 0) / a.max_score) * 100 : 0;
            return sum + percentage;
          }, 0) / graded.length
        : 0;

    return {
      total,
      gradedCount: graded.length,
      avgScore,
      avgPercent,
    };
  }, [attempts]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Assessment sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
        <Typography variant="h4" component="h1">
          내 평가 결과
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              총 응시
            </Typography>
            <Typography variant="h4">{summary.total}회</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              채점 완료
            </Typography>
            <Typography variant="h4">{summary.gradedCount}회</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              평균 점수
            </Typography>
            <Typography variant="h4">
              {summary.avgScore.toFixed(1)}점
            </Typography>
            <Typography variant="body2" color="text.secondary">
              평균 {summary.avgPercent.toFixed(1)}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {attempts.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: "center" }}>
          <Assessment sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            아직 평가 결과가 없습니다.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {attempts.map((attempt) => {
            const assessment = attempt.diagnostic_assessments;
            const percentage =
              attempt.max_score > 0
                ? ((attempt.total_score || 0) / attempt.max_score) * 100
                : 0;
            const isGraded = attempt.status === "graded";

            return (
              <Grid item xs={12} md={6} lg={4} key={attempt.attempt_id}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Assessment color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="h2">
                        {assessment?.title || "진단 평가"}
                      </Typography>
                    </Box>

                    {assessment?.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {assessment.description}
                      </Typography>
                    )}

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                      <Chip
                        icon={<Schedule />}
                        label={gradeBandLabels[assessment?.grade_band || ""] || assessment?.grade_band}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={isGraded ? <CheckCircle /> : <HourglassTop />}
                        label={statusLabel[attempt.status]}
                        size="small"
                        color={statusColor[attempt.status]}
                        variant="outlined"
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" color="text.secondary">
                      응시:{" "}
                      {attempt.started_at
                        ? new Date(attempt.started_at).toLocaleString("ko-KR")
                        : "-"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      제출:{" "}
                      {attempt.submitted_at
                        ? new Date(attempt.submitted_at).toLocaleString("ko-KR")
                        : "-"}
                    </Typography>

                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">
                        총점:{" "}
                        {attempt.total_score !== null
                          ? `${attempt.total_score.toFixed(1)} / ${attempt.max_score}점`
                          : `- / ${attempt.max_score}점`}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{ height: 8, borderRadius: 1 }}
                      color={percentage >= 80 ? "success" : percentage >= 60 ? "primary" : "warning"}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {percentage.toFixed(1)}%
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() =>
                        navigate(`/student/assessments/results/${attempt.attempt_id}`)
                      }
                      disabled={!isGraded}
                    >
                      결과 보기
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
