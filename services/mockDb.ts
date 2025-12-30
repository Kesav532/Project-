
import { User, Complaint, Role, ComplaintStatus, ComplaintLog } from '../types';

const USERS_KEY = 'civic_users';
const COMPLAINTS_KEY = 'civic_complaints';
const CURRENT_USER_KEY = 'civic_current_user';

// Seed Data
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'John Citizen', email: 'john@example.com', role: Role.CITIZEN, avatar: 'https://picsum.photos/200' },
  { id: 'e1', name: 'Sarah Engineer', email: 'sarah@civic.com', role: Role.EMPLOYEE, department: 'Roads', avatar: 'https://picsum.photos/201' },
  { id: 'e2', name: 'Mike Sanitation', email: 'mike@civic.com', role: Role.EMPLOYEE, department: 'Sanitation', avatar: 'https://picsum.photos/202' },
  { id: 'a1', name: 'Admin User', email: 'admin@civic.com', role: Role.ADMIN, avatar: 'https://picsum.photos/203' }
];

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    userId: 'u1',
    userName: 'John Citizen',
    title: 'Large Pothole on Main St',
    description: 'There is a massive pothole causing traffic slowdowns near the bakery.',
    category: 'Roads',
    status: ComplaintStatus.PENDING,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    image: 'https://picsum.photos/seed/pothole/400/300',
    logs: [
      { id: 'l1', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), action: 'Created', byUser: 'John Citizen' }
    ]
  },
  {
    id: 'c2',
    userId: 'u1',
    userName: 'John Citizen',
    title: 'Garbage not collected',
    description: 'The garbage truck skipped our street this Tuesday.',
    category: 'Sanitation',
    status: ComplaintStatus.IN_PROGRESS,
    assignedTo: 'e2',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    logs: [
      { id: 'l2', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), action: 'Created', byUser: 'John Citizen' },
      { id: 'l3', timestamp: new Date(Date.now() - 86400000).toISOString(), action: 'Status Update: In Progress', byUser: 'Admin User', note: 'Assigned to Mike' }
    ]
  }
];

// DB Service
export const MockDb = {
  init: () => {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(COMPLAINTS_KEY)) {
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(INITIAL_COMPLAINTS));
    }
  },

  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },

  getEmployees: (): User[] => {
    return MockDb.getUsers().filter(u => u.role === Role.EMPLOYEE);
  },

  getComplaints: (): Complaint[] => {
    return JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
  },

  saveComplaint: (complaint: Complaint) => {
    const complaints = MockDb.getComplaints();
    const existingIndex = complaints.findIndex(c => c.id === complaint.id);
    if (existingIndex >= 0) {
      complaints[existingIndex] = complaint;
    } else {
      complaints.unshift(complaint);
    }
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
  },

  deleteComplaint: (id: string) => {
    const complaints = MockDb.getComplaints().filter(c => c.id !== id);
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
  },

  saveUser: (user: User) => {
    const users = MockDb.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // If updating the currently logged-in user, sync the session storage
    const currentUser = MockDb.getCurrentUser();
    if (currentUser && currentUser.id === user.id) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  },

  deleteUser: (id: string) => {
    const users = MockDb.getUsers().filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  checkEmailExists: (email: string): boolean => {
    const users = MockDb.getUsers();
    return users.some(u => u.email.toLowerCase() === email.toLowerCase());
  },

  login: (email: string): User | null => {
    const users = MockDb.getUsers();
    // Automatically retrieve the user (and their role) by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  register: (name: string, email: string, mobile?: string, address?: string, aadhaar?: string, gender?: string): boolean => {
    const users = MockDb.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false; // Email already exists
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      mobile,
      address,
      aadhaar,
      gender,
      role: Role.CITIZEN, // Default role for public registration
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };
    MockDb.saveUser(newUser);
    return true;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  addLog: (complaintId: string, action: string, byUser: string, note?: string) => {
    const complaints = MockDb.getComplaints();
    const complaint = complaints.find(c => c.id === complaintId);
    if (complaint) {
      const newLog: ComplaintLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action,
        byUser,
        note
      };
      complaint.logs.push(newLog);
      complaint.updatedAt = new Date().toISOString();
      MockDb.saveComplaint(complaint);
    }
  }
};
