import { apiRequest } from "./queryClient";

export const api = {
  // Brand operations
  brands: {
    getAll: () => fetch("/api/brands").then(res => res.json()),
    getById: (id: string) => fetch(`/api/brands/${id}`).then(res => res.json()),
    create: (data: any) => apiRequest("POST", "/api/brands", data),
    update: (id: string, data: any) => apiRequest("PUT", `/api/brands/${id}`, data),
    delete: (id: string) => apiRequest("DELETE", `/api/brands/${id}`),
  },

  // Instagram/TikTok operations
  instagramTiktok: {
    getAll: (filters?: any) => {
      const params = new URLSearchParams();
      if (filters?.brand_id) params.append("brand_id", filters.brand_id);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.date_range) params.append("date_range", filters.date_range);
      
      return fetch(`/api/instagram-tiktok?${params}`).then(res => res.json());
    },
    create: (data: any) => apiRequest("POST", "/api/instagram-tiktok", data),
    update: (id: string, data: any) => apiRequest("PUT", `/api/instagram-tiktok/${id}`, data),
    delete: (id: string) => apiRequest("DELETE", `/api/instagram-tiktok/${id}`),
  },

  // LinkedIn/Twitter operations
  linkedinTwitter: {
    getAll: (filters?: any) => {
      const params = new URLSearchParams();
      if (filters?.brand_id) params.append("brand_id", filters.brand_id);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.date_range) params.append("date_range", filters.date_range);
      
      return fetch(`/api/linkedin-twitter?${params}`).then(res => res.json());
    },
    create: (data: any) => apiRequest("POST", "/api/linkedin-twitter", data),
    update: (id: string, data: any) => apiRequest("PUT", `/api/linkedin-twitter/${id}`, data),
    delete: (id: string) => apiRequest("DELETE", `/api/linkedin-twitter/${id}`),
  },

  // Dashboard operations
  dashboard: {
    getMetrics: (filters?: any) => {
      const params = new URLSearchParams();
      if (filters?.brand_id) params.append("brand_id", filters.brand_id);
      if (filters?.date_range) params.append("date_range", filters.date_range);
      
      return fetch(`/api/dashboard/metrics?${params}`).then(res => res.json());
    },
    getLatestPosts: (limit?: number) => {
      const params = new URLSearchParams();
      if (limit) params.append("limit", limit.toString());
      
      return fetch(`/api/dashboard/latest-posts?${params}`).then(res => res.json());
    },
    getBrandStats: () => fetch("/api/dashboard/brand-stats").then(res => res.json()),
  },
};
