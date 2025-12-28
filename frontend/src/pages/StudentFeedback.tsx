import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
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
} from '@mui/material';
import { getEvaluationsByStudentId } from '../services/api';
import { getCurrentUser } from '../utils/session';

const rubricLabels = [
  '논제 충실성/입장 명료성',
  '대상도서 이해/활용',
  '논거 다양성/타당성',
  '구성/일관성(서론-본론-결론)',
  '창의적 사고력',
  '표현/문장력',
];

const levelColor = (level: string) => {
  switch (level) {
    case '상':
      return 'success';
    case '중':
      return 'warning';
    case '하':
      return 'error';
    default:
      return 'default';
  }
};

export default function StudentFeedback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState({
    student_feedback: {
      서론: '',
      본론: '',
      결론: '',
    },
    rubric: [] as Array<{
      criterion: string;
      level: string;
      evidence: string;
      next_action: string;
    }>,
    line_edits: [] as Array<{
      original: string;
      suggested: string;
      reason: string;
      category: string;
    }>,
    teacher_note: '',
  });

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          setError('로그인이 필요합니다.');
          return;
        }

        const evaluations = await getEvaluationsByStudentId(currentUser.userId);
        if (!evaluations.length) {
          setError('피드백이 아직 생성되지 않았습니다.');
          return;
        }

        const latest = evaluations[0];
        const studentFeedback = latest.studentFeedback || {
          서론: '자동 피드백이 아직 준비되지 않았습니다.',
          본론: '답안 제출 후 잠시 기다려 주세요.',
          결론: '추가 분석이 완료되면 표시됩니다.',
        };
        const rubric = Array.isArray(latest.rubric) && latest.rubric.length
          ? latest.rubric
          : rubricLabels.map((label) => ({
              criterion: label,
              level: '중',
              evidence: '자동 평가가 진행 중입니다.',
              next_action: '답안 제출 후 다시 확인해 주세요.',
            }));
        const lineEdits = Array.isArray(latest.lineEdits) ? latest.lineEdits : [];
        const teacherNote = latest.teacherNote
          || '현재 자동 피드백만 제공됩니다. 추가 보정은 추후 반영됩니다.';

        setFeedback({
          student_feedback: studentFeedback,
          rubric,
          line_edits: lineEdits,
          teacher_note: teacherNote,
        });
        setError(null);
      } catch (err: any) {
        setError(err.message || '피드백을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  const rubricSummary = useMemo(() => {
    const counts = feedback.rubric.reduce((acc: Record<string, number>, item) => {
      acc[item.level] = (acc[item.level] || 0) + 1;
      return acc;
    }, {});
    return counts;
  }, [feedback.rubric]);

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
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        서론-본론-결론 피드백
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          총평 (교사 피드백 톤)
        </Typography>
        <Grid container spacing={2}>
          {(['서론', '본론', '결론'] as const).map((section) => (
            <Grid item xs={12} md={4} key={section}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  [{section}]
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {feedback.student_feedback[section]}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            루브릭 평가
          </Typography>
          {Object.entries(rubricSummary).map(([level, count]) => (
            <Chip key={level} label={`${level} ${count}`} color={levelColor(level)} size="small" />
          ))}
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {feedback.rubric.map((item) => (
            <Grid item xs={12} md={6} key={item.criterion}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2">{item.criterion}</Typography>
                  <Chip label={item.level} color={levelColor(item.level)} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  근거: {item.evidence}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  다음 행동: {item.next_action}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          표현 첨삭 리스트
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>원문</TableCell>
                <TableCell>수정안</TableCell>
                <TableCell>이유</TableCell>
                <TableCell align="center">분류</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedback.line_edits.map((edit) => (
                <TableRow key={`${edit.original}-${edit.suggested}`}>
                  <TableCell>{edit.original}</TableCell>
                  <TableCell>{edit.suggested}</TableCell>
                  <TableCell>{edit.reason}</TableCell>
                  <TableCell align="center">
                    <Chip label={edit.category} size="small" />
                  </TableCell>
                </TableRow>
              ))}
              {feedback.line_edits.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    첨삭 항목이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Alert severity="info">
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          교사용 메모
        </Typography>
        <Typography variant="body2">{feedback.teacher_note}</Typography>
      </Alert>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined">피드백 다운로드</Button>
        <Button variant="contained">수정 과제 시작</Button>
      </Box>
    </Box>
  );
}
