import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ofibowl_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function registerRequest(payload) {
  const { data } = await api.post('/auth/register', payload);
  localStorage.setItem('ofibowl_token', data.token);
  return data;
}

export async function loginRequest(payload) {
  const { data } = await api.post('/auth/login', payload);
  localStorage.setItem('ofibowl_token', data.token);
  return data;
}

export async function getProfile() {
  const { data } = await api.get('/auth/profile');
  return data;
}

export async function getGamesByWeek(weekNumber) {
  const { data } = await api.get(`/games/week/${weekNumber}`);
  return data;
}

export async function submitPicks(payload) {
  const { data } = await api.post('/picks', payload);
  return data;
}

export async function fetchRanking() {
  const { data } = await api.get('/ranking');
  return data;
}

export async function submitResults(payload) {
  const { data } = await api.post('/results', payload);
  return data;
}

export default api;
