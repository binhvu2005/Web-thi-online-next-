/**
 * API Configuration
 * Centralized API base URL configuration for the application
 */

// Get API base URL from environment variable or use default
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // User endpoints
  USER_LIST: `${API_BASE_URL}/userList`,
  USER: (id: string) => `${API_BASE_URL}/userList/${id}`,
  
  // Exam endpoints
  EXAM_LIST: `${API_BASE_URL}/examList`,
  EXAM: (id: string) => `${API_BASE_URL}/examList/${id}`,
  
  // Subject endpoints
  SUBJECT_LIST: `${API_BASE_URL}/subjectList`,
  SUBJECT: (id: string) => `${API_BASE_URL}/subjectList/${id}`,
  
  // Course endpoints
  COURSES: `${API_BASE_URL}/courses`,
  COURSE: (id: string) => `${API_BASE_URL}/courses/${id}`,
  
  // Question endpoints
  QUESTION_LIST: `${API_BASE_URL}/question`,
  QUESTION: (id: string) => `${API_BASE_URL}/question/${id}`,
  
  // User Answer endpoints
  USER_ANSWER: `${API_BASE_URL}/userAnswer`,
  USER_ANSWER_BY_USER: (userId: string) => `${API_BASE_URL}/userAnswer?userId=${userId}`,
  
  // Comment endpoints
  COMMENT_LIST: `${API_BASE_URL}/comment`,
  COMMENT: (id: string) => `${API_BASE_URL}/comment/${id}`,
} as const;

