/**
 * 진단 평가 시스템 서비스
 */

import { supabase } from './supabaseClient';
import type {
  DiagnosticAssessment,
  DiagnosticAssessmentWithItems,
  AssessmentItem,
  AssessmentItemWithDetails,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  AddItemsToAssessmentRequest,
  AssessmentAttempt,
  StartAssessmentResponse,
  SaveResponseRequest,
  StudentResponse,
} from '../types/diagnosticAssessment';

// ============================================
// 진단 평가 관리
// ============================================

/**
 * 진단 평가 생성
 */
export async function createDiagnosticAssessment(
  data: CreateAssessmentRequest
): Promise<DiagnosticAssessment> {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data: assessment, error } = await supabase
    .from('diagnostic_assessments')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return assessment;
}

/**
 * 진단 평가 목록 조회
 */
export async function getDiagnosticAssessments(filters?: {
  status?: 'draft' | 'published' | 'archived';
  grade_band?: string;
  created_by_user_id?: number;
}): Promise<DiagnosticAssessmentWithItems[]> {
  if (!supabase) throw new Error('Supabase client not initialized');

  let query = supabase
    .from('diagnostic_assessments')
    .select(`
      *,
      assessment_items (
        assessment_item_id,
        item_id,
        sequence_number,
        points
      )
    `)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.grade_band) {
    query = query.eq('grade_band', filters.grade_band);
  }

  if (filters?.created_by_user_id) {
    query = query.eq('created_by_user_id', filters.created_by_user_id);
  }

  const { data, error } = await query;

  if (error) throw error;

  // 문항 수 추가
  return (data || []).map(assessment => ({
    ...assessment,
    item_count: assessment.assessment_items?.length || 0,
    items: assessment.assessment_items,
  }));
}

/**
 * 진단 평가 상세 조회
 */
export async function getDiagnosticAssessmentById(
  assessmentId: number
): Promise<DiagnosticAssessmentWithItems> {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data: assessment, error: assessmentError } = await supabase
    .from('diagnostic_assessments')
    .select('*')
    .eq('assessment_id', assessmentId)
    .single();

  if (assessmentError) throw assessmentError;

  // 평가에 포함된 문항 조회 (문항 상세 정보 포함)
  const { data: items, error: itemsError } = await supabase
    .from('assessment_items')
    .select(`
      *,
      items (
        item_id,
        item_kind,
        evaluation_area,
        stimulus_id,
        current_version_id,
        stimuli (
          stimulus_id,
          title,
          content_text
        )
      )
    `)
    .eq('assessment_id', assessmentId)
    .order('sequence_number', { ascending: true });

  if (itemsError) throw itemsError;

  // 각 문항의 최신 버전 내용 조회
  const itemsWithContent: AssessmentItemWithDetails[] = await Promise.all(
    (items || []).map(async (item: any) => {
      if (!item.items?.current_version_id) {
        return {
          ...item,
          item: {
            ...item.items,
            content_json: {},
          },
        };
      }

      const { data: version } = await supabase!
        .from('authoring_item_versions')
        .select('content_json')
        .eq('version_id', item.items.current_version_id)
        .single();

      return {
        ...item,
        item: {
          ...item.items,
          content_json: version?.content_json || {},
          stimulus: item.items.stimuli,
        },
      };
    })
  );

  return {
    ...assessment,
    items: itemsWithContent,
    item_count: itemsWithContent.length,
  };
}

/**
 * 진단 평가 수정
 */
export async function updateDiagnosticAssessment(
  assessmentId: number,
  data: UpdateAssessmentRequest
): Promise<DiagnosticAssessment> {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data: assessment, error } = await supabase
    .from('diagnostic_assessments')
    .update(data)
    .eq('assessment_id', assessmentId)
    .select()
    .single();

  if (error) throw error;
  return assessment;
}

/**
 * 진단 평가 삭제
 */
export async function deleteDiagnosticAssessment(
  assessmentId: number
): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { error } = await supabase
    .from('diagnostic_assessments')
    .delete()
    .eq('assessment_id', assessmentId);

  if (error) throw error;
}

/**
 * 평가 배포 (상태 변경: draft → published)
 */
export async function publishAssessment(
  assessmentId: number
): Promise<DiagnosticAssessment> {
  return updateDiagnosticAssessment(assessmentId, { status: 'published' });
}

// ============================================
// 평가 문항 관리
// ============================================

/**
 * 평가에 문항 추가
 */
export async function addItemsToAssessment(
  request: AddItemsToAssessmentRequest
): Promise<AssessmentItem[]> {
  if (!supabase) throw new Error('Supabase client not initialized');

  // 기존 문항 삭제 (전체 교체 방식)
  await supabase
    .from('assessment_items')
    .delete()
    .eq('assessment_id', request.assessment_id);

  // 새 문항 추가
  const itemsToInsert = request.items.map(item => ({
    assessment_id: request.assessment_id,
    item_id: item.item_id,
    sequence_number: item.sequence_number,
    points: item.points,
  }));

  const { data, error } = await supabase
    .from('assessment_items')
    .insert(itemsToInsert)
    .select();

  if (error) throw error;
  return data || [];
}

/**
 * 평가에서 문항 제거
 */
export async function removeItemFromAssessment(
  assessmentItemId: number
): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { error } = await supabase
    .from('assessment_items')
    .delete()
    .eq('assessment_item_id', assessmentItemId);

  if (error) throw error;
}

/**
 * 문항 순서 변경
 */
export async function updateItemSequence(
  assessmentId: number,
  items: { assessment_item_id: number; sequence_number: number }[]
): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized');

  // 각 문항의 순서를 개별적으로 업데이트
  const updates = items.map(item =>
    supabase!
      .from('assessment_items')
      .update({ sequence_number: item.sequence_number })
      .eq('assessment_item_id', item.assessment_item_id)
      .eq('assessment_id', assessmentId)
  );

  await Promise.all(updates);
}

// ============================================
// 학생 평가 응시
// ============================================

/**
 * 평가 시작 (attempt 생성)
 */
export async function startAssessment(
  assessmentId: number,
  studentId: number
): Promise<StartAssessmentResponse> {
  if (!supabase) throw new Error('Supabase client not initialized');

  // 평가 상세 정보 조회
  const assessment = await getDiagnosticAssessmentById(assessmentId);

  if (assessment.status !== 'published') {
    throw new Error('This assessment is not published');
  }

  // 총점 계산
  const maxScore = (assessment.items || []).reduce(
    (sum, item) => sum + item.points,
    0
  );

  // 기존 attempt 확인
  const { data: existingAttempt } = await supabase
    .from('assessment_attempts')
    .select('*')
    .eq('assessment_id', assessmentId)
    .eq('student_id', studentId)
    .maybeSingle();

  if (existingAttempt) {
    // 기존 attempt가 있으면 반환
    return {
      attempt: existingAttempt,
      assessment,
    };
  }

  // 새 attempt 생성
  const { data: attempt, error } = await supabase
    .from('assessment_attempts')
    .insert([
      {
        assessment_id: assessmentId,
        student_id: studentId,
        max_score: maxScore,
        status: 'in_progress',
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    attempt,
    assessment,
  };
}

/**
 * 답안 저장 (임시 저장 또는 제출)
 */
export async function saveResponse(
  request: SaveResponseRequest
): Promise<StudentResponse> {
  if (!supabase) throw new Error('Supabase client not initialized');

  // 기존 응답 확인
  const { data: existingResponse } = await supabase
    .from('student_responses')
    .select('*')
    .eq('attempt_id', request.attempt_id)
    .eq('assessment_item_id', request.assessment_item_id)
    .maybeSingle();

  const responseData = {
    attempt_id: request.attempt_id,
    assessment_item_id: request.assessment_item_id,
    response_type: request.response_type,
    selected_option_index: request.selected_option_index,
    essay_text: request.essay_text,
  };

  if (existingResponse) {
    // 기존 응답 업데이트
    const { data, error } = await supabase
      .from('student_responses')
      .update(responseData)
      .eq('response_id', existingResponse.response_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // 새 응답 생성
    const { data, error } = await supabase
      .from('student_responses')
      .insert([responseData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * 평가 제출
 */
export async function submitAssessment(attemptId: number): Promise<AssessmentAttempt> {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('assessment_attempts')
    .update({
      submitted_at: new Date().toISOString(),
      status: 'submitted',
    })
    .eq('attempt_id', attemptId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 응시 현황 조회
 */
export async function getAssessmentAttempt(attemptId: number): Promise<AssessmentAttempt> {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('assessment_attempts')
    .select('*')
    .eq('attempt_id', attemptId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * 학생의 응답 목록 조회
 */
export async function getStudentResponses(attemptId: number): Promise<StudentResponse[]> {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('student_responses')
    .select('*')
    .eq('attempt_id', attemptId)
    .order('assessment_item_id', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * 학생의 평가 목록 조회
 */
export async function getStudentAssessments(
  studentId: number
): Promise<AssessmentAttempt[]> {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('assessment_attempts')
    .select(`
      *,
      diagnostic_assessments (
        assessment_id,
        title,
        description,
        grade_band,
        assessment_type
      )
    `)
    .eq('student_id', studentId)
    .order('started_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
