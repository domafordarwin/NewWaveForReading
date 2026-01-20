import { supabase } from "./supabaseClient";
import type {
  PastExamItem,
  ItemOptionWithScoring,
  RubricDetail,
  RubricCriteriaLevel,
  ItemAnswerKey,
  ItemDomain,
  PastExamStatistics,
  PastExamFilter,
} from "../types/pastExam";

/**
 * 기출문항 서비스
 * 기출문항 조회, 루브릭, 채점기준 관련 API
 */
// 더미 데이터 (Supabase 연결 없을 때 사용)
const DEMO_ITEMS: PastExamItem[] = [
  {
    item_id: 1,
    item_code: "MIDHIGH_Q01",
    grade_band: "중고",
    item_type: "mcq_single",
    question_text:
      "㉠과 ㉡의 방법을 가장 적절하게 비교한 마을 사람을 고르시오.",
    max_score: 1,
    difficulty_level: 3,
    is_active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    stimulus_id: 1,
    stimulus_title: "지혜로운 두 사람 이야기",
    stimulus_content:
      "옛날, 한 마을에 큰 지혜를 가진 두 사람이 살고 있었습니다. 첫 번째 사람은 ㉠아이작이라는 이름의 노인이었고, 두 번째 사람은 ㉡시몬이라는 젊은 사람이었습니다. 아이작은 나이가 많고 경험이 풍부한 지혜자로, 마을 사람들 사이에서 존경받고 있었습니다. 시몬은 젊고 똒똒했지만, 세상에 대한 경험이 부족했습니다.\n\n어느 날, 마을에 큰 문제가 생겼습니다. 마을의 강물이 갑자기 불어나서, 마을 사람들의 집이 침수될 위험에 처하게 된 것입니다...",
    stimulus_content_type: "text",
    stimulus_assets: null,
    stimulus_source: { source: "문해력 진단 평가", note: "중등 고학년용" },
    stimulus_genre: "문학",
    stimulus_word_count: 850,
    grade_band_label: "중등 고학년",
    item_type_label: "객관식 (단일)",
    difficulty_label: "중",
  },
  {
    item_id: 2,
    item_code: "MIDHIGH_E01",
    grade_band: "중고",
    item_type: "essay",
    question_text:
      "만약 자신이 마을 사람이었다면, 누구의 말을 따랐을지 쓰고, 그렇게 생각한 이유를 서술하시오.",
    max_score: 5,
    difficulty_level: 4,
    is_active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    stimulus_id: 1,
    stimulus_title: "지혜로운 두 사람 이야기",
    stimulus_content:
      "옛날, 한 마을에 큰 지혜를 가진 두 사람이 살고 있었습니다...",
    stimulus_content_type: "text",
    stimulus_assets: null,
    stimulus_source: { source: "문해력 진단 평가", note: "중등 고학년용" },
    stimulus_genre: "문학",
    stimulus_word_count: 850,
    grade_band_label: "중등 고학년",
    item_type_label: "서술형",
    difficulty_label: "중상",
  },
  {
    item_id: 3,
    item_code: "ELEMHIGH_Q01",
    grade_band: "초고",
    item_type: "mcq_single",
    question_text:
      '화자가 "머리가 뜨거워요"라고 말한 까닭으로 가장 적절한 것은?',
    max_score: 1,
    difficulty_level: 3,
    is_active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    stimulus_id: 2,
    stimulus_title: "외식하는 날 (시)",
    stimulus_content:
      "외식하는 날\n\n따가운 햇살\n눈부신 하늘 아래\n\n아빠 손을 잡고\n외식하러 가는 길\n\n갈비? 냉면? 떡볶이?\n형이랑 난 메뉴 전쟁 중\n\n엄마는 아무거나\n아빠도 아무거나\n\n결국 오늘도\n형이 좋아하는 갈비집\n\n머리가 뜨거워요",
    stimulus_content_type: "text",
    stimulus_assets: null,
    stimulus_source: { source: "문해력 진단 평가", note: "초등 고학년용" },
    stimulus_genre: "문학",
    stimulus_word_count: 120,
    grade_band_label: "초등 고학년",
    item_type_label: "객관식 (단일)",
    difficulty_label: "중",
  },
];

const DEMO_OPTIONS: ItemOptionWithScoring[] = [
  {
    option_id: 1,
    item_id: 1,
    label: "①",
    option_text:
      "마을 사람 1: ㉠의 방법이 ㉡보다 더 빨리 물을 처리할 수 있었어.",
    display_order: 1,
    is_correct: false,
    partial_score: 20,
    feedback: "지문에서 시몬(㉡)이 더 빨랐다고 명시되어 있음",
    misconception_tag: null,
  },
  {
    option_id: 2,
    item_id: 1,
    label: "②",
    option_text:
      "마을 사람 2: ㉠과 ㉡의 방법은 달랐지만 결국 결과가 똑같았다고 볼 수 있지.",
    display_order: 2,
    is_correct: false,
    partial_score: 40,
    feedback: "결과의 속도가 달랐음",
    misconception_tag: null,
  },
  {
    option_id: 3,
    item_id: 1,
    label: "③",
    option_text:
      "마을 사람 3: 두 사람 다 물을 잘 처리할 수 있었지만, ㉡의 방법이 시간이 더 걸렸지.",
    display_order: 3,
    is_correct: false,
    partial_score: 30,
    feedback: "반대로 해석함",
    misconception_tag: null,
  },
  {
    option_id: 4,
    item_id: 1,
    label: "④",
    option_text:
      "마을 사람 4: ㉡의 방법은 ㉠이 지닌 장점을 갖지 못했고, 제방이 붕괴되는 아쉬움이 있었어.",
    display_order: 4,
    is_correct: true,
    partial_score: 100,
    feedback: "정답 - 지문의 내용과 정확히 일치함",
    misconception_tag: null,
  },
  {
    option_id: 5,
    item_id: 1,
    label: "⑤",
    option_text:
      "마을 사람 5: ㉠의 방법은 제방의 완성이라는 결과를 가져왔고, ㉡은 기다림과 인내의 중요성을 사람들에게 전해 주었어.",
    display_order: 5,
    is_correct: false,
    partial_score: 20,
    feedback: "㉠과 ㉡의 특성을 반대로 서술함",
    misconception_tag: null,
  },
];

const DEMO_STATISTICS: PastExamStatistics[] = [
  {
    grade_band: "초저",
    grade_band_label: "초등 저학년",
    total_items: 15,
    mcq_single_count: 10,
    mcq_multi_count: 2,
    essay_count: 3,
    short_text_count: 0,
    avg_max_score: 2.5,
    avg_difficulty: 2.3,
  },
  {
    grade_band: "초고",
    grade_band_label: "초등 고학년",
    total_items: 20,
    mcq_single_count: 14,
    mcq_multi_count: 3,
    essay_count: 3,
    short_text_count: 0,
    avg_max_score: 2.8,
    avg_difficulty: 3.0,
  },
  {
    grade_band: "중저",
    grade_band_label: "중등 저학년",
    total_items: 22,
    mcq_single_count: 15,
    mcq_multi_count: 3,
    essay_count: 4,
    short_text_count: 0,
    avg_max_score: 3.2,
    avg_difficulty: 3.2,
  },
  {
    grade_band: "중고",
    grade_band_label: "중등 고학년",
    total_items: 25,
    mcq_single_count: 16,
    mcq_multi_count: 4,
    essay_count: 5,
    short_text_count: 0,
    avg_max_score: 3.5,
    avg_difficulty: 3.5,
  },
];
// 기출문항 목록 조회
export const fetchPastExamItems = async (
  filter?: PastExamFilter,
): Promise<PastExamItem[]> => {
  if (!supabase) {
    // 더미 데이터 반환
    let result = [...DEMO_ITEMS];
    if (filter?.gradeBand) {
      result = result.filter((item) => item.grade_band === filter.gradeBand);
    }
    if (filter?.itemType) {
      result = result.filter((item) => item.item_type === filter.itemType);
    }
    if (filter?.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.question_text.toLowerCase().includes(term) ||
          item.item_code?.toLowerCase().includes(term),
      );
    }
    return result;
  }

  let query = supabase
    .from("v_past_exam_items")
    .select("*")
    .order("grade_band")
    .order("item_code");

  if (filter?.gradeBand) {
    query = query.eq("grade_band", filter.gradeBand);
  }
  if (filter?.itemType) {
    query = query.eq("item_type", filter.itemType);
  }
  if (filter?.difficulty) {
    query = query.eq("difficulty_level", filter.difficulty);
  }
  if (filter?.stimulusId) {
    query = query.eq("stimulus_id", filter.stimulusId);
  }
  if (filter?.searchTerm) {
    query = query.or(
      `question_text.ilike.%${filter.searchTerm}%,item_code.ilike.%${filter.searchTerm}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("기출문항 조회 오류:", error);
    throw error;
  }

  return data || [];
};

// 기출문항 단건 조회
export const fetchPastExamItem = async (
  itemId: number,
): Promise<PastExamItem | null> => {
  if (!supabase) {
    return DEMO_ITEMS.find((item) => item.item_id === itemId) || null;
  }

  const { data, error } = await supabase
    .from("v_past_exam_items")
    .select("*")
    .eq("item_id", itemId)
    .single();

  if (error) {
    console.error("기출문항 단건 조회 오류:", error);
    throw error;
  }

  return data;
};

// 객관식 보기 + 채점정보 조회
export const fetchItemOptionsWithScoring = async (
  itemId: number,
): Promise<ItemOptionWithScoring[]> => {
  if (!supabase) {
    return DEMO_OPTIONS.filter((opt) => opt.item_id === itemId);
  }

  const { data, error } = await supabase
    .from("v_item_options_with_scoring")
    .select("*")
    .eq("item_id", itemId)
    .order("display_order");

  if (error) {
    console.error("보기 조회 오류:", error);
    throw error;
  }

  return data || [];
};

// 루브릭 상세 조회
export const fetchRubricDetail = async (
  itemId: number,
): Promise<RubricDetail | null> => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("v_rubric_details")
    .select("*")
    .eq("item_id", itemId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("루브릭 조회 오류:", error);
    throw error;
  }

  return data;
};

// 루브릭 기준/수준 조회
export const fetchRubricCriteriaLevels = async (
  rubricId: number,
): Promise<RubricCriteriaLevel[]> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("v_rubric_criteria_levels")
    .select("*")
    .eq("rubric_id", rubricId)
    .order("criterion_order")
    .order("level_value", { ascending: false });

  if (error) {
    console.error("루브릭 기준 조회 오류:", error);
    throw error;
  }

  return data || [];
};

// 정답 키 조회
export const fetchItemAnswerKey = async (
  itemId: number,
): Promise<ItemAnswerKey | null> => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("v_item_answer_keys")
    .select("*")
    .eq("item_id", itemId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("정답 키 조회 오류:", error);
    throw error;
  }

  return data;
};

// 문항 영역 매핑 조회
export const fetchItemDomains = async (
  itemId: number,
): Promise<ItemDomain[]> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("v_item_domains")
    .select("*")
    .eq("item_id", itemId)
    .order("primary_flag", { ascending: false })
    .order("weight", { ascending: false });

  if (error) {
    console.error("영역 매핑 조회 오류:", error);
    throw error;
  }

  return data || [];
};

// 기출문항 통계 조회
export const fetchPastExamStatistics = async (): Promise<
  PastExamStatistics[]
> => {
  if (!supabase) return DEMO_STATISTICS;

  const { data, error } = await supabase
    .from("v_past_exam_statistics")
    .select("*");

  if (error) {
    console.error("통계 조회 오류:", error);
    throw error;
  }

  return data || [];
};

// 지문별 문항 그룹 조회
export const fetchItemsByStimulus = async (
  stimulusId: number,
): Promise<PastExamItem[]> => {
  if (!supabase) {
    return DEMO_ITEMS.filter((item) => item.stimulus_id === stimulusId);
  }

  const { data, error } = await supabase
    .from("v_past_exam_items")
    .select("*")
    .eq("stimulus_id", stimulusId)
    .order("item_code");

  if (error) {
    console.error("지문별 문항 조회 오류:", error);
    throw error;
  }

  return data || [];
};

// 특정 학년군의 지문 목록 조회 (중복 제거)
export const fetchStimuliByGradeBand = async (
  gradeBand: string,
): Promise<
  Array<{ stimulus_id: number; stimulus_title: string; item_count: number }>
> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("v_past_exam_items")
    .select("stimulus_id, stimulus_title")
    .eq("grade_band", gradeBand)
    .not("stimulus_id", "is", null);

  if (error) {
    console.error("지문 목록 조회 오류:", error);
    throw error;
  }

  // 중복 제거 및 문항 수 계산
  const stimulusMap = new Map<number, { title: string; count: number }>();
  data?.forEach((item) => {
    if (item.stimulus_id) {
      const existing = stimulusMap.get(item.stimulus_id);
      if (existing) {
        existing.count++;
      } else {
        stimulusMap.set(item.stimulus_id, {
          title: item.stimulus_title || "제목 없음",
          count: 1,
        });
      }
    }
  });

  return Array.from(stimulusMap.entries()).map(([id, info]) => ({
    stimulus_id: id,
    stimulus_title: info.title,
    item_count: info.count,
  }));
};

// 기출문항 전체 데이터 조회 (문항 + 보기 + 루브릭 통합)
export const fetchPastExamItemComplete = async (itemId: number) => {
  const [item, options, rubric, answerKey, domains] = await Promise.all([
    fetchPastExamItem(itemId),
    fetchItemOptionsWithScoring(itemId),
    fetchRubricDetail(itemId),
    fetchItemAnswerKey(itemId),
    fetchItemDomains(itemId),
  ]);

  let rubricCriteria: RubricCriteriaLevel[] = [];
  if (rubric?.rubric_id) {
    rubricCriteria = await fetchRubricCriteriaLevels(rubric.rubric_id);
  }

  return {
    item,
    options,
    rubric,
    rubricCriteria,
    answerKey,
    domains,
  };
};
