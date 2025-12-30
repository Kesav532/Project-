
import { User, Complaint, Role, ComplaintStatus, ComplaintLog } from '../types';

const API_BASE_URL = '/api'; // Change this to your actual backend URL
const CURRENT_USER_KEY = 'civic_current_user';

export const DbService = {
  // Utility for API calls
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Database Request Failed:", error);
      throw error;
    }
  },

  init: async () => {
    // In a real DB setup, this might ping the server or check auth status
    console.log("Database service initialized connecting to MySQL via API.");
  },

  getUsers: async (): Promise<User[]> => {
    return DbService.request<User[]>('/users');
  },

  getEmployees: async (): Promise<User[]> => {
    return DbService.request<User[]>('/users/employees');
  },

  getComplaints: async (): Promise<Complaint[]> => {
    return DbService.request<Complaint[]>('/complaints');
  },

  saveComplaint: async (complaint: Complaint): Promise<void> => {
    return DbService.request<void>(`/complaints/${complaint.id}`, {
      method: 'POST',
      body: JSON.stringify(complaint)
    });
  },

  deleteComplaint: async (id: string): Promise<void> => {
    return DbService.request<void>(`/complaints/${id}`, {
      method: 'DELETE'
    });
  },

  saveUser: async (user: User): Promise<void> => {
    await DbService.request<void>(`/users/${user.id}`, {
      method: 'POST',
      body: JSON.stringify(user)
    });

    // Sync local session if it's the current user
    const currentUser = DbService.getCurrentUser();
    if (currentUser && currentUser.id === user.id) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    return DbService.request<void>(`/users/${id}`, {
      method: 'DELETE'
    });
  },

  checkEmailExists: async (email: string): Promise<boolean> => {
    const result = await DbService.request<{exists: boolean}>(`/users/check-email?email=${encodeURIComponent(email)}`);
    return result.exists;
  },

  login: async (email: string): Promise<User | null> => {
    // In a real app, this would be a POST with a password
    const user = await DbService.request<User | null>(`/users/login`, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
    return user;
  },

  register: async (name: string, email: string, mobile?: string, address?: string, aadhaar?: string, gender?: string): Promise<boolean> => {
    try {
      await DbService.request<void>(`/users/register`, {
        method: 'POST',
        body: JSON.stringify({ name, email, mobile, address, aadhaar, gender, role: Role.CITIZEN })
      });
      return true;
    } catch {
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  addLog: async (complaintId: string, action: string, byUser: string, note?: string): Promise<void> => {
    return DbService.request<void>(`/complaints/${complaintId}/logs`, {
      method: 'POST',
      body: JSON.stringify({ action, byUser, note })
    });
  }
};
