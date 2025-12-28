import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? '/api' : 'http://localhost:8080/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health Check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// User APIs
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (userId: number) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getUserByEmail = async (email: string) => {
  const response = await api.get(`/users/email/${encodeURIComponent(email)}`);
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (userId: number, userData: any) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// Book APIs
export const getAllBooks = async () => {
  const response = await api.get('/books');
  return response.data;
};

export const getBookById = async (bookId: number) => {
  const response = await api.get(`/books/${bookId}`);
  return response.data;
};

export const createBook = async (bookData: any) => {
  const response = await api.post('/books', bookData);
  return response.data;
};

// Assessment APIs
export const getAllAssessments = async () => {
  const response = await api.get('/assessments');
  return response.data;
};

export const getAssessmentById = async (assessmentId: number) => {
  const response = await api.get(`/assessments/${assessmentId}`);
  return response.data;
};

export const getAssessmentsByStudentId = async (studentId: number) => {
  const response = await api.get(`/assessments/student/${studentId}`);
  return response.data;
};

export const createAssessment = async (assessmentData: any) => {
  const response = await api.post('/assessments', assessmentData);
  return response.data;
};

export const startAssessment = async (assessmentId: number) => {
  const response = await api.put(`/assessments/${assessmentId}/start`);
  return response.data;
};

export const submitAssessment = async (assessmentId: number) => {
  const response = await api.put(`/assessments/${assessmentId}/submit`);
  return response.data;
};

// Answer APIs
export const createAnswer = async (answerData: any) => {
  const response = await api.post('/answers', answerData);
  return response.data;
};

export const getAnswerByAssessment = async (assessmentId: number) => {
  const response = await api.get(`/answers/assessment/${assessmentId}`);
  return response.data;
};

export const getAnswerById = async (answerId: number) => {
  const response = await api.get(`/answers/${answerId}`);
  return response.data;
};

export const analyzeAnswer = async (answerId: number) => {
  const response = await api.post(`/answers/${answerId}/analyze`);
  return response.data;
};

// Evaluation APIs
export const getAllEvaluations = async () => {
  const response = await api.get('/evaluations');
  return response.data;
};

export const getEvaluationById = async (evaluationId: number) => {
  const response = await api.get(`/evaluations/${evaluationId}`);
  return response.data;
};

export const getEvaluationByAnswerId = async (answerId: number) => {
  const response = await api.get(`/evaluations/answer/${answerId}`);
  return response.data;
};

export default api;
