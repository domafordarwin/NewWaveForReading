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
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Send as SendIcon,
  Timer as TimerIcon,
  MenuBook as BookIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { 
  getAssessmentById, 
  createAnswer, 
  submitAssessment, 
  startAssessment,
  analyzeAnswer,
  getAnswerByAssessment,
} from '../services/api';

export default function AssessmentTaking() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [content, setContent] = useState('');
  const [answerId, setAnswerId] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(5400); // 90분 = 5400초
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 검사 정보 로드
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);
        const data = await getAssessmentById(Number(assessmentId));
        setAssessment(data);
        
        // 검사 시작 처리 (NOT_STARTED 상태인 경우)
        if (data.status === 'NOT_STARTED') {
          await startAssessment(Number(assessmentId));
        }
        
        // 제한 시간 설정
        if (data.timeLimitMinutes) {
          setTimeRemaining(data.timeLimitMinutes * 60);
        }

        try {
          const existingAnswer = await getAnswerByAssessment(Number(assessmentId));
          if (existingAnswer?.content) {
            setContent(existingAnswer.content);
          }
          if (existingAnswer?.answerId) {
            setAnswerId(existingAnswer.answerId);
          }
        } catch (answerErr: any) {
          if (answerErr?.response?.status !== 404) {
            console.error('기존 답안 로드 실패:', answerErr);
          }
        }
        
        setError(null);
      } catch (err: any) {
        console.error('검사 로드 실패:', err);
        setError(err.message || '검사를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      loadAssessment();
    }
  }, [assessmentId]);

  // 글자 수 계산
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // 타이머
  useEffect(() => {
    if (!assessment) return;
    
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
  }, [assessment]);

  // 자동 저장
  useEffect(() => {
    if (content.length === 0 || !assessment) return;
    
    const autoSaveTimer = setTimeout(() => {
      handleAutoSave();
    }, 30000); // 30초마다

    return () => clearTimeout(autoSaveTimer);
  }, [content, assessment]);

  const handleAutoSave = async () => {
    if (!assessment) return;
    
    setAutoSaveStatus('saving');
    try {
      if (!content.trim()) {
        setAutoSaveStatus('saved');
        return;
      }

      const answerData = {
        assessmentId: Number(assessmentId),
        content,
        wordCount,
        charCount,
      };
      const savedAnswer = await createAnswer(answerData);
      if (savedAnswer?.answerId) {
        setAnswerId(savedAnswer.answerId);
      }
      setAutoSaveStatus('saved');
    } catch (err) {
      console.error('자동 저장 실패:', err);
      setAutoSaveStatus('error');
    }
  };

  const handleManualSave = async () => {
    if (!assessment) return;
    
    setAutoSaveStatus('saving');
    try {
      const answerData = {
        assessmentId: Number(assessmentId),
        content,
        wordCount,
        charCount,
      };
      const savedAnswer = await createAnswer(answerData);
      if (savedAnswer?.answerId) {
        setAnswerId(savedAnswer.answerId);
      }
      setAutoSaveStatus('saved');
      alert('저장되었습니다.');
    } catch (err: any) {
      console.error('저장 실패:', err);
      setAutoSaveStatus('error');
      alert('저장 실패: ' + (err.message || '알 수 없는 오류'));
    }
  };

  const handleSubmit = () => {
    if (!assessment) return;
    
    if (charCount < (assessment.wordCountMin || 800)) {
      alert(`최소 ${assessment.wordCountMin || 800}자 이상 작성해야 합니다.`);
      return;
    }
    setSubmitDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!assessment) return;
    
    setIsSubmitting(true);
    try {
      // 1. 답안 저장 (아직 저장 안 했으면)
      let finalAnswerId = answerId;
      const answerData = {
        assessmentId: Number(assessmentId),
        content,
        wordCount,
        charCount,
      };
      const savedAnswer = await createAnswer(answerData);
      if (savedAnswer?.answerId) {
        finalAnswerId = savedAnswer.answerId;
        setAnswerId(savedAnswer.answerId);
      }

      // 2. 검사 제출
      await submitAssessment(Number(assessmentId));

      // 3. AI 분석 실행
      if (finalAnswerId) {
        await analyzeAnswer(finalAnswerId);
      }

      setSubmitDialogOpen(false);
      alert('제출이 완료되었습니다. AI 분석 결과는 잠시 후 확인할 수 있습니다.');
      navigate('/student/dashboard');
    } catch (err: any) {
      console.error('제출 실패:', err);
      alert('제출 실패: ' + (err.message || '알 수 없는 오류'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    // 시간 초과 시 자동 제출
    if (!assessment) return;
    
    try {
      if (content.trim()) {
        const answerData = {
          assessmentId: Number(assessmentId),
          content,
          wordCount,
          charCount,
        };
        await createAnswer(answerData);
        await submitAssessment(Number(assessmentId));
      }
      alert('시간이 종료되어 자동으로 제출되었습니다.');
    } catch (err) {
      console.error('자동 제출 실패:', err);
    }
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
    return Math.min((charCount / (assessment.wordCountMax || 1200)) * 100, 100);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !assessment) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || '검사를 찾을 수 없습니다.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/student/dashboard')}>
          대시보드로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* 헤더 - 타이머 및 상태 */}
      <Paper sx={{ p: 2, mb: 3, position: 'sticky', top: 64, zIndex: 100, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              독서논술 검사
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {assessment.topic?.topicText?.substring(0, 80) || '검사'}...
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
              label={autoSaveStatus === 'saved' ? '저장됨' : autoSaveStatus === 'saving' ? '저장 중...' : '저장 오류'}
              color={autoSaveStatus === 'saved' ? 'success' : autoSaveStatus === 'saving' ? 'default' : 'error'}
              size="small"
            />
          </Box>
        </Box>
      </Paper>

      {/* 논제 표시 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BookIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold">
            논제
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
          {assessment.topic?.topicText || '논제 정보가 없습니다.'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={`${assessment.wordCountMin || 800}-${assessment.wordCountMax || 1200}자`} size="small" />
          <Chip label={`제한시간 ${assessment.timeLimitMinutes || 90}분`} size="small" color="primary" />
        </Box>
      </Paper>

      {/* 답안 작성 영역 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          답안 작성
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={20}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="여기에 답안을 작성하세요...

[서론]
논제에 대한 자신의 입장을 명확히 밝히세요.

[본론]
구체적인 근거와 예시를 들어 논리적으로 전개하세요.

[결론]
자신의 주장을 요약하고 마무리하세요."
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: 'monospace',
              fontSize: '1rem',
              lineHeight: 1.8,
            },
          }}
        />
      </Paper>

      {/* 진행 상황 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            글자 수: {charCount} / {assessment.wordCountMax || 1200}
            (최소 {assessment.wordCountMin || 800}자)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(getProgressValue())}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={getProgressValue()} 
          color={charCount >= (assessment.wordCountMin || 800) ? 'primary' : 'warning'}
        />
      </Paper>

      {/* 액션 버튼 */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={handleManualSave}
          disabled={!content.trim()}
        >
          임시저장
        </Button>
        <Button
          variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={() => setPreviewDialogOpen(true)}
          disabled={!content.trim()}
        >
          미리보기
        </Button>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleSubmit}
          disabled={charCount < (assessment.wordCountMin || 800)}
        >
          제출하기
        </Button>
      </Box>

      {/* 제출 확인 다이얼로그 */}
      <Dialog open={submitDialogOpen} onClose={() => !isSubmitting && setSubmitDialogOpen(false)}>
        <DialogTitle>답안 제출 확인</DialogTitle>
        <DialogContent>
          <Typography>
            정말로 답안을 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              작성 글자 수: {charCount}자
            </Typography>
            <Typography variant="body2" color="text.secondary">
              남은 시간: {formatTime(timeRemaining)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)} disabled={isSubmitting}>
            취소
          </Button>
          <Button 
            onClick={handleConfirmSubmit} 
            variant="contained" 
            autoFocus
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : '제출'}
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
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
              {content || '작성된 내용이 없습니다.'}
            </Typography>
          </Paper>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              글자 수: {charCount}자
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
