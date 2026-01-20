import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Assessment, Save, ArrowBack, ArrowForward } from '@mui/icons-material';
import {
  createDiagnosticAssessment,
  addItemsToAssessment,
} from '../services/diagnosticAssessmentService';
import type { CreateAssessmentRequest } from '../types/diagnosticAssessment';
import ItemSelector from '../components/ItemSelector';

const steps = ['기본 정보 입력', '문항 선택', '완료'];

export default function DiagnosticAssessmentCreate() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);

  // Step 1: 기본 정보
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    grade_band: '초저' as '초저' | '초고' | '중저' | '중고',
    assessment_type: 'diagnostic' as 'diagnostic' | 'formative' | 'summative',
    time_limit_minutes: 60,
  });

  // Step 2: 선택된 문항들
  const [selectedItems, setSelectedItems] = useState<
    { draft_item_id: number; sequence_number: number; points: number }[]
  >([]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      // Step 1: 기본 정보 저장
      if (!formData.title.trim()) {
        setError('평가 제목을 입력해주세요.');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const request: CreateAssessmentRequest = {
          title: formData.title,
          description: formData.description || undefined,
          grade_band: formData.grade_band,
          assessment_type: formData.assessment_type,
          time_limit_minutes: formData.time_limit_minutes || undefined,
          created_by_user_id: 1, // TODO: 실제 로그인 사용자 ID로 변경
        };

        const assessment = await createDiagnosticAssessment(request);
        setAssessmentId(assessment.assessment_id);
        setActiveStep(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : '평가 생성 실패');
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 1) {
      // Step 2: 문항 추가
      if (selectedItems.length === 0) {
        setError('최소 1개 이상의 문항을 선택해주세요.');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (!assessmentId) {
          throw new Error('평가 ID가 없습니다.');
        }

        await addItemsToAssessment({
          assessment_id: assessmentId,
          items: selectedItems,
        });

        setActiveStep(2);
      } catch (err) {
        setError(err instanceof Error ? err.message : '문항 추가 실패');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleComplete = () => {
    navigate(`/question-dev/diagnostic-assessments/${assessmentId}`);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="평가 제목"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              placeholder="예: 2024년 1학기 진단 평가"
            />

            <TextField
              fullWidth
              label="평가 설명"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={4}
              placeholder="평가에 대한 설명을 입력하세요"
            />

            <FormControl fullWidth required>
              <InputLabel>학년군</InputLabel>
              <Select
                value={formData.grade_band}
                label="학년군"
                onChange={(e) =>
                  handleInputChange('grade_band', e.target.value)
                }
              >
                <MenuItem value="초저">초등 저학년 (1-2학년)</MenuItem>
                <MenuItem value="초고">초등 고학년 (3-4학년)</MenuItem>
                <MenuItem value="중저">중등 저학년 (5-6학년)</MenuItem>
                <MenuItem value="중고">중등 고학년 (중학생)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>평가 유형</InputLabel>
              <Select
                value={formData.assessment_type}
                label="평가 유형"
                onChange={(e) =>
                  handleInputChange('assessment_type', e.target.value)
                }
              >
                <MenuItem value="diagnostic">진단 평가</MenuItem>
                <MenuItem value="formative">형성 평가</MenuItem>
                <MenuItem value="summative">총괄 평가</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label="제한 시간 (분)"
              value={formData.time_limit_minutes}
              onChange={(e) =>
                handleInputChange('time_limit_minutes', parseInt(e.target.value))
              }
              inputProps={{ min: 1 }}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              평가에 포함할 문항을 선택하세요
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {formData.grade_band} 학년군의 문항들이 표시됩니다. 문항을 선택하고 배점을 설정하세요.
            </Typography>

            <ItemSelector
              gradeBand={formData.grade_band}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Assessment sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              진단 평가가 생성되었습니다!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              평가 상세 페이지로 이동하여 추가 설정을 하실 수 있습니다.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleComplete}
              sx={{ minWidth: 200 }}
            >
              평가 상세 보기
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/question-dev/diagnostic-assessments')}
          sx={{ mr: 2 }}
        >
          목록으로
        </Button>
        <Typography variant="h4" component="h1">
          진단 평가 생성
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        {renderStepContent()}

        {activeStep < 2 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBack />}
            >
              이전
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={activeStep === 1 ? <Save /> : <ArrowForward />}
            >
              {loading
                ? '처리 중...'
                : activeStep === 1
                  ? '문항 저장'
                  : '다음'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
