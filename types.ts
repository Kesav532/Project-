
export enum Role {
  CITIZEN = 'CITIZEN',
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN'
}

export enum ComplaintStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string; // For employees
  avatar?: string;
  dob?: string;
  mobile?: string;
  aadhaar?: string;
  address?: string;
  gender?: string;
}

export interface ComplaintLog {
  id: string;
  timestamp: string;
  action: string;
  byUser: string;
  note?: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  assignedTo?: string; // employee ID
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  image?: string; // Base64 or URL
  voiceNote?: string; // Base64 or URL
  logs: ComplaintLog[];
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}
