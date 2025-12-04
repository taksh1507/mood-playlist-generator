import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadTrack = async (file, title = '') => {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);

  return apiClient.post('/tracks/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const listTracks = async () => {
  return apiClient.get('/tracks');
};

export const generatePlaylist = async (mood) => {
  return apiClient.post('/mix/generate', { mood });
};

export const getPlaylist = async (id) => {
  return apiClient.get(`/mix/${id}`);
};

export const getAllPlaylists = async (page = 1, limit = 10) => {
  return apiClient.get('/mix/all', { params: { page, limit } });
};

export const getTopTracks = async () => {
  return apiClient.get('/stats/top-tracks');
};
