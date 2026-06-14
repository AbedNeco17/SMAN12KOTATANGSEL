import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Forbidden: You do not have permission.');
          break;
        case 500:
          console.error('Server error. Please try again later.');
          break;
        default:
          break;
      }
    } else if (error.request) {
      console.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

export default api;

// ========================================
// API Service Functions
// ========================================

export const beritaAPI = {
  getAll: (params) => api.get('/berita', { params }),
  getById: (id) => api.get(`/berita/${id}`),
  create: (data) => api.post('/berita', data),
  update: (id, data) => api.put(`/berita/${id}`, data),
  delete: (id) => api.delete(`/berita/${id}`),
};

export const galeriAPI = {
  getAll: (params) => api.get('/galeri', { params }),
  getById: (id) => api.get(`/galeri/${id}`),
  create: (data) => api.post('/galeri', data),
  update: (id, data) => api.put(`/galeri/${id}`, data),
  delete: (id) => api.delete(`/galeri/${id}`),
};

export const kontenAPI = {
  getByHalaman: (halaman) => api.get(`/konten/${halaman}`),
  update: (id, data) => api.put(`/konten/${id}`, data),
};

export const pesanAPI = {
  send: (data) => api.post('/pesan', data),
  getAll: (params) => api.get('/pesan', { params }),
  markRead: (id) => api.put(`/pesan/${id}/read`),
  delete: (id) => api.delete(`/pesan/${id}`),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

export const dokumenAPI = {
  getAll: (params) => api.get('/dokumen', { params }),
  getById: (id) => api.get(`/dokumen/${id}`),
  create: (formData) => api.post('/dokumen', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/dokumen/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/dokumen/${id}`),
};

export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
