/**
 * OpenAI API Service for Item Generation
 * 문항 초안 생성을 위한 OpenAI API 서비스
 */

export interface GenerateItemsRequest {
  stimulusText: string;
  stimulusTitle: string;
  itemType: string;
  gradeBand: string;
  difficulty: number;
  count: number;
  numOptions?: number; // 객관식 보기 개수 (기본값: 5)
  promptTemplate?: string;
  customPrompt?: string;
}

export interface GeneratedItem {
  stem: string;
  item_type: string;
  options?: { text: string; is_correct: boolean }[];
  explanation?: string;
  rubric?: {
    criteria: {
      name: string;
      weight: number;
      levels: string[];
      descriptions?: string[];
    }[];
  };
  keywords?: string[];
  answer_hint?: string;
}

export interface GenerateItemsResponse {
  success: boolean;
  items: GeneratedItem[];
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 학년군별 설명
const gradeBandDescriptions: Record<string, string> = {
  초저: "초등학교 1-2학년 수준으로, 쉬운 어휘와 짧은 문장을 사용합니다.",
  초고: "초등학교 3-6학년 수준으로, 다양한 어휘와 복잡한 문장 구조를 사용할 수 있습니다.",
  중저: "중학교 1-2학년 수준으로, 추상적 개념과 논리적 사고를 요구할 수 있습니다.",
  중고: "중학교 3학년-고등학교 1학년 수준으로, 고차원적 사고와 비판적 분석을 요구합니다.",
};

// 문항 유형별 설명 (동적으로 생성)
const getItemTypeDescription = (itemType: string, numOptions?: number): string => {
  const optionsText = numOptions ? `${numOptions}개 선택지` : "5개 선택지";
  const descriptions: Record<string, string> = {
    mcq_single: `단일 정답 선택형 객관식 문항 (${optionsText} 중 1개 정답)`,
    mcq_multi: `복수 정답 선택형 객관식 문항 (${optionsText}, 여러 개 정답 가능)`,
    short_text: "단답형 문항 (1-2문장 이내의 짧은 답변)",
    essay: "서술형 문항 (3-5문장 이상의 논리적 서술 요구)",
    fill_blank: "빈칸 채우기 문항 (지문 내 핵심 어휘나 개념 완성)",
    composite: "복합문항 (여러 하위 문항으로 구성)",
  };
  return descriptions[itemType] || itemType;
};

// 난이도별 설명
const difficultyDescriptions: Record<number, string> = {
  1: "매우 쉬움 - 지문에서 직접적으로 찾을 수 있는 사실적 정보 확인",
  2: "쉬움 - 지문의 주요 내용을 파악하고 간단한 관계 이해",
  3: "보통 - 지문 내용을 바탕으로 추론하거나 정보 통합",
  4: "어려움 - 비판적 분석, 평가, 복잡한 추론 요구",
  5: "매우 어려움 - 고차원적 사고, 창의적 적용, 종합적 평가",
};

/**
 * 문항 생성 시스템 프롬프트
 */
const getSystemPrompt = (request: GenerateItemsRequest): string => {
  const numOptions = request.numOptions || 5;
  const isMCQ = request.itemType.startsWith("mcq");

  return `당신은 한국어 독서 평가 문항을 제작하는 전문가입니다.
다음 지침을 철저히 따라 고품질의 평가 문항을 생성해주세요.

## 문항 제작 핵심 원칙
1. **지문과 문항의 분리**: 지문 내용을 문항에 그대로 반복하지 마세요.
2. **명확한 발문**: 무엇을 물어보는지 모호함 없이 명확하게 작성하세요.
3. **적절한 난이도**: ${difficultyDescriptions[request.difficulty] || "보통 수준"}
4. **학년군 적합성**: ${gradeBandDescriptions[request.gradeBand] || "적절한 수준"}
5. **문항 유형 준수**: ${getItemTypeDescription(request.itemType, request.numOptions)}

## 객관식 문항 작성 시 주의사항
${isMCQ ? `- **정확히 ${numOptions}개의 선택지를 생성**하세요.` : ""}
- 선택지는 동질적이고 유사한 길이를 유지하세요.
- 명확한 오답과 매력적인 오답(오개념 기반)을 적절히 배치하세요.
- "모두 정답" 또는 "정답 없음" 선택지는 피하세요.
- 부정적 표현("~이 아닌 것")은 강조 표시하세요.
- **정답은 반드시 1개만 is_correct: true로 설정**하고, 나머지는 모두 is_correct: false로 설정하세요.

## 서술형 문항 작성 시 주의사항
- 답안의 핵심 요소를 명확히 하세요.
- 채점 기준(루브릭)을 함께 제시하세요.
- 부분점수 부여가 가능한 구조로 작성하세요.

## 응답 형식
반드시 다음 JSON 형식으로 응답하세요:
{
  "items": [
    {
      "stem": "문항 발문 (질문)",
      "item_type": "${request.itemType}",
      "options": [  // 객관식인 경우만
        { "text": "선택지 텍스트", "is_correct": false },
        { "text": "정답 선택지", "is_correct": true },
        ...
      ],
      "explanation": "정답 해설 및 오답 해설",
      "keywords": ["핵심", "키워드"],  // 단답형인 경우
      "answer_hint": "예시 답안",  // 서술형인 경우
      "rubric": {  // 서술형인 경우
        "criteria": [
          {
            "name": "평가 기준명",
            "weight": 40,
            "levels": ["불충분", "기초", "보통", "우수", "탁월"],
            "descriptions": ["각 수준별 설명"]
          }
        ]
      }
    }
  ]
}`;
};

/**
 * 문항 생성 사용자 프롬프트
 */
const getUserPrompt = (request: GenerateItemsRequest): string => {
  const customInstruction = request.customPrompt
    ? `\n추가 요청사항: ${request.customPrompt}`
    : "";

  const numOptions = request.numOptions || 5;
  const optionsInfo = request.itemType.startsWith("mcq")
    ? `\n- 객관식 보기 개수: ${numOptions}개 (정답 1개 포함)`
    : "";

  return `## 지문 정보
제목: ${request.stimulusTitle}
내용:
${request.stimulusText}

## 생성 요청
- 문항 유형: ${getItemTypeDescription(request.itemType, request.numOptions)}
- 학년군: ${gradeBandDescriptions[request.gradeBand] || request.gradeBand}
- 난이도: ${request.difficulty}/5 (${difficultyDescriptions[request.difficulty] || ""})
- 생성 개수: ${request.count}개${optionsInfo}
${customInstruction}

위 지문을 바탕으로 ${request.count}개의 ${getItemTypeDescription(request.itemType, request.numOptions)} 문항을 JSON 형식으로 생성해주세요.
${request.itemType.startsWith("mcq") ? `\n중요: 각 문항은 정확히 ${numOptions}개의 선택지를 포함해야 하며, 그 중 정답은 반드시 1개만 is_correct: true로 설정되어야 합니다.` : ""}`;
};

/**
 * OpenAI API를 통한 문항 생성
 */
export const generateItems = async (
  request: GenerateItemsRequest
): Promise<GenerateItemsResponse> => {
  // 환경 변수에서 API 키 가져오기
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    // API 키가 없으면 시뮬레이션 모드로 동작
    console.warn("OpenAI API key not found. Running in simulation mode.");
    return simulateGeneration(request);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: getSystemPrompt(request),
          },
          {
            role: "user",
            content: getUserPrompt(request),
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API 요청 실패");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("응답 내용이 없습니다.");
    }

    const parsed = JSON.parse(content);

    return {
      success: true,
      items: parsed.items || [],
      usage: data.usage,
    };
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return {
      success: false,
      items: [],
      error: error.message || "문항 생성에 실패했습니다.",
    };
  }
};

/**
 * 시뮬레이션 모드 - API 키가 없을 때 테스트용
 */
const simulateGeneration = async (
  request: GenerateItemsRequest
): Promise<GenerateItemsResponse> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

  const items: GeneratedItem[] = [];
  const numOptions = request.numOptions || 5;

  for (let i = 0; i < request.count; i++) {
    if (request.itemType === "mcq_single" || request.itemType === "mcq_multi") {
      // 지정된 개수만큼 선택지 생성
      const options = [];
      const correctIndex = Math.floor(Math.random() * numOptions); // 랜덤 위치에 정답 배치

      for (let j = 0; j < numOptions; j++) {
        if (j === correctIndex) {
          options.push({
            text: "지문의 핵심 내용과 관련된 정답 선택지입니다.",
            is_correct: true
          });
        } else {
          const distractorTypes = [
            "그럴듯하지만 지문과 맞지 않는 오답 선택지입니다.",
            "일반적인 오개념을 기반으로 한 오답입니다.",
            "지문의 세부 내용을 왜곡한 오답입니다.",
            "부분적으로만 맞는 불완전한 오답입니다.",
            "관련 없는 내용으로 혼란을 주는 오답입니다."
          ];
          options.push({
            text: distractorTypes[j % distractorTypes.length],
            is_correct: false
          });
        }
      }

      items.push({
        stem: `[AI 생성 ${i + 1}] "${request.stimulusTitle}"의 내용을 바탕으로, 다음 중 올바른 것을 고르시오.`,
        item_type: request.itemType,
        options,
        explanation: `정답은 ${correctIndex + 1}번입니다. 지문에서 해당 내용을 명시적으로 언급하고 있습니다.`,
      });
    } else if (request.itemType === "short_text") {
      items.push({
        stem: `[AI 생성 ${i + 1}] "${request.stimulusTitle}"에서 언급된 핵심 개념을 한 단어로 쓰시오.`,
        item_type: request.itemType,
        keywords: ["핵심개념", "키워드"],
        explanation: "지문에서 반복적으로 강조된 핵심 개념입니다.",
      });
    } else if (request.itemType === "essay") {
      items.push({
        stem: `[AI 생성 ${i + 1}] "${request.stimulusTitle}"의 주제와 관련하여 자신의 생각을 논리적으로 서술하시오.`,
        item_type: request.itemType,
        answer_hint: "지문의 주제를 파악하고, 자신의 경험이나 지식과 연결하여 논리적으로 서술합니다.",
        rubric: {
          criteria: [
            {
              name: "내용 이해",
              weight: 40,
              levels: ["불충분", "기초", "보통", "우수", "탁월"],
              descriptions: [
                "지문 내용을 이해하지 못함",
                "지문 내용을 부분적으로 이해",
                "지문의 핵심 내용을 이해",
                "지문 내용을 정확히 이해하고 적용",
                "지문 내용을 심층적으로 분석",
              ],
            },
            {
              name: "논리적 전개",
              weight: 30,
              levels: ["불충분", "기초", "보통", "우수", "탁월"],
              descriptions: [
                "논리적 연결이 없음",
                "단편적인 서술",
                "기본적인 논리 구조 갖춤",
                "명확한 논리적 흐름",
                "정교하고 설득력 있는 논리",
              ],
            },
            {
              name: "표현력",
              weight: 30,
              levels: ["불충분", "기초", "보통", "우수", "탁월"],
              descriptions: [
                "문장 구성이 부적절",
                "기본적인 문장 구성",
                "적절한 어휘 사용",
                "다양하고 정확한 표현",
                "창의적이고 풍부한 표현",
              ],
            },
          ],
        },
        explanation: "답안은 지문의 핵심 내용을 정확히 파악하고, 이를 자신의 생각과 연결하여 논리적으로 서술해야 합니다.",
      });
    } else if (request.itemType === "fill_blank") {
      items.push({
        stem: `[AI 생성 ${i + 1}] 다음 빈칸에 들어갈 알맞은 말을 지문에서 찾아 쓰시오.\n"이 글에서 저자가 강조하는 것은 (     )이다."`,
        item_type: request.itemType,
        keywords: ["핵심개념"],
        explanation: "지문의 중심 내용을 파악하면 답을 찾을 수 있습니다.",
      });
    } else {
      items.push({
        stem: `[AI 생성 ${i + 1}] "${request.stimulusTitle}"에 관한 문항입니다.`,
        item_type: request.itemType,
        explanation: "이 문항에 대한 해설입니다.",
      });
    }
  }

  return {
    success: true,
    items,
    usage: {
      prompt_tokens: 500,
      completion_tokens: 300,
      total_tokens: 800,
    },
  };
};

/**
 * 문항 품질 검증
 */
export const validateGeneratedItem = (item: GeneratedItem): string[] => {
  const errors: string[] = [];

  // 발문 검증
  if (!item.stem || item.stem.trim().length < 10) {
    errors.push("발문은 최소 10자 이상이어야 합니다.");
  }

  // 객관식 검증
  if (item.item_type.startsWith("mcq")) {
    if (!item.options || item.options.length < 2) {
      errors.push("객관식 문항은 최소 2개 이상의 선택지가 필요합니다.");
    }

    if (item.options && !item.options.some((o) => o.is_correct)) {
      errors.push("정답이 지정되지 않았습니다.");
    }

    if (item.options && item.options.filter((o) => o.is_correct).length > 1 && item.item_type === "mcq_single") {
      errors.push("단일 선택 문항에 정답이 2개 이상입니다.");
    }

    // 선택지 길이 균형 검증
    if (item.options && item.options.length >= 4) {
      const lengths = item.options.map((o) => o.text.length);
      const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const maxDeviation = Math.max(...lengths.map((l) => Math.abs(l - avgLength)));
      if (maxDeviation > avgLength * 0.5) {
        errors.push("선택지 길이가 불균형합니다. 유사한 길이로 조정하세요.");
      }
    }
  }

  // 서술형 검증
  if (item.item_type === "essay") {
    if (!item.rubric || !item.rubric.criteria || item.rubric.criteria.length === 0) {
      errors.push("서술형 문항에는 채점 기준(루브릭)이 필요합니다.");
    }
  }

  // 단답형 검증
  if (item.item_type === "short_text") {
    if (!item.keywords || item.keywords.length === 0) {
      errors.push("단답형 문항에는 정답 키워드가 필요합니다.");
    }
  }

  return errors;
};

export default {
  generateItems,
  validateGeneratedItem,
};
