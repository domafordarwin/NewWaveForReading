/**
 * 문항 제작 관련 상수 설정
 */

// 문항 유형 옵션 (DB 스키마의 item_kind에 맞춤)
export const itemTypeOptions = [
  { value: "mcq", label: "객관식" },
  { value: "essay", label: "서술형" },
  { value: "composite", label: "복합문항" },
  { value: "survey", label: "설문" },
];

// 상태 설정 (DB 스키마의 status에 맞춤)
export const statusConfig: Record<
  string,
  {
    label: string;
    color: "default" | "primary" | "success" | "warning" | "error";
  }
> = {
  ai_draft: { label: "AI 초안", color: "default" },
  editing: { label: "편집 중", color: "warning" },
  in_review: { label: "검토 중", color: "primary" },
  approved: { label: "승인됨", color: "success" },
  rejected: { label: "반려됨", color: "error" },
};

// 학년군 라벨
export const gradeBandLabels: Record<string, string> = {
  초저: "초등 저학년",
  초고: "초등 고학년",
  중저: "중등 저학년",
  중고: "중등 고학년",
};

// 루브릭 템플릿
export const rubricTemplates = [
  {
    id: "essay_basic",
    name: "서술형 기본 루브릭",
    itemType: "essay",
    criteria: [
      {
        name: "내용 이해",
        weight: 40,
        levels: ["불충분", "기초", "보통", "우수", "탁월"],
      },
      {
        name: "논리적 전개",
        weight: 30,
        levels: ["불충분", "기초", "보통", "우수", "탁월"],
      },
      {
        name: "표현력",
        weight: 30,
        levels: ["불충분", "기초", "보통", "우수", "탁월"],
      },
    ],
  },
  {
    id: "short_answer",
    name: "단답형 기본 루브릭",
    itemType: "short_text",
    criteria: [
      { name: "정확성", weight: 70, levels: ["오답", "부분 정답", "정답"] },
      { name: "표현", weight: 30, levels: ["부적절", "적절"] },
    ],
  },
];
