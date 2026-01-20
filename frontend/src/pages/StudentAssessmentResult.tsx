import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  LinearProgress,
  Alert,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Cancel,
  Home,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import type {
  AssessmentAttempt,
  StudentResponse,
  AssessmentItemWithDetails,
} from '../types/diagnosticAssessment';
import { supabase } from '../services/supabaseClient';

interface AttemptWithDetails extends AssessmentAttempt {
  diagnostic_assessments: {
    title: string;
    description: string;
    items: AssessmentItemWithDetails[];
  };
}

interface ResponseWithGrading extends StudentResponse {
  essay_gradings?: {
    criteria_scores: any;
    overall_feedback: string;
  }[];
}

export default function StudentAssessmentResult() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState<AttemptWithDetails | null>(null);
  const [responses, setResponses] = useState<ResponseWithGrading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (attemptId) {
      loadResults();
    }
  }, [attemptId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      // 응시 정보 조회
      const { data: attemptData, error: attemptError } = await supabase
        .from('assessment_attempts')
        .select(`
          *,
          diagnostic_assessments (
            title,
            description,
            items:assessment_items (
              assessment_item_id,
              sequence_number,
              points,
              draft_item_id,
              authoring_items (
                item_kind,
                stimulus_id,
                current_version_id,
                stimuli (
                  title,
                  content_text
                ),
                authoring_item_versions (
                  content_json
                )
              )
            )
          )
        `)
        .eq('attempt_id', parseInt(attemptId!))
        .single();

      if (attemptError) throw attemptError;

      // 응답 조회 (essay_gradings 포함)
      const { data: responsesData, error: responsesError } = await supabase
        .from('student_responses')
        .select(`
          *,
          essay_gradings (
            criteria_scores,
            overall_feedback
          )
        `)
        .eq('attempt_id', parseInt(attemptId!))
        .order('assessment_item_id', { ascending: true });

      if (responsesError) throw responsesError;

      setAttempt(attemptData as AttemptWithDetails);
      setResponses(responsesData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '결과 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  const getResponseForItem = (itemId: number): ResponseWithGrading | undefined => {
    return responses.find((r) => r.assessment_item_id === itemId);
  };

  const renderItemResult = (item: AssessmentItemWithDetails, index: number) => {
    const response = getResponseForItem(item.assessment_item_id);
    const contentJson = item.authoring_items?.current_version?.content_json;
    const itemKind = item.authoring_items?.item_kind || '';

    if (!response) {
      return (
        <Accordion key={item.assessment_item_id}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <Chip label={`문항 ${index + 1}`} size="small" />
              <Typography>응답 없음</Typography>
            </Box>
          </AccordionSummary>
        </Accordion>
      );
    }

    const isCorrect = response.is_correct;
    const score = response.score || 0;

    return (
      <Accordion key={item.assessment_item_id}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Chip label={`문항 ${index + 1}`} size="small" color="primary" />

            {itemKind.startsWith('mcq') && (
              <>
                {isCorrect ? (
                  <CheckCircle color="success" />
                ) : (
                  <Cancel color="error" />
                )}
                <Typography>
                  {isCorrect ? '정답' : '오답'} ({score}/{item.points}점)
                </Typography>
              </>
            )}

            {itemKind === 'essay' && (
              <Typography>
                {score.toFixed(1)}/{item.points}점
              </Typography>
            )}
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          <Box>
            {/* 지문 */}
            {item.authoring_items?.stimuli && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {item.authoring_items.stimuli.title}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {item.authoring_items.stimuli.content_text}
                </Typography>
              </Box>
            )}

            {/* 문항 내용 */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              {contentJson?.stem || '문항 내용 없음'}
            </Typography>

            {/* 객관식 결과 */}
            {itemKind.startsWith('mcq') && contentJson?.options && (
              <Box sx={{ mb: 2 }}>
                {contentJson.options.map((option: any, idx: number) => {
                  const isSelected = response.selected_option_index === idx;
                  const isCorrectOption = option.is_correct;

                  return (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        mb: 1,
                        border: 2,
                        borderColor: isCorrectOption
                          ? 'success.main'
                          : isSelected
                          ? 'error.main'
                          : 'divider',
                        bgcolor: isCorrectOption
                          ? 'success.50'
                          : isSelected
                          ? 'error.50'
                          : 'transparent',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isCorrectOption && <CheckCircle color="success" />}
                        {isSelected && !isCorrectOption && <Cancel color="error" />}
                        <Typography>{option.text}</Typography>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            )}

            {/* 서술형 결과 */}
            {itemKind === 'essay' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  학생 답안:
                </Typography>
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                    {response.essay_text || '답안 없음'}
                  </Typography>
                </Paper>

                {response.essay_gradings?.[0] && (
                  <Card sx={{ bgcolor: 'info.50', mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom color="info.dark">
                        AI 채점 피드백
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {response.essay_gradings[0].overall_feedback}
                      </Typography>

                      {response.essay_gradings[0].criteria_scores && (
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {response.essay_gradings[0].criteria_scores.map(
                            (criterion: any, idx: number) => (
                              <Chip
                                key={idx}
                                label={`${criterion.area}: ${criterion.feedback}`}
                                size="small"
                                color="info"
                                variant="outlined"
                              />
                            )
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          결과를 불러오는 중...
        </Typography>
      </Box>
    );
  }

  if (error || !attempt) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || '결과를 찾을 수 없습니다.'}</Alert>
        <Button
          startIcon={<Home />}
          onClick={() => navigate('/student/assessments')}
          sx={{ mt: 2 }}
        >
          평가 목록으로
        </Button>
      </Box>
    );
  }

  const items = attempt.diagnostic_assessments?.items || [];
  const percentage = attempt.max_score > 0
    ? ((attempt.total_score || 0) / attempt.max_score) * 100
    : 0;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* 헤더 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4">
            {attempt.diagnostic_assessments.title}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 점수 요약 */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h5">
              총점: {attempt.total_score?.toFixed(1) || 0} / {attempt.max_score}점
            </Typography>
            <Chip
              label={`${percentage.toFixed(1)}%`}
              color={percentage >= 80 ? 'success' : percentage >= 60 ? 'primary' : 'warning'}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{ height: 10, borderRadius: 1 }}
            color={percentage >= 80 ? 'success' : percentage >= 60 ? 'primary' : 'warning'}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label={`응시: ${new Date(attempt.started_at).toLocaleString('ko-KR')}`}
            variant="outlined"
          />
          {attempt.submitted_at && (
            <Chip
              label={`제출: ${new Date(attempt.submitted_at).toLocaleString('ko-KR')}`}
              variant="outlined"
            />
          )}
          <Chip
            label={attempt.status === 'graded' ? '채점 완료' : '채점 중'}
            color={attempt.status === 'graded' ? 'success' : 'warning'}
          />
        </Box>
      </Paper>

      {/* 문항별 결과 */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        문항별 결과
      </Typography>

      <Box sx={{ mb: 3 }}>
        {items.map((item, index) => renderItemResult(item, index))}
      </Box>

      {/* 하단 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Home />}
          onClick={() => navigate('/student/assessments')}
        >
          평가 목록으로
        </Button>
      </Box>
    </Box>
  );
}
