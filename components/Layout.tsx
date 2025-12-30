
import React from 'react';
import { User, Role } from '../types';
import { 
  LogOut, LayoutDashboard, FileText, Users, 
  Menu, X, ShieldAlert, UserCircle, BarChart3, ListChecks, CheckSquare
} from 'lucide-react';
import { Logo } from './Logo';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItemProps {
  item: {
    id: string;
    label: string;
    icon: any;
  };
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-6 py-3 mb-2 transition-colors duration-200 ${
      isActive 
        ? 'bg-blue-800 text-white border-r-4 border-blue-400' 
        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
    }`}
  >
    <item.icon size={20} className="mr-3" />
    <span className="font-medium">{item.label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const getNavItems = () => {
    switch (user.role) {
      case Role.CITIZEN:
        return [
          { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
          { id: 'raise', label: 'Raise Complaint', icon: FileText },
          { id: 'profile', label: 'My Profile', icon: UserCircle },
        ];
      case Role.EMPLOYEE:
        return [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'tasks', label: 'Assigned Tasks', icon: ListChecks },
          { id: 'completed', label: 'Completed Tasks', icon: CheckSquare },
          { id: 'profile', label: 'My Profile', icon: UserCircle },
        ];
      case Role.ADMIN:
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'complaints', label: 'All Complaints', icon: ShieldAlert },
          { id: 'workload', label: 'Staff Workload', icon: BarChart3 },
          { id: 'users', label: 'Manage Users', icon: Users },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      <div 
        className="absolute inset-0 z-0 opacity-10 bg-fixed bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")',
          filter: 'grayscale(100%)'
        }}
      />

      <div className="fixed top-0 w-full bg-blue-900 text-white p-4 flex justify-between items-center z-50 md:hidden shadow-md">
        <div className="flex items-center gap-2">
          <Logo size="sm" showText={false} />
          <h1 className="font-bold text-lg">CivicConnect</h1>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex flex-col shadow-2xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3 mb-1">
            <Logo size="sm" showText={false} />
            <h1 className="text-2xl font-bold tracking-tight">CivicConnect</h1>
          </div>
          <p className="text-xs text-blue-300 uppercase tracking-widest mt-1">Better Nation</p>
        </div>

        <div className="p-6 flex items-center gap-3 bg-blue-950/30">
          <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover" />
          <div className="overflow-hidden">
            <p className="font-semibold text-sm truncate">{user.name}</p>
            <p className="text-xs text-blue-300 capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>

        <nav className="flex-1 mt-6">
          {getNavItems().map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={activeTab === item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-200 hover:bg-red-900/20 rounded transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 relative z-10 bg-slate-50/80 backdrop-blur-[2px]">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
           {children}
        </div>
      </main>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
