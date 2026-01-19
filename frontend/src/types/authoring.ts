/**
 * 문항 제작 시스템 타입 정의
 */

export interface AuthoringProject {
  project_id: number;
  title: string;
  grade_band: string;
  topic_tags: string[];
  difficulty_target: number | null;
  status: string;
  primary_project_stimulus_id: number | null; // 프로젝트별 편집 가능한 지문 복사본 ID
  created_at: string;
  updated_at: string;
}

// 원본 지문 (읽기 전용)
export interface Stimulus {
  stimulus_id: number;
  title: string;
  content_type: string;
  content_text: string | null;
  grade_band: string;
  genre: string | null;
  word_count: number | null;
  source_title?: string;
  source_author?: string;
  source_year?: string;
}

// 프로젝트별 지문 복사본 (편집 가능)
export interface ProjectStimulus {
  project_stimulus_id: number;
  project_id: number;
  original_stimulus_id: number | null; // 원본 지문 참조

  // 편집 가능한 필드
  title: string;
  content_type: string;
  content_text: string | null;
  grade_band: string;
  genre: string | null;
  word_count: number | null;

  // 메타데이터
  source_title: string | null;
  source_author: string | null;
  source_year: string | null;
  source_url: string | null;

  // 편집 이력
  is_modified: boolean;
  modified_fields: string[] | null;

  created_at: string;
  updated_at: string;
}

// 실제 DB 스키마에 맞춘 인터페이스
export interface AuthoringItem {
  draft_item_id: number;
  project_id: number;
  item_kind: string;
  status: string;
  current_version_id: number | null;
  created_at: string;
  // 조인된 버전 정보
  current_version?: {
    version_id: number;
    content_json: any;
    created_at: string;
  };
}

// DB 프롬프트 템플릿 인터페이스
export interface PromptBaseTemplate {
  base_template_id: number;
  template_name: string;
  template_code: string;
  persona_text: string;
  input_schema_text: string;
  task_text: string;
  quality_rules_text: string;
  output_format_text: string;
  self_check_text: string;
  placeholders: string[];
  target_grade_bands: string[];
  version: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PromptAreaTemplate {
  area_template_id: number;
  area_code: string;
  area_name: string;
  area_description: string | null;
  objective_text: string;
  guidelines_text: string;
  example_patterns: string | null;
  skill_tags: string[];
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserFavoritePrompt {
  favorite_id: number;
  user_id: number;
  favorite_name: string;
  base_template_id: number | null;
  area_template_id: number | null;
  custom_prompt_text: string | null;
  custom_overrides: Record<string, string>;
  usage_count: number;
  last_used_at: string | null;
}

// 문항 편집 데이터 타입
export interface ItemEditData {
  stem: string;
  item_type: string;
  options?: { text: string; is_correct: boolean }[];
  rubric?: any;
}

// 새 지문 데이터 타입
export interface NewStimulusData {
  title: string;
  content_type: string;
  content_text: string;
  grade_band: string;
  genre: string;
  source_title: string;
  source_author: string;
  source_year: string;
}
