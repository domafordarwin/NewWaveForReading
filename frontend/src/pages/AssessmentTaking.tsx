import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Send as SendIcon,
  Timer as TimerIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';
import { mockAssessments } from '../../utils/mockData';

export default function AssessmentTaking() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  
  const assessment = mockAssessments.find(
    (a) => a.assessmentId === Number(assessmentId)
  );

  const [content, setContent] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(
    (assessment?.timeLimitMinutes || 90) * 60
  );
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  // 글자 수 계산
  const charCount = content.length;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  // 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 자동 저장
  useEffect(() => {
    if (content.length === 0) return;
    
    const autoSaveTimer = setTimeout(() => {
      handleAutoSave();
    }, 30000); // 30초마다

    return () => clearTimeout(autoSaveTimer);
  }, [content]);

  const handleAutoSave = async () => {
    setAutoSaveStatus('saving');
    // API 호출 (mock)
    setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 500);
  };

  const handleManualSave = () => {
    handleAutoSave();
  };

  const handleSubmit = () => {
    if (charCount < (assessment?.wordCountMin || 800)) {
      alert(`최소 ${assessment?.wordCountMin}자 이상 작성해야 합니다.`);
      return;
    }
    setSubmitDialogOpen(true);
  };

  const handleConfirmSubmit = () => {
    // API 호출하여 제출
    console.log('답안 제출:', content);
    setSubmitDialogOpen(false);
    navigate('/student/dashboard');
  };

  const handleAutoSubmit = () => {
    // 시간 초과 시 자동 제출
    console.log('시간 초과 자동 제출:', content);
    alert('시간이 종료되어 자동으로 제출되었습니다.');
    navigate('/student/dashboard');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining < 300) return 'error'; // 5분 미만
    if (timeRemaining < 600) return 'warning'; // 10분 미만
    return 'primary';
  };

  const getProgressValue = () => {
    if (!assessment) return 0;
    return Math.min((charCount / assessment.wordCountMax) * 100, 100);
  };

  if (!assessment) {
    return (
      <Box>
        <Alert severity="error">검사를 찾을 수 없습니다.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* 헤더 - 타이머 및 상태 */}
      <Paper sx={{ p: 2, mb: 3, position: 'sticky', top: 64, zIndex: 100 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              독서논술 검사
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {assessment.topic.topicText.substring(0, 80)}...
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip
              icon={<TimerIcon />}
              label={formatTime(timeRemaining)}
              color={getTimeColor()}
              sx={{ fontSize: '1.1rem', px: 1 }}
            />
            <Chip
              label={autoSaveStatus === 'saved' ? '저장됨' : '저장 중...'}
              color={autoSaveStatus === 'saved' ? 'success' : 'default'}
              size="small"
            />
          </Box>
        </Box>
      </Paper>

      {/* 논제 표시 */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
          <BookIcon sx={{ color: 'primary.main', mt: 0.5 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              논제
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {assessment.topic.topicText}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {assessment.topic.keywords?.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* 작성 영역 */}
      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={20}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="답안을 작성해주세요...

논술 작성 가이드:
1. 서론: 논제에 대한 이해와 자신의 주장을 명확히 제시
2. 본론: 도서의 내용을 활용하여 구체적인 근거 제시
3. 결론: 주장을 요약하고 의미를 확장

※ 맞춤법, 띄어쓰기, 문법에 주의하세요!"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '1.1rem',
              lineHeight: 1.8,
            },
          }}
        />

        {/* 글자 수 및 진행률 */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              글자 수: {charCount} / {assessment.wordCountMax}자
              (최소 {assessment.wordCountMin}자)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getProgressValue().toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getProgressValue()}
            color={charCount < assessment.wordCountMin ? 'warning' : 'success'}
          />
        </Box>

        {/* 액션 버튼 */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleManualSave}
          >
            임시저장
          </Button>
          <Button
            variant="outlined"
            onClick={() => setPreviewDialogOpen(true)}
          >
            미리보기
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={charCount < (assessment?.wordCountMin || 800)}
          >
            제출하기
          </Button>
        </Box>
      </Paper>

      {/* 제출 확인 다이얼로그 */}
      <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)}>
        <DialogTitle>답안 제출 확인</DialogTitle>
        <DialogContent>
          <Typography>
            작성한 답안을 제출하시겠습니까?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            • 글자 수: {charCount}자<br />
            • 제출 후에는 수정할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)}>
            취소
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            color="primary"
          >
            제출
          </Button>
        </DialogActions>
      </Dialog>

      {/* 미리보기 다이얼로그 */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>답안 미리보기</DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Typography
              sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                fontSize: '1rem',
              }}
            >
              {content || '작성된 내용이 없습니다.'}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
