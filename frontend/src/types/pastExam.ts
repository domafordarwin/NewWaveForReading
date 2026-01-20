// 기출문항 관련 타입 정의

// 기출문항 기본 타입
export interface PastExamItem {
  item_id: number;
  item_code: string | null;
  grade_band: string;
  item_type: string;
  question_text: string;
  max_score: number;
  difficulty_level: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // 지문 정보
  stimulus_id: number | null;
  stimulus_title: string | null;
  stimulus_content: string | null;
  stimulus_content_type: string | null;
  stimulus_assets: StimulusAssets | null;
  stimulus_source: StimulusSource | null;
  stimulus_genre: string | null;
  stimulus_word_count: number | null;

  // 레이블
  grade_band_label: string;
  item_type_label: string;
  difficulty_label: string;
}

// 지문 자료 타입
export interface StimulusAssets {
  files?: Array<{
    url: string;
    type: string;
    caption?: string;
  }>;
  images?: Array<{
    url: string;
    alt?: string;
    caption?: string;
  }>;
  captions?: string[];
}

// 지문 출처 타입
export interface StimulusSource {
  source?: string;
  copyright?: string;
  page?: string;
  note?: string;
  author?: string;
}

// 객관식 보기 타입
export interface ItemOptionWithScoring {
  option_id: number;
  item_id: number;
  label: string;
  option_text: string;
  display_order: number;
  is_correct: boolean;
  partial_score: number;
  feedback: string | null;
  misconception_tag: string | null;
}

// 루브릭 상세 타입
export interface RubricDetail {
  rubric_id: number;
  item_id: number | null;
  part_id: number | null;
  rubric_type: string;
  target_type: string;
  rubric_json: RubricJson;
  version: number;
  created_at: string;

  // 문항 정보
  item_code: string | null;
  grade_band: string | null;
  item_type: string | null;
  question_text: string | null;
  max_score: number | null;
  rubric_type_label: string;
}

// 루브릭 JSON 구조
export interface RubricJson {
  title?: string;
  description?: string;
  total_points?: number;
  exemplar?: string;
  criteria?: Array<{
    name: string;
    weight: number;
    max_points: number;
    levels: Array<{
      level: number;
      descriptor: string;
      points: number;
    }>;
  }>;
}

// 루브릭 기준/수준 통합 타입
export interface RubricCriteriaLevel {
  criterion_id: number;
  rubric_id: number;
  criterion_name: string;
  criterion_weight: number;
  criterion_max_points: number;
  criterion_order: number;

  level_id: number | null;
  level_value: number | null;
  level_descriptor: string | null;
  level_points: number | null;

  rubric_type: string;
  item_id: number | null;
  item_code: string | null;
  grade_band: string | null;
}

// 정답 키 타입
export interface ItemAnswerKey {
  key_id: number;
  item_id: number | null;
  part_id: number | null;
  target_type: string;
  answer_type: string;
  correct_option_ids: number[];
  correct_text: string | null;
  scoring_rules_json: any;
  created_at: string;

  item_code: string | null;
  grade_band: string | null;
  item_type: string | null;
  question_text: string | null;
  max_score: number | null;
  answer_type_label: string;
}

// 영역 매핑 타입
export interface ItemDomain {
  item_id: number;
  domain_id: number;
  weight: number;
  primary_flag: boolean;

  domain_code: string;
  domain_name: string;
  domain_type: string;
  domain_description: string | null;

  parent_domain_code: string | null;
  parent_domain_name: string | null;

  item_code: string | null;
  grade_band: string | null;
  item_type: string | null;
}

// 기출문항 통계 타입
export interface PastExamStatistics {
  grade_band: string;
  grade_band_label: string;
  total_items: number;
  mcq_single_count: number;
  mcq_multi_count: number;
  essay_count: number;
  short_text_count: number;
  avg_max_score: number;
  avg_difficulty: number;
}

// 필터 옵션 타입
export interface PastExamFilter {
  gradeBand?: string;
  itemType?: string;
  difficulty?: number;
  searchTerm?: string;
  stimulusId?: number;
}

// 정렬 옵션 타입
export type SortOption =
  | "item_code"
  | "grade_band"
  | "difficulty"
  | "created_at";
export type SortDirection = "asc" | "desc";

// 학년군 옵션
export const GRADE_BAND_OPTIONS = [
  { value: "초저", label: "초등 저학년" },
  { value: "초고", label: "초등 고학년" },
  { value: "중저", label: "중등 저학년" },
  { value: "중고", label: "중등 고학년" },
];

// 문항 유형 옵션
export const ITEM_TYPE_OPTIONS = [
  { value: "mcq_single", label: "객관식 (단일)" },
  { value: "mcq_multi", label: "객관식 (복수)" },
  { value: "essay", label: "서술형" },
  { value: "short_text", label: "단답형" },
  { value: "fill_blank", label: "빈칸 채우기" },
  { value: "composite", label: "복합문항" },
];

// 난이도 옵션
export const DIFFICULTY_OPTIONS = [
  { value: 1, label: "하" },
  { value: 2, label: "중하" },
  { value: 3, label: "중" },
  { value: 4, label: "중상" },
  { value: 5, label: "상" },
];
