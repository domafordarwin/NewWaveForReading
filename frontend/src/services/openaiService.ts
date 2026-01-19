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

export interface RubricCriterion {
  area: string;           // 평가 영역 (예: 내용 이해, 논리적 전개, 표현력)
  weight: number;         // 반영 비율 (%) (예: 40)
  high: string;           // 상 수준 설명
  middle: string;         // 중 수준 설명
  low: string;            // 하 수준 설명
}

export interface GeneratedItem {
  stem: string;
  item_type: string;
  options?: { text: string; is_correct: boolean }[];
  explanation?: string;
  rubric?: RubricCriterion[]; // 서술형 문항의 평가 루브릭 (구조화된 형태)
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
const getItemTypeDescription = (
  itemType: string,
  numOptions?: number,
): string => {
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
  const itemType = request.itemType || "mcq_single";
  const isMCQ = itemType.startsWith("mcq");

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
- **반드시 평가 루브릭(rubric)을 생성**하세요.
- 루브릭은 2-3개의 평가 영역으로 구성하되, 각 영역마다 반영 비율과 상/중/하 수준을 명확히 제시하세요.
- 평가 기준은 해당 문항의 평가 영역과 지문의 특성을 반영해야 합니다.
- 상/중/하 각 수준은 20-30자 이내로 간결하게 작성하세요.

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
      "rubric": [  // 서술형인 경우 반드시 포함
        {
          "area": "내용 이해",
          "weight": 40,
          "high": "지문의 핵심 주제를 정확히 파악하고 심층적으로 설명함",
          "middle": "지문의 주요 내용을 파악하고 기본적으로 설명함",
          "low": "지문 내용의 이해가 부족하거나 부정확함"
        },
        {
          "area": "논리적 전개",
          "weight": 30,
          "high": "주장과 근거가 명확하고 논리적으로 연결됨",
          "middle": "주장과 근거가 있으나 연결이 다소 부족함",
          "low": "논리적 흐름이 부족하거나 주장이 불명확함"
        },
        {
          "area": "표현력",
          "weight": 30,
          "high": "정확하고 다양한 어휘로 명료하게 표현함",
          "middle": "기본적인 어휘로 의미를 전달함",
          "low": "표현이 부적절하거나 의미 전달이 어려움"
        }
      ]
    }
  ]
}`;
};

/**
 * 문항 생성 사용자 프롬프트
 */
const getUserPrompt = (request: GenerateItemsRequest): string => {
  console.log("=== OpenAI Service - 지문 정보 ===");
  console.log("지문 전달 받은 길이:", request.stimulusText.length);
  console.log("지문 처음 100자:", request.stimulusText.substring(0, 100));

  const customInstruction = request.customPrompt
    ? `\n추가 요청사항: ${request.customPrompt}`
    : "";

  const numOptions = request.numOptions || 5;
  const itemType = request.itemType || "mcq_single";
  const optionsInfo = itemType.startsWith("mcq")
    ? `\n- 객관식 보기 개수: ${numOptions}개 (정답 1개 포함)`
    : "";

  return `## 지문 정보
제목: ${request.stimulusTitle}
내용:
${request.stimulusText}

## 생성 요청
- 문항 유형: ${getItemTypeDescription(itemType, request.numOptions)}
- 학년군: ${gradeBandDescriptions[request.gradeBand] || request.gradeBand}
- 난이도: ${request.difficulty}/5 (${difficultyDescriptions[request.difficulty] || ""})
- 생성 개수: ${request.count}개${optionsInfo}
${customInstruction}

위 지문을 바탕으로 ${request.count}개의 ${getItemTypeDescription(itemType, request.numOptions)} 문항을 JSON 형식으로 생성해주세요.
${itemType.startsWith("mcq") ? `\n중요: 각 문항은 정확히 ${numOptions}개의 선택지를 포함해야 하며, 그 중 정답은 반드시 1개만 is_correct: true로 설정되어야 합니다.` : ""}
${itemType === "essay" ? `\n중요: 서술형 문항의 경우 반드시 rubric 필드에 평가 루브릭을 배열 형태로 작성해주세요. 각 평가 영역(area)마다 반영 비율(weight)과 상/중/하 수준(high/middle/low)을 명확히 제시하세요. 2-3개의 평가 영역을 포함하고, 각 수준 설명은 20-30자 이내로 간결하게 작성하세요.` : ""}`;
};

/**
 * OpenAI API를 통한 문항 생성
 */
export const generateItems = async (
  request: GenerateItemsRequest,
): Promise<GenerateItemsResponse> => {
  // 환경 변수에서 API 키 가져오기
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    // API 키가 없으면 시뮬레이션 모드로 동작 (정상 - 데모용)
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
  request: GenerateItemsRequest,
): Promise<GenerateItemsResponse> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 1000),
  );

  const items: GeneratedItem[] = [];
  const numOptions = request.numOptions || 5;
  const itemType = request.itemType || "mcq_single";

  for (let i = 0; i < request.count; i++) {
    if (itemType === "mcq_single" || itemType === "mcq_multi") {
      // 지정된 개수만큼 선택지 생성
      const options = [];
      const correctIndex = Math.floor(Math.random() * numOptions); // 랜덤 위치에 정답 배치

      for (let j = 0; j < numOptions; j++) {
        if (j === correctIndex) {
          options.push({
            text: "지문의 핵심 내용과 관련된 정답 선택지입니다.",
            is_correct: true,
          });
        } else {
          const distractorTypes = [
            "그럴듯하지만 지문과 맞지 않는 오답 선택지입니다.",
            "일반적인 오개념을 기반으로 한 오답입니다.",
            "지문의 세부 내용을 왜곡한 오답입니다.",
            "부분적으로만 맞는 불완전한 오답입니다.",
            "관련 없는 내용으로 혼란을 주는 오답입니다.",
          ];
          options.push({
            text: distractorTypes[j % distractorTypes.length],
            is_correct: false,
          });
        }
      }

      items.push({
        stem: `[AI 생성 ${i + 1}] "${request.stimulusTitle}"의 내용을 바탕으로, 다음 중 올바른 것을 고르시오.`,
        item_type: itemType,
        options,
        explanation: `정답은 ${correctIndex + 1}번입니다. 지문에서 해당 내용을 명시적으로 언급하고 있습니다.`,
      });
    } else if (itemType === "short_text") {
      items.push({
        stem: `[AI 생성 ${i + 1}] "${request.stimulusTitle}"에서 언급된 핵심 개념을 한 단어로 쓰시오.`,
        item_type: itemType,
        keywords: ["핵심개념", "키워드"],
        explanation: "지문에서 반복적으로 강조된 핵심 개념입니다.",
      });
    } else if (itemType === "essay") {
      // 평가 영역에 따라 다른 루브릭 생성 (예시)
      const rubricExamples = [
        [
          { area: "내용 이해", weight: 40, high: "지문의 핵심 주제를 정확히 파악하고 심층적으로 설명함", middle: "지문의 주요 내용을 파악하고 기본적으로 설명함", low: "지문 내용의 이해가 부족하거나 부정확함" },
          { area: "논리적 전개", weight: 30, high: "주장과 근거가 명확하고 논리적으로 연결됨", middle: "주장과 근거가 있으나 연결이 다소 부족함", low: "논리적 흐름이 부족하거나 주장이 불명확함" },
          { area: "표현력", weight: 30, high: "정확하고 다양한 어휘로 명료하게 표현함", middle: "기본적인 어휘로 의미를 전달함", low: "표현이 부적절하거나 의미 전달이 어려움" },
        ],
        [
          { area: "사실 파악", weight: 35, high: "지문의 정보를 정확하고 완전하게 파악함", middle: "지문의 주요 정보를 대체로 파악함", low: "사실 파악이 부족하거나 오류가 있음" },
          { area: "추론 능력", weight: 35, high: "제시된 정보를 바탕으로 타당한 추론을 제시함", middle: "기본적인 추론을 하나 근거가 다소 부족함", low: "추론이 부족하거나 논리적 비약이 있음" },
          { area: "표현 정확성", weight: 30, high: "문법과 어휘를 정확하게 사용함", middle: "의미 전달에 큰 문제는 없으나 일부 오류 있음", low: "문법·어휘 오류로 의미 전달이 어려움" },
        ],
        [
          { area: "비판적 사고", weight: 40, high: "지문 내용을 다각도로 분석하고 비판적으로 평가함", middle: "지문에 대한 기본적인 비판적 관점을 제시함", low: "비판적 분석이 부족하거나 피상적임" },
          { area: "창의성", weight: 30, high: "독창적이고 참신한 관점이나 해석을 제시함", middle: "나름의 관점을 제시하나 독창성은 다소 부족함", low: "일반적이거나 지문의 반복에 그침" },
          { area: "논리성", weight: 30, high: "주장이 명확하고 논리적으로 타당함", middle: "주장은 있으나 논리적 연결이 다소 약함", low: "주장이 불명확하거나 논리적 오류가 있음" },
        ],
      ];

      items.push({
        stem: `[AI 생성 ${i + 1}] "${request.stimulusTitle}"의 주제와 관련하여 자신의 생각을 논리적으로 서술하시오.`,
        item_type: itemType,
        answer_hint:
          "지문의 주제를 파악하고, 자신의 경험이나 지식과 연결하여 논리적으로 서술합니다.",
        rubric: rubricExamples[i % rubricExamples.length],
        explanation: "서술형 문항은 채점 루브릭에 따라 평가됩니다. 내용의 정확성, 논리적 전개, 표현력을 고루 갖춘 답안을 작성하세요.",
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
  if (item.item_type?.startsWith("mcq")) {
    if (!item.options || item.options.length < 2) {
      errors.push("객관식 문항은 최소 2개 이상의 선택지가 필요합니다.");
    }

    if (item.options && !item.options.some((o) => o.is_correct)) {
      errors.push("정답이 지정되지 않았습니다.");
    }

    if (
      item.options &&
      item.options.filter((o) => o.is_correct).length > 1 &&
      item.item_type === "mcq_single"
    ) {
      errors.push("단일 선택 문항에 정답이 2개 이상입니다.");
    }

    // 선택지 길이 균형 검증
    if (item.options && item.options.length >= 4) {
      const lengths = item.options.map((o) => o.text.length);
      const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const maxDeviation = Math.max(
        ...lengths.map((l) => Math.abs(l - avgLength)),
      );
      if (maxDeviation > avgLength * 0.5) {
        errors.push("선택지 길이가 불균형합니다. 유사한 길이로 조정하세요.");
      }
    }
  }

  // 서술형 검증
  if (item.item_type === "essay") {
    if (!item.rubric || !Array.isArray(item.rubric) || item.rubric.length === 0) {
      errors.push("서술형 문항에는 채점 기준(루브릭)이 필요합니다.");
    } else {
      // 각 루브릭 항목 검증
      item.rubric.forEach((criterion, idx) => {
        if (!criterion.area || !criterion.area.trim()) {
          errors.push(`루브릭 ${idx + 1}번째 항목: 평가 영역이 누락되었습니다.`);
        }
        if (!criterion.weight || criterion.weight <= 0) {
          errors.push(`루브릭 ${idx + 1}번째 항목: 반영 비율이 잘못되었습니다.`);
        }
        if (!criterion.high || !criterion.middle || !criterion.low) {
          errors.push(`루브릭 ${idx + 1}번째 항목: 상/중/하 수준 설명이 누락되었습니다.`);
        }
      });

      // 반영 비율 합계 검증
      const totalWeight = item.rubric.reduce((sum, c) => sum + (c.weight || 0), 0);
      if (Math.abs(totalWeight - 100) > 1) {
        errors.push(`루브릭 반영 비율의 합이 ${totalWeight}%입니다. 100%가 되어야 합니다.`);
      }
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
