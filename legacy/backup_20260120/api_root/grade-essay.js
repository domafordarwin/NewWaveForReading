/**
 * API endpoint for AI-based essay grading using OpenAI
 * POST /api/grade-essay
 */

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(body));
};

const parseBody = (req) => new Promise((resolve) => {
  if (req.body && typeof req.body === 'object') {
    resolve(req.body);
    return;
  }

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

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return json(res, 200, { ok: true });
  }

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const body = await parseBody(req);
    const { essayText, itemContent, rubric, maxPoints } = body;

    if (!essayText || !itemContent || !maxPoints) {
      return json(res, 400, {
        error: 'Missing required fields: essayText, itemContent, maxPoints'
      });
    }

    // OpenAI API 호출
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return json(res, 500, { error: 'OpenAI API key not configured' });
    }

    const prompt = buildGradingPrompt(essayText, itemContent, rubric, maxPoints);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Korean language teacher who grades student essays accurately and provides constructive feedback.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return json(res, 500, {
        error: 'Failed to grade essay',
        details: errorData,
      });
    }

    const aiResponse = await response.json();
    const aiMessage = aiResponse.choices[0]?.message?.content || '';

    // AI 응답 파싱 (JSON 형식 기대)
    const gradingResult = parseGradingResult(aiMessage, maxPoints);

    return json(res, 200, gradingResult);

  } catch (error) {
    console.error('Essay grading error:', error);
    return json(res, 500, {
      error: 'Internal server error',
      message: error.message,
    });
  }
};

/**
 * 채점 프롬프트 생성
 */
function buildGradingPrompt(essayText, itemContent, rubric, maxPoints) {
  let prompt = `다음 서술형 문항에 대한 학생의 답안을 채점해주세요.\n\n`;

  prompt += `**문항:**\n${itemContent.stem}\n\n`;

  if (itemContent.stimulus) {
    prompt += `**지문:**\n${itemContent.stimulus}\n\n`;
  }

  if (rubric && rubric.criteria && rubric.criteria.length > 0) {
    prompt += `**채점 기준:**\n`;
    rubric.criteria.forEach((criterion, idx) => {
      prompt += `${idx + 1}. ${criterion.description} (${criterion.points}점)\n`;
      if (criterion.levels) {
        criterion.levels.forEach(level => {
          prompt += `   - ${level.score}점: ${level.description}\n`;
        });
      }
    });
    prompt += `\n`;
  } else {
    prompt += `**배점:** ${maxPoints}점\n\n`;
  }

  prompt += `**학생 답안:**\n${essayText}\n\n`;

  prompt += `위 답안을 채점하고, 다음 JSON 형식으로 응답해주세요:\n`;
  prompt += `{\n`;
  prompt += `  "score": 점수 (숫자, 0~${maxPoints}),\n`;
  prompt += `  "feedback": "구체적인 피드백 (2-3문장, 한국어)",\n`;
  prompt += `  "strengths": ["잘한 점 1", "잘한 점 2"],\n`;
  prompt += `  "improvements": ["개선할 점 1", "개선할 점 2"]\n`;
  prompt += `}\n\n`;
  prompt += `응답은 반드시 유효한 JSON 형식이어야 합니다.`;

  return prompt;
}

/**
 * AI 응답 파싱
 */
function parseGradingResult(aiMessage, maxPoints) {
  try {
    // JSON 코드 블록 제거
    let jsonStr = aiMessage.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    const result = JSON.parse(jsonStr);

    // 점수 유효성 검사
    if (typeof result.score !== 'number' || result.score < 0 || result.score > maxPoints) {
      result.score = Math.min(Math.max(0, result.score || 0), maxPoints);
    }

    return {
      score: result.score,
      feedback: result.feedback || '채점이 완료되었습니다.',
      strengths: result.strengths || [],
      improvements: result.improvements || [],
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    console.error('AI message:', aiMessage);

    // 파싱 실패 시 기본값 반환
    return {
      score: maxPoints * 0.5,
      feedback: '채점 중 오류가 발생했습니다. 답안을 확인해주세요.',
      strengths: [],
      improvements: [],
    };
  }
}
