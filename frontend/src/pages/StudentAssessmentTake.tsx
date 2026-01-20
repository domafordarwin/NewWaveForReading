import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Save,
  Send,
  Timer,
} from '@mui/icons-material';
import {
  startAssessment,
  saveResponse,
  submitAssessment,
  getStudentResponses,
} from '../services/diagnosticAssessmentService';
import type {
  StartAssessmentResponse,
  AssessmentItemWithDetails,
  StudentResponse,
} from '../types/diagnosticAssessment';

export default function StudentAssessmentTake() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

  const [assessmentData, setAssessmentData] = useState<StartAssessmentResponse | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [responses, setResponses] = useState<Map<number, StudentResponse>>(new Map());
  const [currentResponse, setCurrentResponse] = useState<{
    selected_option_index?: number;
    essay_text?: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  useEffect(() => {
    if (assessmentId) {
      initializeAssessment();
    }
  }, [assessmentId]);

  const initializeAssessment = async () => {
    try {
      setLoading(true);
      setError(null);

      const studentId = 1; // TODO: 실제 로그인 사용자 ID
      const data = await startAssessment(parseInt(assessmentId!), studentId);
      setAssessmentData(data);

      // 기존 응답 로드
      const existingResponses = await getStudentResponses(data.attempt.attempt_id);
      const responsesMap = new Map<number, StudentResponse>();
      existingResponses.forEach((resp) => {
        responsesMap.set(resp.assessment_item_id, resp);
      });
      setResponses(responsesMap);

      // 첫 문항 응답 로드
      if (data.assessment.items && data.assessment.items.length > 0) {
        loadItemResponse(0, data.assessment.items, responsesMap);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '평가 시작 실패');
    } finally {
      setLoading(false);
    }
  };

  const loadItemResponse = (
    index: number,
    items: AssessmentItemWithDetails[],
    responsesMap: Map<number, StudentResponse>
  ) => {
    const item = items[index];
    const existingResponse = responsesMap.get(item.assessment_item_id);

    if (existingResponse) {
      setCurrentResponse({
        selected_option_index: existingResponse.selected_option_index ?? undefined,
        essay_text: existingResponse.essay_text ?? undefined,
      });
    } else {
      setCurrentResponse({});
    }
  };

  const handleSaveResponse = async (autoSave = false) => {
    if (!assessmentData || !assessmentData.assessment.items) return;

    const item = assessmentData.assessment.items[currentItemIndex];
    const itemKind = item.authoring_items?.item_kind || '';

    // 응답 유형 결정
    const responseType = itemKind.startsWith('mcq') ? 'mcq' : 'essay';

    // 응답이 있는지 확인
    if (
      responseType === 'mcq' &&
      currentResponse.selected_option_index === undefined
    ) {
      if (!autoSave) {
        setError('답을 선택해주세요.');
      }
      return;
    }

    if (
      responseType === 'essay' &&
      (!currentResponse.essay_text || currentResponse.essay_text.trim() === '')
    ) {
      if (!autoSave) {
        setError('답안을 작성해주세요.');
      }
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const savedResponse = await saveResponse({
        attempt_id: assessmentData.attempt.attempt_id,
        assessment_item_id: item.assessment_item_id,
        response_type: responseType,
        selected_option_index: currentResponse.selected_option_index,
        essay_text: currentResponse.essay_text,
      });

      // 응답 맵 업데이트
      const newResponses = new Map(responses);
      newResponses.set(item.assessment_item_id, savedResponse);
      setResponses(newResponses);

      if (!autoSave) {
        // 다음 문항으로 이동
        handleNext();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (!assessmentData?.assessment.items) return;

    if (currentItemIndex < assessmentData.assessment.items.length - 1) {
      const nextIndex = currentItemIndex + 1;
      setCurrentItemIndex(nextIndex);
      loadItemResponse(nextIndex, assessmentData.assessment.items, responses);
    }
  };

  const handlePrevious = () => {
    if (!assessmentData?.assessment.items) return;

    if (currentItemIndex > 0) {
      const prevIndex = currentItemIndex - 1;
      setCurrentItemIndex(prevIndex);
      loadItemResponse(prevIndex, assessmentData.assessment.items, responses);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      await submitAssessment(assessmentData!.attempt.attempt_id);

      // 완료 페이지로 이동
      navigate(`/student/assessments/${assessmentId}/complete`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '제출 실패');
    } finally {
      setSaving(false);
      setShowSubmitDialog(false);
    }
  };

  const renderItemContent = () => {
    if (!assessmentData?.assessment.items) return null;

    const item = assessmentData.assessment.items[currentItemIndex];
    const itemContent = item.authoring_items?.current_version?.content_json;
    const stimulus = item.authoring_items?.stimuli;
    const itemKind = item.authoring_items?.item_kind || '';

    return (
      <Box>
        {/* 지문 표시 */}
        {stimulus && (
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              {stimulus.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
            >
              {stimulus.content_text}
            </Typography>
          </Paper>
        )}

        {/* 문항 */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Chip
              label={`문항 ${currentItemIndex + 1}`}
              color="primary"
              sx={{ mr: 1 }}
            />
            <Chip label={`${item.points}점`} variant="outlined" />
          </Box>

          <Typography variant="h6" sx={{ mb: 3 }}>
            {itemContent?.stem || '문항 내용 없음'}
          </Typography>

          {/* 객관식 */}
          {itemKind.startsWith('mcq') && itemContent?.options && (
            <RadioGroup
              value={currentResponse.selected_option_index ?? ''}
              onChange={(e) =>
                setCurrentResponse({
                  selected_option_index: parseInt(e.target.value),
                })
              }
            >
              {itemContent.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={option.text}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    p: 1,
                    mr: 0,
                  }}
                />
              ))}
            </RadioGroup>
          )}

          {/* 서술형 */}
          {itemKind === 'essay' && (
            <TextField
              fullWidth
              multiline
              rows={10}
              placeholder="답안을 작성하세요..."
              value={currentResponse.essay_text || ''}
              onChange={(e) =>
                setCurrentResponse({ essay_text: e.target.value })
              }
              variant="outlined"
            />
          )}
        </Paper>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          평가를 불러오는 중...
        </Typography>
      </Box>
    );
  }

  if (error && !assessmentData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/student/assessments')}
          sx={{ mt: 2 }}
        >
          목록으로
        </Button>
      </Box>
    );
  }

  if (!assessmentData) return null;

  const totalItems = assessmentData.assessment.items?.length || 0;
  const answeredCount = responses.size;
  const progress = (answeredCount / totalItems) * 100;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* 헤더 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {assessmentData.assessment.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            icon={<Timer />}
            label={`문항 ${currentItemIndex + 1} / ${totalItems}`}
            color="primary"
          />
          <Chip
            label={`응답: ${answeredCount} / ${totalItems}`}
            color={answeredCount === totalItems ? 'success' : 'default'}
          />
        </Box>

        <LinearProgress variant="determinate" value={progress} />
      </Paper>

      {/* 문항 내용 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {renderItemContent()}

      {/* 하단 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handlePrevious}
          disabled={currentItemIndex === 0 || saving}
        >
          이전 문항
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Save />}
            onClick={() => handleSaveResponse(true)}
            disabled={saving}
          >
            임시 저장
          </Button>

          {currentItemIndex < totalItems - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => handleSaveResponse(false)}
              disabled={saving}
            >
              저장 후 다음
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              startIcon={<Send />}
              onClick={() => setShowSubmitDialog(true)}
              disabled={saving}
            >
              평가 제출
            </Button>
          )}
        </Box>
      </Box>

      {/* 제출 확인 다이얼로그 */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>평가 제출</DialogTitle>
        <DialogContent>
          <Typography>
            평가를 제출하시겠습니까?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            응답한 문항: {answeredCount} / {totalItems}
          </Typography>
          {answeredCount < totalItems && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {totalItems - answeredCount}개의 문항이 응답되지 않았습니다.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>취소</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={saving}
          >
            제출하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
