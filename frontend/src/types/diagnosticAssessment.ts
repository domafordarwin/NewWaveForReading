/**
 * 진단 평가 시스템 타입 정의
 */

import type { RubricCriterion } from '../services/openaiService';

// ============================================
// 진단 평가 기본 타입
// ============================================

export interface DiagnosticAssessment {
  assessment_id: number;
  title: string;
  description: string | null;
  grade_band: '초저' | '초고' | '중저' | '중고';
  assessment_type: 'diagnostic' | 'formative' | 'summative';
  time_limit_minutes: number | null;
  created_by_user_id: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface AssessmentItem {
  assessment_item_id: number;
  assessment_id: number;
  draft_item_id: number;  // authoring_items 테이블 참조
  sequence_number: number;
  points: number;
}

export interface AssessmentAttempt {
  attempt_id: number;
  assessment_id: number;
  student_id: number;
  started_at: string;
  submitted_at: string | null;
  status: 'in_progress' | 'submitted' | 'graded';
  total_score: number | null;
  max_score: number;
}

export interface StudentResponse {
  response_id: number;
  attempt_id: number;
  assessment_item_id: number;
  response_type: 'mcq' | 'essay';

  // 객관식 응답
  selected_option_index: number | null;

  // 서술형 응답
  essay_text: string | null;

  // 채점 결과
  is_correct: boolean | null;
  score: number | null;

  submitted_at: string;
}

export interface CriterionScore {
  area: string;
  weight: number;
  level: 'high' | 'middle' | 'low';
  score: number;
  feedback: string;
}

export interface EssayGrading {
  grading_id: number;
  response_id: number;
  criteria_scores: CriterionScore[];
  total_score: number;
  overall_feedback: string | null;
  graded_by: 'ai' | 'teacher';
  graded_at: string;
}

export interface AreaScore {
  area_name: string;
  score: number;
  max_score: number;
  percentage: number;
}

export interface DiagnosticReport {
  report_id: number;
  attempt_id: number;
  student_id: number;
  assessment_id: number;

  // 종합 점수
  total_score: number;
  max_score: number;
  percentage: number;
  grade: string;  // A+, A, B+, B, C+, C, D, F

  // 영역별 점수
  area_scores: AreaScore[];

  // 강점 및 약점
  strengths: string[];
  weaknesses: string[];

  // 종합 피드백
  comprehensive_feedback: string;
  detailed_feedback: string | null;

  // 학습 추천
  recommended_books: number[];
  improvement_suggestions: string[];

  generated_at: string;
}

// ============================================
// 조인된 데이터 타입 (UI에서 사용)
// ============================================

export interface AssessmentItemWithDetails extends AssessmentItem {
  authoring_items?: {
    draft_item_id: number;
    item_kind: string;
    current_version_id?: number;
    status: string;
    stimulus_id?: number;
    current_version?: {
      content_json: {
        stem: string;
        options?: { text: string; is_correct: boolean }[];
        rubric?: RubricCriterion[];
        keywords?: string[];
      };
    };
    stimuli?: {
      stimulus_id: number;
      title: string;
      content_text: string;
    };
  };
}

export interface DiagnosticAssessmentWithItems extends DiagnosticAssessment {
  items?: AssessmentItemWithDetails[];
  item_count?: number;
}

export interface AssessmentAttemptWithDetails extends AssessmentAttempt {
  assessment?: DiagnosticAssessment;
  student?: {
    user_id: number;
    username: string;
    full_name: string;
  };
}

export interface StudentResponseWithDetails extends StudentResponse {
  assessment_item?: AssessmentItemWithDetails;
  essay_grading?: EssayGrading;
}

// ============================================
// 요청/응답 타입
// ============================================

export interface CreateAssessmentRequest {
  title: string;
  description?: string;
  grade_band: '초저' | '초고' | '중저' | '중고';
  assessment_type?: 'diagnostic' | 'formative' | 'summative';
  time_limit_minutes?: number;
  created_by_user_id: number;
}

export interface UpdateAssessmentRequest {
  title?: string;
  description?: string;
  grade_band?: '초저' | '초고' | '중저' | '중고';
  assessment_type?: 'diagnostic' | 'formative' | 'summative';
  time_limit_minutes?: number;
  status?: 'draft' | 'published' | 'archived';
}

export interface AddItemsToAssessmentRequest {
  assessment_id: number;
  items: {
    draft_item_id: number;
    sequence_number: number;
    points: number;
  }[];
}

export interface StartAssessmentResponse {
  attempt: AssessmentAttempt;
  assessment: DiagnosticAssessmentWithItems;
}

export interface SaveResponseRequest {
  attempt_id: number;
  assessment_item_id: number;
  response_type: 'mcq' | 'essay';
  selected_option_index?: number;
  essay_text?: string;
}

export interface GradingResult {
  attempt_id: number;
  total_score: number;
  max_score: number;
  mcq_correct: number;
  mcq_total: number;
  essay_graded: number;
  essay_total: number;
}

export interface GenerateReportRequest {
  attempt_id: number;
  student_id: number;
  assessment_id: number;
}
