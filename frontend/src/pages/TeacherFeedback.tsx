import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  getUserById,
  getAssessmentsByStudentId,
  getAnswerByAssessment,
  getEvaluationByAnswerId,
  createTeacherFeedback,
} from '../services/api';
import { getCurrentUser } from '../utils/session';

type FeedbackForm = {
  summaryIntro: string;
  summaryBody: string;
  summaryConclusion: string;
  topicUnderstanding: string;
  exampleAnalysis: string;
  logicalFlow: string;
  expression: string;
  teacherNote: string;
};

const emptyForm: FeedbackForm = {
  summaryIntro: '',
  summaryBody: '',
  summaryConclusion: '',
  topicUnderstanding: '',
  exampleAnalysis: '',
  logicalFlow: '',
  expression: '',
  teacherNote: '',
};

export default function TeacherFeedback() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [student, setStudent] = useState<any | null>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | ''>('');
  const [answerId, setAnswerId] = useState<number | null>(null);
  const [evaluationId, setEvaluationId] = useState<number | null>(null);
  const [form, setForm] = useState<FeedbackForm>(emptyForm);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        const teacher = getCurrentUser();
        if (!teacher) {
          setError('로그인이 필요합니다.');
          return;
        }
        if (!studentId) {
          setError('학생 정보를 찾을 수 없습니다.');
          return;
        }
        const studentData = await getUserById(Number(studentId));
        if (!studentData) {
          setError('학생 정보를 찾을 수 없습니다.');
          return;
        }
        const assessmentData = await getAssessmentsByStudentId(Number(studentId));
        const evaluated = assessmentData.filter((assessment: any) => assessment.status === 'EVALUATED');
        setStudent(studentData);
        setAssessments(evaluated);
        setSelectedAssessmentId(evaluated[0]?.assessmentId || '');
        setError(null);
      } catch (err: any) {
        setError(err.message || '학생 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [studentId]);

  useEffect(() => {
    const loadAssessmentDetails = async () => {
      if (!selectedAssessmentId) {
        setAnswerId(null);
        setEvaluationId(null);
        return;
      }
      try {
        setLoading(true);
        const answer = await getAnswerByAssessment(Number(selectedAssessmentId));
        const resolvedAnswerId = answer && typeof answer.answerId === 'number' ? answer.answerId : null;
        setAnswerId(resolvedAnswerId);
        if (resolvedAnswerId) {
          const evaluationResponse = await getEvaluationByAnswerId(resolvedAnswerId);
          const evaluation = evaluationResponse?.evaluation || evaluationResponse || null;
          setEvaluationId(evaluation?.evaluationId ?? null);
        } else {
          setEvaluationId(null);
        }
      } catch (err: any) {
        setError(err.message || '검사 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadAssessmentDetails();
  }, [selectedAssessmentId]);

  const handleChange = (field: keyof FeedbackForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setSuccess(null);
      const teacher = getCurrentUser();
      if (!teacher) {
        setError('로그인이 필요합니다.');
        return;
      }
      if (!selectedAssessmentId) {
        setError('평가를 선택해주세요.');
        return;
      }

      const rubric = [
        {
          criterion: '주제 이해',
          level: '중',
          evidence: form.topicUnderstanding,
          next_action: '',
        },
        {
          criterion: '사례 분석',
          level: '중',
          evidence: form.exampleAnalysis,
          next_action: '',
        },
        {
          criterion: '논리적 전개',
          level: '중',
          evidence: form.logicalFlow,
          next_action: '',
        },
        {
          criterion: '표현력',
          level: '중',
          evidence: form.expression,
          next_action: '',
        },
      ];

      await createTeacherFeedback({
        evaluationId,
        teacherId: teacher.userId,
        studentId: Number(studentId),
        assessmentId: Number(selectedAssessmentId),
        answerId,
        summaryIntro: form.summaryIntro,
        summaryBody: form.summaryBody,
        summaryConclusion: form.summaryConclusion,
        topicUnderstanding: form.topicUnderstanding,
        exampleAnalysis: form.exampleAnalysis,
        logicalFlow: form.logicalFlow,
        expression: form.expression,
        rubric,
        teacherNote: form.teacherNote,
      });

      setSuccess('교사 피드백이 저장되었습니다.');
      setForm(emptyForm);
    } catch (err: any) {
      setError(err.message || '교사 피드백 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/teacher/students')}>
          학생 목록으로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        교사 피드백 입력
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          학생 정보
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {student?.name} ({student?.email})
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>평가 선택</InputLabel>
          <Select
            value={selectedAssessmentId}
            label="평가 선택"
            onChange={(e) => setSelectedAssessmentId(Number(e.target.value))}
          >
            {assessments.map((assessment) => (
              <MenuItem key={assessment.assessmentId} value={assessment.assessmentId}>
                #{assessment.assessmentId} - {assessment.topic?.topicText?.substring(0, 40) || '검사'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {assessments.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            평가 완료된 검사가 없습니다.
          </Alert>
        )}
      </Paper>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              서론 / 본론 / 결론
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="서론"
                  value={form.summaryIntro}
                  onChange={handleChange('summaryIntro')}
                  fullWidth
                  multiline
                  minRows={4}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="본론"
                  value={form.summaryBody}
                  onChange={handleChange('summaryBody')}
                  fullWidth
                  multiline
                  minRows={4}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="결론"
                  value={form.summaryConclusion}
                  onChange={handleChange('summaryConclusion')}
                  fullWidth
                  multiline
                  minRows={4}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              영역별 피드백
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="주제 이해"
                  value={form.topicUnderstanding}
                  onChange={handleChange('topicUnderstanding')}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="사례 분석"
                  value={form.exampleAnalysis}
                  onChange={handleChange('exampleAnalysis')}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="논리적 전개"
                  value={form.logicalFlow}
                  onChange={handleChange('logicalFlow')}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="표현력"
                  value={form.expression}
                  onChange={handleChange('expression')}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              메모하기
            </Typography>
            <TextField
              value={form.teacherNote}
              onChange={handleChange('teacherNote')}
              fullWidth
              multiline
              minRows={4}
              placeholder="교사용 메모를 입력하세요."
            />
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => navigate('/teacher/students')}>
          목록으로
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving || !selectedAssessmentId}
        >
          {saving ? '저장 중...' : '피드백 저장'}
        </Button>
      </Box>
    </Box>
  );
}
