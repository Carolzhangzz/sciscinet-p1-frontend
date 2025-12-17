// src/services/api.ts - UPDATED with T2 endpoints

import { NetworkData, APIStats } from '../types/network';

const API_BASE_URL = 'http://localhost:5001/api';

export interface TimelineData {
  year: number;
  count: number;
}

export interface PatentDistribution {
  patent_count: number;
  frequency: number;
}

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
  },

  // NEW: T2 endpoints
  async getTimeline(): Promise<TimelineData[]> {
    const response = await fetch(`${API_BASE_URL}/timeline`);
    if (!response.ok) {
      throw new Error('Failed to fetch timeline');
    }
    return response.json();
  },

  async getPatentDistribution(year?: number): Promise<PatentDistribution[]> {
    const url = year 
      ? `${API_BASE_URL}/patent-distribution/${year}`
      : `${API_BASE_URL}/patent-distribution`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch patent distribution');
    }
    return response.json();
  }
};