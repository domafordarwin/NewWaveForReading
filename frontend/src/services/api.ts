import axios from 'axios';

const API_BASE_URL = 'https://8080-ixw1syp6xumzqdvj2fcdg-0e616f0a.sandbox.novita.ai/api';

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

export const createUser = async (userData: any) => {
  const response = await api.post('/users', userData);
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

export default api;
