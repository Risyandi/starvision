import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Posts API
export const postsAPI = {
  // Get all posts with pagination
  getPosts: (limit = 10, offset = 0) => {
    return api.get(`/articles/${limit}/${offset}`);
  },

  // Get single post
  getPost: (id) => {
    return api.get(`/posts/${id}`);
  },

  // Create new post
  createPost: (data) => {
    return api.post('/posts', data);
  },

  // Update post
  updatePost: (id, data) => {
    return api.put(`/posts/${id}`, data);
  },

  // Delete post
  deletePost: (id) => {
    return api.delete(`/posts/${id}`);
  },
};

export default api;