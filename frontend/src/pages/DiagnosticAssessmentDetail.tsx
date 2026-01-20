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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Assessment,
  Schedule,
  Class,
  ListAlt,
  PlayArrow,
  Close,
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
  const [previewOpen, setPreviewOpen] = useState(false);

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

  // 학년군에 따른 진단 평가 URL 반환
  const getDiagnosticUrl = (gradeBand: string) => {
    const urls: Record<string, string> = {
      초저: "/diagnostic/elemlow",
      초고: "/diagnostic/elemhigh",
      중저: "/diagnostic/midlow",
      중고: "/diagnostic/midhigh",
    };
    return urls[gradeBand] || "/diagnostic/midlow";
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
          onClick={() => navigate("/question-dev/diagnostic-assessments")}
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
          onClick={() => navigate("/question-dev/diagnostic-assessments")}
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
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            {/* 학년군 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Class sx={{ mr: 1, color: "primary.main", fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  학년군
                </Typography>
              </Box>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                {getGradeBandLabel(assessment.grade_band)}
              </Typography>
            </Box>
            <Divider sx={{ my: 1.5 }} />

            {/* 평가 유형 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Assessment
                  sx={{ mr: 1, color: "primary.main", fontSize: 20 }}
                />
                <Typography variant="subtitle2" fontWeight="bold">
                  평가 유형
                </Typography>
              </Box>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                {getAssessmentTypeLabel(assessment.assessment_type)}
              </Typography>
            </Box>
            <Divider sx={{ my: 1.5 }} />

            {/* 제한 시간 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Schedule sx={{ mr: 1, color: "primary.main", fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  제한 시간
                </Typography>
              </Box>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                {assessment.time_limit_minutes
                  ? `${assessment.time_limit_minutes}분`
                  : "제한 없음"}
              </Typography>
            </Box>
            <Divider sx={{ my: 1.5 }} />

            {/* 총 문항 수 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ListAlt sx={{ mr: 1, color: "primary.main", fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  총 문항 수
                </Typography>
              </Box>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                {assessment.item_count || 0}개
              </Typography>
            </Box>
          </Paper>

          {/* 진단 평가 바로가기 버튼 */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<PlayArrow />}
            onClick={() => setPreviewOpen(true)}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            진단 평가 바로가기
          </Button>
        </Grid>
      </Grid>

      {/* 진단 평가 미리보기 Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            width: "95vw",
            height: "95vh",
            maxWidth: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1,
          }}
        >
          <Typography variant="h6">
            {assessment.title} - 문항 미리보기
          </Typography>
          <IconButton onClick={() => setPreviewOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: "hidden" }}>
          <Box
            component="iframe"
            src={getDiagnosticUrl(assessment.grade_band)}
            sx={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>닫기</Button>
          <Button
            variant="contained"
            onClick={() =>
              window.open(getDiagnosticUrl(assessment.grade_band), "_blank")
            }
          >
            새 창에서 열기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
