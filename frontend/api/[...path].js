const data = require('./_data');

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
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

const getNextId = (items, key) => {
  if (!items.length) {
    return 1;
  }
  return Math.max(...items.map((item) => item[key])) + 1;
};

const findById = (items, key, id) => items.find((item) => item[key] === id);

module.exports = async (req, res) => {
  const method = (req.method || 'GET').toUpperCase();
  const urlPath = (req.url || '').split('?')[0];
  const path = urlPath.replace(/^\/api\/?/, '');
  const parts = path.split('/').filter(Boolean);

  if (method === 'OPTIONS') {
    return json(res, 200, { ok: true });
  }

  if (!parts.length) {
    return json(res, 200, { message: 'API is running' });
  }

  if (parts[0] === 'health' && method === 'GET') {
    return json(res, 200, { status: 'ok', time: new Date().toISOString() });
  }

  if (parts[0] === 'users') {
    if (parts[1] === 'email' && method === 'GET') {
      const email = decodeURIComponent(parts[2] || '');
      const user = data.users.find((item) => item.email === email);
      if (!user) {
        return json(res, 404, { message: 'User not found' });
      }
      return json(res, 200, user);
    }

    if (parts.length === 1 && method === 'GET') {
      return json(res, 200, data.users);
    }

    if (parts.length === 1 && method === 'POST') {
      const payload = await parseBody(req);
      const user = {
        userId: getNextId(data.users, 'userId'),
        userType: payload.userType || 'STUDENT',
        name: payload.name || 'New User',
        email: payload.email || `user${Date.now()}@example.com`,
        birthDate: payload.birthDate,
        phone: payload.phone,
        schoolName: payload.schoolName,
        grade: payload.grade,
      };
      data.users.push(user);
      return json(res, 201, user);
    }

    if (parts.length === 2) {
      const userId = Number(parts[1]);
      const user = findById(data.users, 'userId', userId);
      if (!user) {
        return json(res, 404, { message: 'User not found' });
      }

      if (method === 'GET') {
        return json(res, 200, user);
      }

      if (method === 'PUT') {
        const payload = await parseBody(req);
        Object.assign(user, payload);
        return json(res, 200, user);
      }

      if (method === 'DELETE') {
        const index = data.users.findIndex((item) => item.userId === userId);
        if (index >= 0) {
          data.users.splice(index, 1);
        }
        return json(res, 200, { ok: true });
      }
    }
  }

  if (parts[0] === 'books') {
    if (parts.length === 1 && method === 'GET') {
      return json(res, 200, data.books);
    }

    if (parts.length === 1 && method === 'POST') {
      const payload = await parseBody(req);
      const book = {
        bookId: getNextId(data.books, 'bookId'),
        title: payload.title || 'New Book',
        author: payload.author || 'Unknown',
        publisher: payload.publisher,
        publishedYear: payload.publishedYear,
        isbn: payload.isbn,
        category: payload.category,
        description: payload.description,
        coverImageUrl: payload.coverImageUrl,
        difficultyLevel: payload.difficultyLevel || 'MIDDLE',
      };
      data.books.push(book);
      return json(res, 201, book);
    }

    if (parts.length === 2 && method === 'GET') {
      const bookId = Number(parts[1]);
      const book = findById(data.books, 'bookId', bookId);
      if (!book) {
        return json(res, 404, { message: 'Book not found' });
      }
      return json(res, 200, book);
    }
  }

  if (parts[0] === 'assessments') {
    if (parts[1] === 'student' && method === 'GET') {
      const studentId = Number(parts[2]);
      const list = data.assessments.filter((item) => item.studentId === studentId);
      return json(res, 200, list);
    }

    if (parts.length === 1 && method === 'GET') {
      return json(res, 200, data.assessments);
    }

    if (parts.length === 1 && method === 'POST') {
      const payload = await parseBody(req);
      const topic = data.topics.find((item) => item.topicId === Number(payload.topicId))
        || data.topics[0];
      const assessment = {
        assessmentId: getNextId(data.assessments, 'assessmentId'),
        studentId: Number(payload.studentId) || 1,
        topic,
        assessmentType: payload.assessmentType || 'ESSAY',
        status: 'NOT_STARTED',
        timeLimitMinutes: payload.timeLimitMinutes || 90,
        wordCountMin: payload.wordCountMin || 800,
        wordCountMax: payload.wordCountMax || 1200,
        createdAt: new Date().toISOString(),
      };
      data.assessments.push(assessment);
      return json(res, 201, assessment);
    }

    if (parts.length === 2 && method === 'GET') {
      const assessmentId = Number(parts[1]);
      const assessment = findById(data.assessments, 'assessmentId', assessmentId);
      if (!assessment) {
        return json(res, 404, { message: 'Assessment not found' });
      }
      return json(res, 200, assessment);
    }

    if (parts.length === 3 && method === 'PUT') {
      const assessmentId = Number(parts[1]);
      const action = parts[2];
      const assessment = findById(data.assessments, 'assessmentId', assessmentId);
      if (!assessment) {
        return json(res, 404, { message: 'Assessment not found' });
      }

      if (action === 'start') {
        assessment.status = 'IN_PROGRESS';
        assessment.startedAt = new Date().toISOString();
        return json(res, 200, assessment);
      }

      if (action === 'submit') {
        assessment.status = 'SUBMITTED';
        assessment.submittedAt = new Date().toISOString();
        return json(res, 200, assessment);
      }
    }
  }

  if (parts[0] === 'answers') {
    if (parts.length === 1 && method === 'POST') {
      const payload = await parseBody(req);
      const answer = {
        answerId: getNextId(data.answers, 'answerId'),
        assessmentId: Number(payload.assessmentId),
        content: payload.content || '',
        wordCount: payload.wordCount || 0,
        charCount: payload.charCount || 0,
        paragraphCount: payload.paragraphCount || 1,
        autoSavedAt: payload.autoSavedAt,
        submittedAt: payload.submittedAt,
        version: 1,
      };
      data.answers.push(answer);
      return json(res, 201, answer);
    }

    if (parts[1] === 'assessment' && method === 'GET') {
      const assessmentId = Number(parts[2]);
      const answer = data.answers.find((item) => item.assessmentId === assessmentId);
      if (!answer) {
        return json(res, 404, { message: 'Answer not found' });
      }
      return json(res, 200, answer);
    }

    if (parts.length === 2 && method === 'GET') {
      const answerId = Number(parts[1]);
      const answer = findById(data.answers, 'answerId', answerId);
      if (!answer) {
        return json(res, 404, { message: 'Answer not found' });
      }
      return json(res, 200, answer);
    }

    if (parts.length === 3 && parts[2] === 'analyze' && method === 'POST') {
      const answerId = Number(parts[1]);
      const answer = findById(data.answers, 'answerId', answerId);
      if (!answer) {
        return json(res, 404, { message: 'Answer not found' });
      }
      const evaluation = {
        evaluationId: getNextId(data.evaluations, 'evaluationId'),
        answerId,
        assessmentId: answer.assessmentId,
        studentId: 1,
        evaluatorType: 'ai',
        bookAnalysisScore: 18,
        creativeThinkingScore: 19,
        problemSolvingScore: 17,
        languageExpressionScore: 22,
        expressionScore: 22,
        totalScore: 76,
        grade: 'B+',
        percentile: 67,
        spellingErrors: 2,
        spacingErrors: 4,
        grammarErrors: 1,
        vocabularyLevel: 3.6,
        overallComment: 'Auto evaluation completed.',
        strengths: ['Clear structure', 'Relevant examples', 'Consistent flow'],
        weaknesses: ['Needs deeper analysis', 'Some grammar mistakes'],
        evaluatedAt: new Date().toISOString(),
      };
      data.evaluations.push(evaluation);
      const assessment = findById(data.assessments, 'assessmentId', answer.assessmentId);
      if (assessment) {
        assessment.status = 'EVALUATED';
      }
      return json(res, 200, evaluation);
    }
  }

  if (parts[0] === 'evaluations') {
    if (parts[1] === 'answer' && method === 'GET') {
      const answerId = Number(parts[2]);
      const evaluation = data.evaluations.find((item) => item.answerId === answerId);
      if (!evaluation) {
        return json(res, 404, { message: 'Evaluation not found' });
      }
      return json(res, 200, evaluation);
    }

    if (parts.length === 1 && method === 'GET') {
      return json(res, 200, data.evaluations);
    }

    if (parts.length === 2 && method === 'GET') {
      const evaluationId = Number(parts[1]);
      const evaluation = findById(data.evaluations, 'evaluationId', evaluationId);
      if (!evaluation) {
        return json(res, 404, { message: 'Evaluation not found' });
      }
      return json(res, 200, evaluation);
    }
  }

  return json(res, 404, { message: 'Not found' });
};
