import axios from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updatePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/updatepassword', passwords),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getOne: (id: string) => api.get(`/users/${id}`),
  create: (userData: any) => api.post('/users', userData),
  update: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  delete: (id: string) => api.delete(`/users/${id}`),
  toggleStatus: (id: string) => api.patch(`/users/${id}/status`),
};

export const vesselAPI = {
  getAll: (params?: any) => api.get('/vessels', { params }),
  getOne: (id: string) => api.get(`/vessels/${id}`),
  create: (vesselData: any) => api.post('/vessels', vesselData),
  update: (id: string, vesselData: any) => api.put(`/vessels/${id}`, vesselData),
  delete: (id: string) => api.delete(`/vessels/${id}`),
  updateProgress: (id: string, progressData: any) =>
    api.patch(`/vessels/${id}/progress`, progressData),
};

export const containerAPI = {
  getAll: (params?: any) => api.get('/containers', { params }),
  getOne: (id: string) => api.get(`/containers/${id}`),
  create: (containerData: any) => api.post('/containers', containerData),
  update: (id: string, containerData: any) => api.put(`/containers/${id}`, containerData),
  delete: (id: string) => api.delete(`/containers/${id}`),
  getByBlock: (block: string) => api.get(`/containers/block/${block}`),
  search: (query: string) => api.get(`/containers/search/${query}`),
};

export const reeferAPI = {
  getAll: (params?: any) => api.get('/reefers', { params }),
  getOne: (id: string) => api.get(`/reefers/${id}`),
  create: (reeferData: any) => api.post('/reefers', reeferData),
  update: (id: string, reeferData: any) => api.put(`/reefers/${id}`, reeferData),
  delete: (id: string) => api.delete(`/reefers/${id}`),
  addAlert: (id: string, alertData: any) => api.post(`/reefers/${id}/alert`, alertData),
};

export const gateAPI = {
  getAll: () => api.get('/gates'),
  getOne: (id: string) => api.get(`/gates/${id}`),
  create: (gateData: any) => api.post('/gates', gateData),
  update: (id: string, gateData: any) => api.put(`/gates/${id}`, gateData),
  delete: (id: string) => api.delete(`/gates/${id}`),
  processTransaction: (id: string, transactionData: any) =>
    api.post(`/gates/${id}/transaction`, transactionData),
  getTransactions: (id: string) => api.get(`/gates/${id}/transactions`),
};

export const truckAPI = {
  getAll: (params?: any) => api.get('/trucks', { params }),
  getOne: (id: string) => api.get(`/trucks/${id}`),
  create: (truckData: any) => api.post('/trucks', truckData),
  update: (id: string, truckData: any) => api.put(`/trucks/${id}`, truckData),
  delete: (id: string) => api.delete(`/trucks/${id}`),
  checkIn: (id: string) => api.patch(`/trucks/${id}/checkin`),
  checkOut: (id: string) => api.patch(`/trucks/${id}/checkout`),
};

export const customsAPI = {
  getAll: (params?: any) => api.get('/customs', { params }),
  getOne: (id: string) => api.get(`/customs/${id}`),
  create: (customsData: any) => api.post('/customs', customsData),
  update: (id: string, customsData: any) => api.put(`/customs/${id}`, customsData),
  delete: (id: string) => api.delete(`/customs/${id}`),
  approve: (id: string, remarks?: string) =>
    api.patch(`/customs/${id}/approve`, { remarks }),
  reject: (id: string, remarks: string) =>
    api.patch(`/customs/${id}/reject`, { remarks }),
  hold: (id: string, remarks: string) => api.patch(`/customs/${id}/hold`, { remarks }),
};

export const railAPI = {
  getAll: (params?: any) => api.get('/rails', { params }),
  getOne: (id: string) => api.get(`/rails/${id}`),
  create: (railData: any) => api.post('/rails', railData),
  update: (id: string, railData: any) => api.put(`/rails/${id}`, railData),
  delete: (id: string) => api.delete(`/rails/${id}`),
  addContainer: (id: string, containerData: any) =>
    api.post(`/rails/${id}/container`, containerData),
  removeContainer: (id: string, containerId: string) =>
    api.delete(`/rails/${id}/container/${containerId}`),
};

export const billingAPI = {
  getAll: (params?: any) => api.get('/billing', { params }),
  getOne: (id: string) => api.get(`/billing/${id}`),
  create: (billingData: any) => api.post('/billing', billingData),
  update: (id: string, billingData: any) => api.put(`/billing/${id}`, billingData),
  delete: (id: string) => api.delete(`/billing/${id}`),
  markAsPaid: (id: string, paymentMethod: string) =>
    api.patch(`/billing/${id}/paid`, { paymentMethod }),
  getRevenue: (params?: any) => api.get('/billing/revenue', { params }),
};

export const berthAPI = {
  getAll: () => api.get('/berths'),
  getUtilization: () => api.get('/berths/utilization'),
  assign: (data: { vesselId: string; berthNumber: string }) =>
    api.post('/berths/assign', data),
  release: (vesselId: string) => api.post('/berths/release', { vesselId }),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getActivity: () => api.get('/dashboard/activity'),
  getCharts: (params?: any) => api.get('/dashboard/charts', { params }),
};
