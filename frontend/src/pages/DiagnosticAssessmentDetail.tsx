import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Assessment,
  Schedule,
  Class,
  ListAlt,
} from "@mui/icons-material";
import { getDiagnosticAssessmentById } from "../services/diagnosticAssessmentService";
import type { DiagnosticAssessmentWithItems } from "../types/diagnosticAssessment";

export default function DiagnosticAssessmentDetail() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] =
    useState<DiagnosticAssessmentWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assessmentId) {
      loadAssessment();
    }
  }, [assessmentId]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getDiagnosticAssessmentById(parseInt(assessmentId!));
      setAssessment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "데이터 로드 실패");
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      draft: { label: "초안", color: "default" as const },
      published: { label: "배포됨", color: "success" as const },
      archived: { label: "보관됨", color: "default" as const },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Chip label={config.label} color={config.color} />;
  };

  const getGradeBandLabel = (gradeBand: string) => {
    const labels = {
      초저: "초등 저학년",
      초고: "초등 고학년",
      중저: "중등 저학년",
      중고: "중등 고학년",
    };
    return labels[gradeBand as keyof typeof labels] || gradeBand;
  };

  const getAssessmentTypeLabel = (type: string) => {
    const labels = {
      diagnostic: "진단 평가",
      formative: "형성 평가",
      summative: "총괄 평가",
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !assessment) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "평가를 찾을 수 없습니다."}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/diagnostic-assessments")}
          sx={{ mt: 2 }}
        >
          목록으로
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/diagnostic-assessments")}
          sx={{ mr: 2 }}
        >
          목록으로
        </Button>
        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
          {assessment.title}
        </Typography>
        {assessment.status === "draft" && (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() =>
              navigate(
                `/question-dev/diagnostic-assessments/${assessmentId}/edit`,
              )
            }
          >
            수정
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Assessment sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">기본 정보</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                상태
              </Typography>
              <Box sx={{ mt: 0.5 }}>{getStatusChip(assessment.status)}</Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                설명
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {assessment.description || "설명 없음"}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                생성일
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {new Date(assessment.created_at).toLocaleString("ko-KR")}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                수정일
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {new Date(assessment.updated_at).toLocaleString("ko-KR")}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <ListAlt sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">포함된 문항</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {assessment.items && assessment.items.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {assessment.items.map((item, index) => (
                  <Card key={item.assessment_item_id} variant="outlined">
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Chip
                          label={`문항 ${index + 1}`}
                          size="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={`${item.points}점`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        문항 ID: {item.draft_item_id}
                      </Typography>
                      {item.authoring_items && (
                        <Typography variant="body2" color="text.secondary">
                          문항 유형: {item.authoring_items.item_kind}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Alert severity="info">아직 문항이 추가되지 않았습니다.</Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Class sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">학년군</Typography>
              </Box>
              <Typography variant="h5" color="primary">
                {getGradeBandLabel(assessment.grade_band)}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Assessment sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">평가 유형</Typography>
              </Box>
              <Typography variant="h5" color="primary">
                {getAssessmentTypeLabel(assessment.assessment_type)}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Schedule sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">제한 시간</Typography>
              </Box>
              <Typography variant="h5" color="primary">
                {assessment.time_limit_minutes
                  ? `${assessment.time_limit_minutes}분`
                  : "제한 없음"}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ListAlt sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">총 문항 수</Typography>
              </Box>
              <Typography variant="h5" color="primary">
                {assessment.item_count || 0}개
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
