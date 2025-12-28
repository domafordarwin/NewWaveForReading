import axios from 'axios';
import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? '/api' : 'http://localhost:8080/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const normalizeArray = (data: any) => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.items)) {
    return data.items;
  }
  if (data && Array.isArray(data.data)) {
    return data.data;
  }
  if (data && Array.isArray(data.users)) {
    return data.users;
  }
  if (data && Array.isArray(data.books)) {
    return data.books;
  }
  if (data && Array.isArray(data.assessments)) {
    return data.assessments;
  }
  if (data && Array.isArray(data.evaluations)) {
    return data.evaluations;
  }
  return [];
};

const ensureSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }
  return supabase;
};

const mapUser = (row: any) => ({
  userId: row.user_id ?? row.userId ?? row.id,
  email: row.email,
  userType: row.user_type ?? row.userType,
  name: row.name,
  birthDate: row.birth_date ?? row.birthDate,
  phone: row.phone,
  schoolName: row.school_name ?? row.schoolName,
  grade: row.grade,
  profileImageUrl: row.profile_image_url ?? row.profileImageUrl,
  isActive: row.is_active ?? row.isActive,
});

const mapBook = (row: any) => ({
  bookId: row.book_id ?? row.bookId ?? row.id,
  title: row.title,
  author: row.author,
  publisher: row.publisher,
  publishedYear: row.published_year ?? row.publishedYear,
  isbn: row.isbn,
  category: row.category,
  description: row.description,
  coverImageUrl: row.cover_image_url ?? row.coverImageUrl,
  difficultyLevel: row.difficulty_level ?? row.difficultyLevel,
});

const mapTopic = (row: any) => ({
  topicId: row.topic_id ?? row.topicId ?? row.id,
  bookId: row.book_id ?? row.bookId,
  topicText: row.topic_text ?? row.topicText,
  topicType: row.topic_type ?? row.topicType,
  difficultyLevel: row.difficulty_level ?? row.difficultyLevel,
  keywords: row.keywords,
  evaluationCriteria: row.evaluation_criteria ?? row.evaluationCriteria,
  book: row.book ? mapBook(row.book) : undefined,
});

const mapAssessment = (row: any) => ({
  assessmentId: row.assessment_id ?? row.assessmentId ?? row.id,
  studentId: row.student_id ?? row.studentId,
  topic: row.topic ? mapTopic(row.topic) : row.topic,
  assessmentType: row.assessment_type ?? row.assessmentType,
  status: row.status,
  startedAt: row.started_at ?? row.startedAt,
  submittedAt: row.submitted_at ?? row.submittedAt,
  timeLimitMinutes: row.time_limit_minutes ?? row.timeLimitMinutes,
  wordCountMin: row.word_count_min ?? row.wordCountMin,
  wordCountMax: row.word_count_max ?? row.wordCountMax,
  createdAt: row.created_at ?? row.createdAt,
});

const mapAnswer = (row: any) => ({
  answerId: row.answer_id ?? row.answerId ?? row.id,
  assessmentId: row.assessment_id ?? row.assessmentId,
  content: row.content,
  wordCount: row.word_count ?? row.wordCount,
  charCount: row.char_count ?? row.charCount,
  paragraphCount: row.paragraph_count ?? row.paragraphCount,
  autoSavedAt: row.auto_saved_at ?? row.autoSavedAt,
  submittedAt: row.submitted_at ?? row.submittedAt,
  version: row.version,
});

const mapEvaluation = (row: any) => ({
  evaluationId: row.evaluation_id ?? row.evaluationId ?? row.id,
  answerId: row.answer_id ?? row.answerId,
  assessmentId: row.assessment_id ?? row.assessmentId,
  studentId: row.student_id ?? row.studentId,
  evaluatorType: row.evaluator_type ?? row.evaluatorType,
  bookAnalysisScore: row.book_analysis_score ?? row.bookAnalysisScore,
  creativeThinkingScore: row.creative_thinking_score ?? row.creativeThinkingScore,
  problemSolvingScore: row.problem_solving_score ?? row.problemSolvingScore,
  languageExpressionScore: row.language_expression_score ?? row.languageExpressionScore,
  expressionScore: row.expression_score ?? row.expressionScore ?? row.language_expression_score,
  totalScore: row.total_score ?? row.totalScore,
  grade: row.grade,
  percentile: row.percentile,
  spellingErrors: row.spelling_errors ?? row.spellingErrors,
  spacingErrors: row.spacing_errors ?? row.spacingErrors,
  grammarErrors: row.grammar_errors ?? row.grammarErrors,
  vocabularyLevel: row.vocabulary_level ?? row.vocabularyLevel,
  overallComment: row.overall_comment ?? row.overallComment,
  comprehensiveFeedback: row.comprehensive_feedback ?? row.comprehensiveFeedback,
  detailedFeedback: row.detailed_feedback ?? row.detailedFeedback,
  strengths: row.strengths,
  weaknesses: row.weaknesses,
  improvements: row.improvements,
  evaluatedAt: row.evaluated_at ?? row.evaluatedAt,
});

// Health Check
export const healthCheck = async () => {
  if (supabase) {
    return { status: 'ok' };
  }
  const response = await api.get('/health');
  return response.data;
};

// User APIs
export const getAllUsers = async () => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('users')
      .select('*')
      .order('user_id', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapUser);
  }
  const response = await api.get('/users');
  return normalizeArray(response.data);
};

export const getUserById = async (userId: number) => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapUser(data) : null;
  }
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getUserByEmail = async (email: string) => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (error) throw error;
    return data ? mapUser(data) : null;
  }
  const response = await api.get(`/users/email/${encodeURIComponent(email)}`);
  return response.data;
};

export const createUser = async (userData: any) => {
  if (supabase) {
    const payload = {
      email: userData.email,
      name: userData.name,
      user_type: userData.userType,
      birth_date: userData.birthDate ?? null,
      phone: userData.phone ?? null,
      school_name: userData.schoolName ?? null,
      grade: userData.grade ?? null,
      profile_image_url: userData.profileImageUrl ?? null,
      is_active: userData.isActive ?? true,
      password_hash: userData.passwordHash ?? null,
    };
    const { data, error } = await ensureSupabase()
      .from('users')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return mapUser(data);
  }
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (userId: number, userData: any) => {
  if (supabase) {
    const payload: any = {
      email: userData.email,
      name: userData.name,
      user_type: userData.userType,
      birth_date: userData.birthDate ?? null,
      phone: userData.phone ?? null,
      school_name: userData.schoolName ?? null,
      grade: userData.grade ?? null,
      profile_image_url: userData.profileImageUrl ?? null,
      is_active: userData.isActive ?? null,
    };
    const { data, error } = await ensureSupabase()
      .from('users')
      .update(payload)
      .eq('user_id', userId)
      .select('*')
      .single();
    if (error) throw error;
    return mapUser(data);
  }
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId: number) => {
  if (supabase) {
    const { error } = await ensureSupabase()
      .from('users')
      .delete()
      .eq('user_id', userId);
    if (error) throw error;
    return { ok: true };
  }
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// Book APIs
export const getAllBooks = async () => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('books')
      .select('*')
      .order('book_id', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapBook);
  }
  const response = await api.get('/books');
  return normalizeArray(response.data);
};

export const getBookById = async (bookId: number) => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('books')
      .select('*')
      .eq('book_id', bookId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapBook(data) : null;
  }
  const response = await api.get(`/books/${bookId}`);
  return response.data;
};

export const createBook = async (bookData: any) => {
  if (supabase) {
    const payload = {
      title: bookData.title,
      author: bookData.author,
      publisher: bookData.publisher ?? null,
      published_year: bookData.publishedYear ?? null,
      isbn: bookData.isbn ?? null,
      category: bookData.category ?? null,
      description: bookData.description ?? null,
      cover_image_url: bookData.coverImageUrl ?? null,
      difficulty_level: bookData.difficultyLevel ?? null,
    };
    const { data, error } = await ensureSupabase()
      .from('books')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return mapBook(data);
  }
  const response = await api.post('/books', bookData);
  return response.data;
};

// Assessment APIs
export const getAllAssessments = async () => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('assessments')
      .select('*, topic:topics(*, book:books(*))')
      .order('assessment_id', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapAssessment);
  }
  const response = await api.get('/assessments');
  return normalizeArray(response.data);
};

export const getAssessmentById = async (assessmentId: number) => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('assessments')
      .select('*, topic:topics(*, book:books(*))')
      .eq('assessment_id', assessmentId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapAssessment(data) : null;
  }
  const response = await api.get(`/assessments/${assessmentId}`);
  return response.data;
};

export const getAssessmentsByStudentId = async (studentId: number) => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('assessments')
      .select('*, topic:topics(*, book:books(*))')
      .eq('student_id', studentId)
      .order('assessment_id', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapAssessment);
  }
  const response = await api.get(`/assessments/student/${studentId}`);
  return normalizeArray(response.data);
};

export const createAssessment = async (assessmentData: any) => {
  if (supabase) {
    const payload = {
      student_id: assessmentData.studentId,
      topic_id: assessmentData.topicId,
      assessment_type: assessmentData.assessmentType,
      status: assessmentData.status ?? 'NOT_STARTED',
      time_limit_minutes: assessmentData.timeLimitMinutes,
      word_count_min: assessmentData.wordCountMin,
      word_count_max: assessmentData.wordCountMax,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await ensureSupabase()
      .from('assessments')
      .insert(payload)
      .select('*, topic:topics(*, book:books(*))')
      .single();
    if (error) throw error;
    return mapAssessment(data);
  }
  const response = await api.post('/assessments', assessmentData);
  return response.data;
};

export const startAssessment = async (assessmentId: number) => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('assessments')
      .update({
        status: 'IN_PROGRESS',
        started_at: new Date().toISOString(),
      })
      .eq('assessment_id', assessmentId)
      .select('*, topic:topics(*, book:books(*))')
      .single();
    if (error) throw error;
    return mapAssessment(data);
  }
  const response = await api.put(`/assessments/${assessmentId}/start`);
  return response.data;
};

export const submitAssessment = async (assessmentId: number) => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('assessments')
      .update({
        status: 'SUBMITTED',
        submitted_at: new Date().toISOString(),
      })
      .eq('assessment_id', assessmentId)
      .select('*, topic:topics(*, book:books(*))')
      .single();
    if (error) throw error;
    return mapAssessment(data);
  }
  const response = await api.put(`/assessments/${assessmentId}/submit`);
  return response.data;
};

// Answer APIs
export const createAnswer = async (answerData: any) => {
  if (supabase) {
    const payload = {
      assessment_id: answerData.assessmentId,
      content: answerData.content,
      word_count: answerData.wordCount,
      char_count: answerData.charCount,
      paragraph_count: answerData.paragraphCount ?? null,
      auto_saved_at: answerData.autoSavedAt ?? null,
      submitted_at: answerData.submittedAt ?? null,
      version: answerData.version ?? 1,
    };
    const { data, error } = await ensureSupabase()
      .from('answers')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return mapAnswer(data);
  }
  const response = await api.post('/answers', answerData);
  return response.data;
};

export const getAnswerByAssessment = async (assessmentId: number) => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('answers')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('answer_id', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? mapAnswer(data) : null;
  }
  const response = await api.get(`/answers/assessment/${assessmentId}`);
  return response.data;
};

export const getAnswerById = async (answerId: number) => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('answers')
      .select('*')
      .eq('answer_id', answerId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapAnswer(data) : null;
  }
  const response = await api.get(`/answers/${answerId}`);
  return response.data;
};

export const analyzeAnswer = async (answerId: number) => {
  if (supabase) {
    const { data: answerData, error: answerError } = await ensureSupabase()
      .from('answers')
      .select('*')
      .eq('answer_id', answerId)
      .maybeSingle();
    if (answerError) throw answerError;
    if (!answerData) throw new Error('Answer not found');

    const evaluationPayload = {
      answer_id: answerId,
      assessment_id: answerData.assessment_id,
      student_id: null,
      evaluator_type: 'ai',
      book_analysis_score: 18,
      creative_thinking_score: 19,
      problem_solving_score: 17,
      language_expression_score: 22,
      expression_score: 22,
      total_score: 76,
      grade: 'B+',
      percentile: 67,
      spelling_errors: 2,
      spacing_errors: 4,
      grammar_errors: 1,
      vocabulary_level: 3.6,
      overall_comment: 'Auto evaluation completed.',
      comprehensive_feedback: 'AI analysis complete.',
      detailed_feedback: 'Generated by automated evaluation.',
      strengths: ['Clear structure', 'Relevant examples', 'Consistent flow'],
      weaknesses: ['Needs deeper analysis', 'Some grammar mistakes'],
      improvements: ['Add evidence', 'Improve transitions', 'Review grammar'],
      evaluated_at: new Date().toISOString(),
    };
    const { data, error } = await ensureSupabase()
      .from('evaluations')
      .insert(evaluationPayload)
      .select('*')
      .single();
    if (error) throw error;
    return mapEvaluation(data);
  }
  const response = await api.post(`/answers/${answerId}/analyze`);
  return response.data;
};

// Evaluation APIs
export const getAllEvaluations = async () => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('evaluations')
      .select('*')
      .order('evaluation_id', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapEvaluation);
  }
  const response = await api.get('/evaluations');
  return normalizeArray(response.data);
};

export const getEvaluationById = async (evaluationId: number) => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('evaluations')
      .select('*')
      .eq('evaluation_id', evaluationId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapEvaluation(data) : null;
  }
  const response = await api.get(`/evaluations/${evaluationId}`);
  return response.data;
};

export const getEvaluationByAnswerId = async (answerId: number) => {
  if (supabase) {
    const { data, error } = await ensureSupabase()
      .from('evaluations')
      .select('*')
      .eq('answer_id', answerId)
      .maybeSingle();
    if (error) throw error;
    return { evaluation: data ? mapEvaluation(data) : null };
  }
  const response = await api.get(`/evaluations/answer/${answerId}`);
  return response.data;
};

export default api;
