/**
 * AI Feedback Service - OpenAI를 활용한 동적 피드백 생성
 * 학생 답안에 대한 AI 분석 및 피드백 생성
 */

// OpenAI API 호출 함수
const callOpenAI = async (
  messages: Array<{ role: string; content: string }>,
  responseFormat?: { type: string },
): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API 키가 설정되지 않았습니다.");
  }

  const body: Record<string, unknown> = {
    model: "gpt-4o-mini",
    messages,
    max_tokens: 4000,
  };

  if (responseFormat) {
    body.response_format = responseFormat;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `OpenAI API 오류: ${errorData.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// 평가 결과 인터페이스
export interface AIEvaluationResult {
  // 영역별 점수 (각 25점 만점)
  comprehensionScore: number; // 이해력
  inferenceScore: number; // 추론력
  criticalScore: number; // 비판적 사고
  expressionScore: number; // 표현력
  totalScore: number;

  // 등급
  gradeLevel: "A" | "B" | "C" | "D";

  // 루브릭별 상세 점수
  rubricScores: RubricScore[];

  // 강점 및 약점
  strengths: string[];
  weaknesses: string[];

  // 학생용 피드백
  studentFeedback: {
    intro: string; // 서론 피드백
    body: string; // 본론 피드백
    conclusion: string; // 결론 피드백
    overall: string; // 종합 피드백
  };

  // 문장별 첨삭
  lineEdits: LineEdit[];

  // 오류 분석
  spellingErrors: number;
  grammarErrors: number;
}

export interface RubricScore {
  criterion: string;
  level: "상" | "중" | "하";
  score: number;
  maxScore: number;
  evidence: string;
  nextAction: string;
}

export interface LineEdit {
  original: string;
  suggested: string;
  reason: string;
  category: "spelling" | "grammar" | "expression" | "logic";
}

// 등급 계산
const calculateGrade = (totalScore: number): "A" | "B" | "C" | "D" => {
  if (totalScore >= 85) return "A";
  if (totalScore >= 70) return "B";
  if (totalScore >= 55) return "C";
  return "D";
};

/**
 * 학생 답안에 대한 AI 평가 및 피드백 생성
 */
export async function generateAIFeedback(params: {
  answerContent: string;
  stimulusTitle: string;
  stimulusContent: string;
  gradeBand: string;
  studentName?: string;
}): Promise<AIEvaluationResult> {
  const {
    answerContent,
    stimulusTitle,
    stimulusContent,
    gradeBand,
    studentName,
  } = params;

  const systemPrompt = `당신은 초중등 학생의 독서 감상문과 논술을 전문적으로 평가하는 교육 전문가입니다.
학생의 답안을 분석하여 구체적이고 교육적인 피드백을 제공해주세요.

평가 기준:
1. 이해력 (25점): 지문의 내용을 정확하게 이해했는가
2. 추론력 (25점): 글에서 직접 드러나지 않은 의미를 추론할 수 있는가
3. 비판적 사고 (25점): 자신의 관점에서 비평하고 평가할 수 있는가
4. 표현력 (25점): 문장이 명확하고 논리적으로 전개되는가

학년군: ${gradeBand}
학생 수준에 맞는 눈높이로 피드백을 작성해주세요.`;

  const userPrompt = `
지문 제목: ${stimulusTitle}
지문 내용: ${stimulusContent.substring(0, 2000)}...

학생 답안:
${answerContent}

위 답안을 평가하여 다음 JSON 형식으로 응답해주세요:
{
  "comprehensionScore": 0-25 사이 점수,
  "inferenceScore": 0-25 사이 점수,
  "criticalScore": 0-25 사이 점수,
  "expressionScore": 0-25 사이 점수,
  "rubricScores": [
    {
      "criterion": "평가 기준명",
      "level": "상/중/하",
      "score": 점수,
      "maxScore": 최대점수,
      "evidence": "근거 설명",
      "nextAction": "개선 방향"
    }
  ],
  "strengths": ["강점1", "강점2"],
  "weaknesses": ["약점1", "약점2"],
  "studentFeedback": {
    "intro": "서론에 대한 피드백 (2-3문장)",
    "body": "본론에 대한 피드백 (2-3문장)",
    "conclusion": "결론에 대한 피드백 (2-3문장)",
    "overall": "전체적인 격려와 개선 방향 (3-4문장)"
  },
  "lineEdits": [
    {
      "original": "원문 문장",
      "suggested": "수정 제안",
      "reason": "수정 이유",
      "category": "spelling/grammar/expression/logic"
    }
  ],
  "spellingErrors": 맞춤법 오류 수,
  "grammarErrors": 문법 오류 수
}

${studentName ? `학생 이름(${studentName})을 피드백에 자연스럽게 사용해주세요.` : ""}
반드시 JSON 형식으로만 응답해주세요.`;

  try {
    const content = await callOpenAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { type: "json_object" },
    );

    if (!content) {
      throw new Error("AI 응답이 비어있습니다.");
    }

    const parsed = JSON.parse(content);

    // 총점 계산
    const totalScore =
      (parsed.comprehensionScore || 0) +
      (parsed.inferenceScore || 0) +
      (parsed.criticalScore || 0) +
      (parsed.expressionScore || 0);

    return {
      comprehensionScore: parsed.comprehensionScore || 0,
      inferenceScore: parsed.inferenceScore || 0,
      criticalScore: parsed.criticalScore || 0,
      expressionScore: parsed.expressionScore || 0,
      totalScore,
      gradeLevel: calculateGrade(totalScore),
      rubricScores: parsed.rubricScores || [],
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      studentFeedback: {
        intro: parsed.studentFeedback?.intro || "",
        body: parsed.studentFeedback?.body || "",
        conclusion: parsed.studentFeedback?.conclusion || "",
        overall: parsed.studentFeedback?.overall || "",
      },
      lineEdits: parsed.lineEdits || [],
      spellingErrors: parsed.spellingErrors || 0,
      grammarErrors: parsed.grammarErrors || 0,
    };
  } catch (error) {
    console.error("AI 평가 생성 실패:", error);
    throw error;
  }
}

/**
 * 학부모용 요약 리포트 생성
 */
export async function generateParentReport(params: {
  studentName: string;
  evaluations: AIEvaluationResult[];
  gradeBand: string;
}): Promise<{
  summary: string;
  progressAnalysis: string;
  recommendations: string[];
  homeSupport: string[];
}> {
  const { studentName, evaluations, gradeBand } = params;

  // 최근 평가 통계
  const avgScore =
    evaluations.length > 0
      ? evaluations.reduce((sum, e) => sum + e.totalScore, 0) /
        evaluations.length
      : 0;

  const latestGrade = evaluations[0]?.gradeLevel || "N/A";

  const systemPrompt = `당신은 학부모에게 자녀의 학습 현황을 설명하는 교육 상담 전문가입니다.
학부모가 이해하기 쉽고, 자녀를 격려할 수 있는 내용으로 작성해주세요.`;

  const userPrompt = `
학생 정보:
- 이름: ${studentName}
- 학년군: ${gradeBand}
- 최근 평균 점수: ${avgScore.toFixed(1)}점
- 현재 등급: ${latestGrade}
- 총 평가 횟수: ${evaluations.length}회

최근 평가 결과 요약:
${evaluations
  .slice(0, 3)
  .map(
    (e, i) => `
${i + 1}회차:
- 이해력: ${e.comprehensionScore}점, 추론력: ${e.inferenceScore}점
- 비판적 사고: ${e.criticalScore}점, 표현력: ${e.expressionScore}점
- 강점: ${e.strengths.join(", ")}
- 개선점: ${e.weaknesses.join(", ")}
`,
  )
  .join("\n")}

다음 JSON 형식으로 학부모용 리포트를 작성해주세요:
{
  "summary": "전체 학습 현황 요약 (3-4문장)",
  "progressAnalysis": "성장 추이 분석 (3-4문장)",
  "recommendations": ["교육적 권장 사항 1", "권장 사항 2", "권장 사항 3"],
  "homeSupport": ["가정에서 도울 수 있는 방법 1", "방법 2", "방법 3"]
}

반드시 JSON 형식으로만 응답해주세요.`;

  try {
    const content = await callOpenAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { type: "json_object" },
    );

    if (!content) {
      throw new Error("AI 응답이 비어있습니다.");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("학부모 리포트 생성 실패:", error);
    throw error;
  }
}

/**
 * 교사용 학급 분석 리포트 생성
 */
export async function generateClassAnalysis(params: {
  className: string;
  studentCount: number;
  evaluations: { studentName: string; result: AIEvaluationResult }[];
}): Promise<{
  classOverview: string;
  strengthAreas: string[];
  improvementAreas: string[];
  teachingRecommendations: string[];
  individualAttention: { studentName: string; note: string }[];
}> {
  const { className, studentCount, evaluations } = params;

  // 학급 평균 계산
  const avgScores = {
    comprehension:
      evaluations.reduce((sum, e) => sum + e.result.comprehensionScore, 0) /
      evaluations.length,
    inference:
      evaluations.reduce((sum, e) => sum + e.result.inferenceScore, 0) /
      evaluations.length,
    critical:
      evaluations.reduce((sum, e) => sum + e.result.criticalScore, 0) /
      evaluations.length,
    expression:
      evaluations.reduce((sum, e) => sum + e.result.expressionScore, 0) /
      evaluations.length,
  };

  const systemPrompt = `당신은 학급 단위의 독서 교육을 분석하는 교육 전문가입니다.
교사가 학급 운영에 활용할 수 있는 실질적인 분석과 제안을 제공해주세요.`;

  const userPrompt = `
학급 정보:
- 학급명: ${className}
- 학생 수: ${studentCount}명
- 평가 완료: ${evaluations.length}명

학급 평균 점수:
- 이해력: ${avgScores.comprehension.toFixed(1)}점
- 추론력: ${avgScores.inference.toFixed(1)}점
- 비판적 사고: ${avgScores.critical.toFixed(1)}점
- 표현력: ${avgScores.expression.toFixed(1)}점

학생별 결과 요약:
${evaluations
  .slice(0, 10)
  .map(
    (e) => `
- ${e.studentName}: 총점 ${e.result.totalScore}점 (${e.result.gradeLevel}등급)
  강점: ${e.result.strengths.slice(0, 2).join(", ")}
  약점: ${e.result.weaknesses.slice(0, 2).join(", ")}
`,
  )
  .join("\n")}

다음 JSON 형식으로 학급 분석 리포트를 작성해주세요:
{
  "classOverview": "학급 전체 현황 분석 (4-5문장)",
  "strengthAreas": ["학급의 강점 영역 1", "강점 2"],
  "improvementAreas": ["개선이 필요한 영역 1", "영역 2"],
  "teachingRecommendations": ["수업 개선 제안 1", "제안 2", "제안 3"],
  "individualAttention": [
    {"studentName": "특별 관심이 필요한 학생", "note": "관심 사항"}
  ]
}

반드시 JSON 형식으로만 응답해주세요.`;

  try {
    const content = await callOpenAI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { type: "json_object" },
    );

    if (!content) {
      throw new Error("AI 응답이 비어있습니다.");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("학급 분석 생성 실패:", error);
    throw error;
  }
}
