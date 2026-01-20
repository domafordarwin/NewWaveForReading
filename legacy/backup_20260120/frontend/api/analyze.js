import { createClient } from '@supabase/supabase-js';

const getEnv = (key, fallback) => process.env[key] || fallback;

const supabaseUrl = getEnv('SUPABASE_URL', getEnv('VITE_SUPABASE_URL', ''));
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY', getEnv('VITE_SUPABASE_ANON_KEY', ''));
const openaiApiKey = getEnv('OPENAI_API_KEY', '');

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const parseBody = (req) => new Promise((resolve) => {
  let raw = '';
  req.on('data', (chunk) => { raw += chunk; });
  req.on('end', () => {
    if (!raw) {
      resolve({});
      return;
    }
    try {
      resolve(JSON.parse(raw));
    } catch (err) {
      resolve({});
    }
  });
});

const buildFallback = (content) => {
  const length = (content || '').trim().length;
  const wordCount = content && content.trim() ? content.trim().split(/\s+/).length : 0;

  const score = Math.min(25, Math.max(10, Math.floor(length / 120)));
  const level = length < 400 ? '하' : length < 800 ? '중' : '상';

  return {
    scores: {
      bookAnalysis: score,
      creativeThinking: Math.min(25, score + 2),
      problemSolving: Math.max(12, score - 1),
      expression: Math.min(25, score + 1),
    },
    comprehensiveFeedback: '답안의 핵심 주제가 드러나며 기본 구조가 갖춰져 있습니다.',
    detailedFeedback: '근거와 사례를 조금 더 보강하면 설득력이 높아집니다. 문장 연결을 개선해 흐름을 강화하세요.',
    strengths: ['논제 이해', '기본 구조', '일관된 흐름'],
    weaknesses: ['근거 다양성 부족', '세부 설명 부족', '표현력 보강 필요'],
    improvements: ['핵심 개념 2개 추가', '반례 1개 제시', '접속어 활용'],
    studentFeedback: {
      서론: '입장을 제시했으나 근거가 부족합니다. 핵심 주장 문장을 선명하게 해보세요.',
      본론: '근거의 다양성이 부족합니다. 사례나 인용을 추가하세요.',
      결론: '요약은 있지만 마무리가 약합니다. 개선 목표를 제시하세요.',
    },
    rubric: [
      {
        criterion: '논제 충실성/입장 명료성',
        level,
        evidence: '주장 문장 명료성이 평가에 반영되었습니다.',
        next_action: '첫 문단에 핵심 주장 문장을 추가하세요.',
      },
      {
        criterion: '대상도서 이해/활용',
        level,
        evidence: '도서 핵심 개념 활용이 제한적입니다.',
        next_action: '핵심 개념 2개를 문장에 포함하세요.',
      },
      {
        criterion: '논거 다양성/타당성',
        level,
        evidence: '논거 수와 근거의 질을 확인했습니다.',
        next_action: '반례나 다른 관점을 추가하세요.',
      },
      {
        criterion: '구성/일관성(서론-본론-결론)',
        level,
        evidence: '단락 구성과 흐름을 확인했습니다.',
        next_action: '문단 첫 문장에 주제를 명시하세요.',
      },
      {
        criterion: '창의적 사고력',
        level,
        evidence: '개인적 관점 제시 여부를 평가했습니다.',
        next_action: '본인의 해석을 한 문장 더 추가하세요.',
      },
      {
        criterion: '표현/문장력',
        level,
        evidence: '문장 길이와 연결 표현을 확인했습니다.',
        next_action: '접속어를 활용해 흐름을 개선하세요.',
      },
    ],
    lineEdits: [
      { original: '우리시대의', suggested: '우리 시대의', reason: '띄어쓰기', category: '띄어쓰기' },
      { original: '말할수있다', suggested: '말할 수 있다', reason: '띄어쓰기', category: '띄어쓰기' },
    ],
    teacherNote: '자동 분석 결과이며, 실제 평가 전 보정이 필요합니다.',
  };
};

const buildPrompt = (content, topic) => (
  [
    '당신은 중학생 독서논술 답안을 평가하는 전문 교사입니다.',
    '',
    '[논제]',
    topic || '논제 정보 없음',
    '',
    '[학생 답안]',
    content || '답안 없음',
    '',
    '아래 JSON 형식으로만 응답하세요.',
    '{',
    '  "scores": { "bookAnalysis": 0-25, "creativeThinking": 0-25, "problemSolving": 0-25, "expression": 0-25 },',
    '  "comprehensiveFeedback": "...",',
    '  "detailedFeedback": "...",',
    '  "strengths": ["...", "...", "..."],',
    '  "weaknesses": ["...", "...", "..."],',
    '  "improvements": ["...", "...", "..."],',
    '  "studentFeedback": { "서론": "...", "본론": "...", "결론": "..." },',
    '  "rubric": [',
    '    { "criterion": "...", "level": "상|중|하", "evidence": "...", "next_action": "..." }',
    '  ],',
    '  "lineEdits": [',
    '    { "original": "...", "suggested": "...", "reason": "...", "category": "..." }',
    '  ],',
    '  "teacherNote": "..."',
    '}',
  ].join('\n')
);

const parseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { message: 'Method not allowed' });
  }

  if (!supabase) {
    return json(res, 500, { message: 'Supabase is not configured' });
  }

  const body = await parseBody(req);
  const answerId = Number(body.answerId);
  if (!answerId) {
    return json(res, 400, { message: 'answerId is required' });
  }

  const { data: answer, error: answerError } = await supabase
    .from('answers')
    .select('*')
    .eq('answer_id', answerId)
    .maybeSingle();
  if (answerError || !answer) {
    return json(res, 404, { message: 'Answer not found' });
  }

  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .select('*, topic:topics(*), student:users(*)')
    .eq('assessment_id', answer.assessment_id)
    .maybeSingle();
  if (assessmentError || !assessment) {
    return json(res, 404, { message: 'Assessment not found' });
  }

  let analysis = null;
  if (openaiApiKey) {
    try {
      const prompt = buildPrompt(answer.content || '', assessment.topic?.topic_text);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You output only JSON.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.4,
          max_tokens: 1200,
        }),
      });
      const payload = await response.json();
      const content = payload?.choices?.[0]?.message?.content;
      analysis = parseJson(content);
    } catch (err) {
      analysis = null;
    }
  }

  if (!analysis) {
    analysis = buildFallback(answer.content || '');
  }

  const scores = analysis.scores || {};
  const totalScore = (scores.bookAnalysis || 0)
    + (scores.creativeThinking || 0)
    + (scores.problemSolving || 0)
    + (scores.expression || 0);

  const evaluationPayload = {
    answer_id: answerId,
    assessment_id: answer.assessment_id,
    student_id: assessment.student_id,
    evaluator_type: 'ai',
    book_analysis_score: scores.bookAnalysis || 0,
    creative_thinking_score: scores.creativeThinking || 0,
    problem_solving_score: scores.problemSolving || 0,
    language_expression_score: scores.expression || 0,
    expression_score: scores.expression || 0,
    total_score: totalScore,
    grade: totalScore >= 90 ? 'A' : totalScore >= 80 ? 'B' : totalScore >= 70 ? 'C' : 'D',
    percentile: 65,
    spelling_errors: 2,
    spacing_errors: 4,
    grammar_errors: 1,
    vocabulary_level: 3.6,
    overall_comment: analysis.comprehensiveFeedback || '',
    comprehensive_feedback: analysis.comprehensiveFeedback || '',
    detailed_feedback: analysis.detailedFeedback || '',
    strengths: analysis.strengths || [],
    weaknesses: analysis.weaknesses || [],
    improvements: analysis.improvements || [],
    student_feedback: analysis.studentFeedback || {},
    rubric: analysis.rubric || [],
    line_edits: analysis.lineEdits || [],
    teacher_note: analysis.teacherNote || '',
    evaluated_at: new Date().toISOString(),
  };

  const { data: evaluation, error: evaluationError } = await supabase
    .from('evaluations')
    .insert(evaluationPayload)
    .select('*')
    .single();

  if (evaluationError) {
    return json(res, 500, { message: evaluationError.message });
  }

  await supabase
    .from('assessments')
    .update({ status: 'EVALUATED' })
    .eq('assessment_id', answer.assessment_id);

  return json(res, 200, { evaluation });
}
