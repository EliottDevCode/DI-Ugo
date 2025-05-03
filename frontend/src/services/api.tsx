import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})


api.interceptors.request.use(
  config => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export interface Customer {
  id: number
  title: string
  lastname: string
  firstname: string
  postalCode: number
  city: string
  email: string
}

export interface Order {
  id: number
  product: string
  quantity: number
  price: number
  currency: string
  date: string
  customer: Customer
}

export const customerApi = {
  getAll: () => api.get<Customer[]>('/customers'),
  getById: (id: number) => api.get<Customer>(`/customers/${id}`),
  create: (data: Omit<Customer, 'id'>) => api.post<Customer>('/customers', data),
  update: (id: number, data: Partial<Customer>) => api.put<Customer>(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
}

export const orderApi = {
  getAll: () => api.get<Order[]>('/orders'),
  getById: (id: number) => api.get<Order>(`/orders/${id}`),
  create: (data: Omit<Order, 'id'>) => api.post<Order>('/orders', data),
  update: (id: number, data: Partial<Order>) => api.put<Order>(`/orders/${id}`, data),
  delete: (id: number) => api.delete(`/orders/${id}`),
}