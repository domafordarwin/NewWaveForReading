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
import { getEvaluationsByStudentId, getFeedbacksByStudentId } from '../services/api';
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
  const [sessions, setSessions] = useState<Array<{
    sessionId: number;
    createdAt?: string;
    hasFeedback: boolean;
    feedback: {
      student_feedback: {
        서론: string;
        본론: string;
        결론: string;
      };
      rubric: Array<{
        criterion: string;
        level: string;
        evidence: string;
        next_action: string;
      }>;
      line_edits: Array<{
        original: string;
        suggested: string;
        reason: string;
        category: string;
      }>;
      teacher_note: string;
    };
  }>>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

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

        const feedbackRows = await getFeedbacksByStudentId(currentUser.userId);
        const feedbackByEvaluation = new Map<number, any>();
        feedbackRows.forEach((row: any) => {
          const evaluationId = row.evaluation_id ?? row.evaluationId;
          if (evaluationId) {
            feedbackByEvaluation.set(evaluationId, row);
          }
        });

        const fallbackRubric = rubricLabels.map((label) => ({
          criterion: label,
          level: '중',
          evidence: '자동 평가가 진행 중입니다.',
          next_action: '답안 제출 후 다시 확인해 주세요.',
        }));

        const builtSessions = evaluations.map((evaluation: any) => {
          const evaluationId = evaluation.evaluationId ?? evaluation.evaluation_id ?? 0;
          const feedbackRow = feedbackByEvaluation.get(evaluationId);
          const summaryFromRow = feedbackRow ? {
            서론: feedbackRow.summary_intro ?? feedbackRow.summaryIntro ?? '',
            본론: feedbackRow.summary_body ?? feedbackRow.summaryBody ?? '',
            결론: feedbackRow.summary_conclusion ?? feedbackRow.summaryConclusion ?? '',
          } : null;
          const hasSummary = summaryFromRow
            && (summaryFromRow.서론 || summaryFromRow.본론 || summaryFromRow.결론);
          const studentFeedback = (hasSummary ? summaryFromRow : null)
            || feedbackRow?.student_feedback
            || feedbackRow?.studentFeedback
            || evaluation.studentFeedback
            || {
              서론: '자동 피드백이 아직 준비되지 않았습니다.',
              본론: '답안 제출 후 잠시 기다려 주세요.',
              결론: '추가 분석이 완료되면 표시됩니다.',
            };
          const rubricFromTeacherFields = feedbackRow
            ? [
                {
                  criterion: '주제 이해',
                  level: '중',
                  evidence: feedbackRow.topic_understanding ?? feedbackRow.topicUnderstanding ?? '',
                  next_action: '',
                },
                {
                  criterion: '사례 분석',
                  level: '중',
                  evidence: feedbackRow.example_analysis ?? feedbackRow.exampleAnalysis ?? '',
                  next_action: '',
                },
                {
                  criterion: '논리적 전개',
                  level: '중',
                  evidence: feedbackRow.logical_flow ?? feedbackRow.logicalFlow ?? '',
                  next_action: '',
                },
                {
                  criterion: '표현력',
                  level: '중',
                  evidence: feedbackRow.expression ?? '',
                  next_action: '',
                },
              ].filter((item) => item.evidence)
            : [];

          const rubric = Array.isArray(feedbackRow?.rubric)
            ? feedbackRow.rubric
            : rubricFromTeacherFields.length
              ? rubricFromTeacherFields
              : Array.isArray(evaluation.rubric) && evaluation.rubric.length
                ? evaluation.rubric
                : fallbackRubric;
          const lineEdits = Array.isArray(feedbackRow?.line_edits)
            ? feedbackRow.line_edits
            : Array.isArray(feedbackRow?.lineEdits)
              ? feedbackRow.lineEdits
              : Array.isArray(evaluation.lineEdits)
                ? evaluation.lineEdits
                : [];
          const teacherNote = feedbackRow?.teacher_note
            || feedbackRow?.teacherNote
            || evaluation.teacherNote
            || '현재 자동 피드백만 제공됩니다. 추가 보정은 추후 반영됩니다.';

          return {
            sessionId: evaluationId,
            createdAt: feedbackRow?.created_at ?? feedbackRow?.createdAt ?? evaluation.evaluatedAt,
            hasFeedback: Boolean(feedbackRow),
            feedback: {
              student_feedback: studentFeedback,
              rubric,
              line_edits: lineEdits,
              teacher_note: teacherNote,
            },
          };
        });

        const initialSessionId = builtSessions[0]?.sessionId ?? null;
        setSessions(builtSessions);
        setSelectedSessionId(initialSessionId);
        setError(null);
      } catch (err: any) {
        setError(err.message || '피드백을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  const selectedSession = useMemo(() => {
    if (!sessions.length) {
      return null;
    }
    return sessions.find((session) => session.sessionId === selectedSessionId) || sessions[0];
  }, [sessions, selectedSessionId]);

  const rubricSummary = useMemo(() => {
    if (!selectedSession) {
      return {};
    }
    const counts = selectedSession.feedback.rubric.reduce((acc: Record<string, number>, item) => {
      acc[item.level] = (acc[item.level] || 0) + 1;
      return acc;
    }, {});
    return counts;
  }, [selectedSession]);

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
          피드백 세션
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>평가 ID</TableCell>
                <TableCell>작성일</TableCell>
                <TableCell align="center">상태</TableCell>
                <TableCell align="center">보기</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => (
                <TableRow
                  key={session.sessionId}
                  hover
                  selected={session.sessionId === selectedSession?.sessionId}
                >
                  <TableCell>#{session.sessionId}</TableCell>
                  <TableCell>{session.createdAt ? new Date(session.createdAt).toLocaleString() : '-'}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={session.hasFeedback ? '피드백 완료' : '대기 중'}
                      color={session.hasFeedback ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant={session.sessionId === selectedSession?.sessionId ? 'contained' : 'outlined'}
                      onClick={() => setSelectedSessionId(session.sessionId)}
                    >
                      보기
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {sessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    표시할 피드백이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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
                  {selectedSession?.feedback.student_feedback[section]}
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
          {selectedSession?.feedback.rubric.map((item) => (
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
              {selectedSession?.feedback.line_edits.map((edit) => (
                <TableRow key={`${edit.original}-${edit.suggested}`}>
                  <TableCell>{edit.original}</TableCell>
                  <TableCell>{edit.suggested}</TableCell>
                  <TableCell>{edit.reason}</TableCell>
                  <TableCell align="center">
                    <Chip label={edit.category} size="small" />
                  </TableCell>
                </TableRow>
              ))}
              {(selectedSession?.feedback.line_edits.length ?? 0) === 0 && (
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
        <Typography variant="body2">{selectedSession?.feedback.teacher_note}</Typography>
      </Alert>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined">피드백 다운로드</Button>
        <Button variant="contained">수정 과제 시작</Button>
      </Box>
    </Box>
  );
}
