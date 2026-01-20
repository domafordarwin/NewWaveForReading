import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Assessment,
} from '@mui/icons-material';
import {
  getDiagnosticAssessments,
  deleteDiagnosticAssessment,
  publishAssessment,
} from '../services/diagnosticAssessmentService';
import type { DiagnosticAssessmentWithItems } from '../types/diagnosticAssessment';

export default function DiagnosticAssessmentList() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<DiagnosticAssessmentWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'draft' | 'published' | 'archived' | 'all'>('all');

  useEffect(() => {
    loadAssessments();
  }, [statusFilter]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined;
      const data = await getDiagnosticAssessments(filters);
      setAssessments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assessmentId: number) => {
    if (!confirm('이 평가를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteDiagnosticAssessment(assessmentId);
      loadAssessments();
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 실패');
    }
  };

  const handlePublish = async (assessmentId: number) => {
    if (!confirm('이 평가를 배포하시겠습니까? 배포 후에는 학생들이 응시할 수 있습니다.')) {
      return;
    }

    try {
      await publishAssessment(assessmentId);
      loadAssessments();
    } catch (err) {
      alert(err instanceof Error ? err.message : '배포 실패');
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      draft: { label: '초안', color: 'default' as const },
      published: { label: '배포됨', color: 'success' as const },
      archived: { label: '보관됨', color: 'default' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getGradeBandLabel = (gradeBand: string) => {
    const labels = {
      '초저': '초등 저학년',
      '초고': '초등 고학년',
      '중저': '중등 저학년',
      '중고': '중등 고학년',
    };
    return labels[gradeBand as keyof typeof labels] || gradeBand;
  };

  const getAssessmentTypeLabel = (type: string) => {
    const labels = {
      diagnostic: '진단',
      formative: '형성',
      summative: '총괄',
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            진단 평가 관리
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/question-dev/diagnostic-assessments/create')}
        >
          새 평가 생성
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={statusFilter}
          onChange={(_, value) => setStatusFilter(value)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="전체" value="all" />
          <Tab label="초안" value="draft" />
          <Tab label="배포됨" value="published" />
          <Tab label="보관됨" value="archived" />
        </Tabs>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>제목</TableCell>
              <TableCell>학년군</TableCell>
              <TableCell>평가 유형</TableCell>
              <TableCell align="center">문항 수</TableCell>
              <TableCell align="center">상태</TableCell>
              <TableCell>생성일</TableCell>
              <TableCell align="center">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assessments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Typography variant="body1" color="text.secondary">
                    평가가 없습니다. 새 평가를 생성해보세요.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              assessments.map((assessment) => (
                <TableRow key={assessment.assessment_id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{assessment.title}</Typography>
                    {assessment.description && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {assessment.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{getGradeBandLabel(assessment.grade_band)}</TableCell>
                  <TableCell>{getAssessmentTypeLabel(assessment.assessment_type)}</TableCell>
                  <TableCell align="center">{assessment.item_count || 0}개</TableCell>
                  <TableCell align="center">{getStatusChip(assessment.status)}</TableCell>
                  <TableCell>
                    {new Date(assessment.created_at).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/question-dev/diagnostic-assessments/${assessment.assessment_id}`)}
                      title="상세 보기"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/question-dev/diagnostic-assessments/${assessment.assessment_id}/edit`)}
                      title="수정"
                      disabled={assessment.status === 'published'}
                    >
                      <Edit />
                    </IconButton>
                    {assessment.status === 'draft' && (
                      <IconButton
                        size="small"
                        onClick={() => handlePublish(assessment.assessment_id)}
                        title="배포"
                        color="primary"
                      >
                        <Assessment />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(assessment.assessment_id)}
                      title="삭제"
                      color="error"
                      disabled={assessment.status === 'published'}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
