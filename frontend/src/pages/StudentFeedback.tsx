import { useMemo, useState } from 'react';
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
} from '@mui/material';

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
  const [feedback] = useState({
    student_feedback: {
      서론: '문제를 자신의 언어로 정리하고 입장을 제시한 점이 좋습니다. 다만 입장을 한 문장으로 더 선명하게 정리해 주세요.',
      본론: '도서 내용을 근거로 논리를 전개하려는 시도가 보입니다. 핵심 개념 2개를 인용해 근거의 다양성을 높이고, 반례를 통해 일반화를 줄여보세요.',
      결론: '요약과 정리의 흐름은 자연스럽습니다. 다음 글에서는 주장 문장을 한 번 더 확인하고, 개선 목표 2가지에 집중해 보세요.',
    },
    rubric: rubricLabels.map((label, index) => ({
      criterion: label,
      level: index === 1 ? '하' : index === 2 ? '중' : '상',
      evidence: '학생 글에서 근거가 부족하거나 핵심 개념 연결이 약한 부분이 관찰됩니다.',
      next_action: '핵심 개념 2개를 문장에 삽입하고, 반례를 추가해 논거를 강화하세요.',
    })),
    line_edits: [
      { original: '우리시대의', suggested: '우리 시대의', reason: '띄어쓰기', category: '띄어쓰기' },
      { original: '말할수있다', suggested: '말할 수 있다', reason: '띄어쓰기', category: '띄어쓰기' },
      { original: '그렇다면', suggested: '그렇다면,', reason: '문장 호흡 정리', category: '문장다듬기' },
      { original: '중요하다고한다', suggested: '중요하다고 한다', reason: '띄어쓰기', category: '띄어쓰기' },
      { original: '대조되며', suggested: '대조되며,', reason: '문장 호흡 정리', category: '문장다듬기' },
    ],
    teacher_note:
      '도서 요약 정보가 충분하지 않아 일부 항목은 제공된 학생 글 기준으로만 평가했습니다. 도서 핵심 요약을 추가하면 더 정밀한 피드백이 가능합니다.',
  });

  const rubricSummary = useMemo(() => {
    const counts = feedback.rubric.reduce((acc: Record<string, number>, item) => {
      acc[item.level] = (acc[item.level] || 0) + 1;
      return acc;
    }, {});
    return counts;
  }, [feedback.rubric]);

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
