// src/services/api.ts

import { NetworkData, APIStats } from '../types/network';

const API_BASE_URL = 'http://localhost:5001/api';

export const api = {
  async getAuthorNetwork(): Promise<NetworkData> {
    const response = await fetch(`${API_BASE_URL}/author-network`);
    if (!response.ok) {
      throw new Error('Failed to fetch author network');
    }
    return response.json();
  },

  async getCitationNetwork(): Promise<NetworkData> {
    const response = await fetch(`${API_BASE_URL}/citation-network`);
    if (!response.ok) {
      throw new Error('Failed to fetch citation network');
    }
    return response.json();
  },

  async getStats(): Promise<APIStats> {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  }
};
