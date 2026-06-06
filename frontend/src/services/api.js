import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:5000/api' : '/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

let refreshPromise = null;

const notifyAuthChange = () => {
  try {
    window.dispatchEvent(new CustomEvent('tm_auth_change'));
  } catch {
    void 0;
  }
  try {
    localStorage.setItem('tm_auth_event', String(Date.now()));
  } catch {
    void 0;
  }
};

const clearAuth = () => {
  localStorage.removeItem('tm_token');
  localStorage.removeItem('tm_refresh');
  localStorage.removeItem('tm_user');
  notifyAuthChange();
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tm_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
      clearAuth();
      return Promise.reject(error);
    }

    if (originalRequest._tmRetry) {
      clearAuth();
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('tm_refresh');
    if (!refreshToken) {
      clearAuth();
      return Promise.reject(error);
    }

    originalRequest._tmRetry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post('/auth/refresh', { refreshToken })
          .then((res) => res.data)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const data = await refreshPromise;
      if (!data?.token) {
        clearAuth();
        return Promise.reject(error);
      }

      localStorage.setItem('tm_token', data.token);
      if (data.refreshToken) localStorage.setItem('tm_refresh', data.refreshToken);
      if (data.user) localStorage.setItem('tm_user', JSON.stringify(data.user));
      notifyAuthChange();

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${data.token}`;
      return api.request(originalRequest);
    } catch (e) {
      clearAuth();
      return Promise.reject(e);
    }
  }
);

export default api;
