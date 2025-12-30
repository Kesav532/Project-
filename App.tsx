
import React, { useState, useEffect } from 'react';
import { User, Role } from './types';
import { MockDb } from './services/mockDb';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { CitizenDashboard } from './components/CitizenDashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LandingPage } from './components/LandingPage';

type ScreenState = 'LANDING' | 'AUTH';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [screen, setScreen] = useState<ScreenState>('LANDING');
  const [initialAuthView, setInitialAuthView] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  useEffect(() => {
    MockDb.init();
    const currentUser = MockDb.getCurrentUser();
    if (currentUser) {
      handleLoginSuccess(currentUser);
    }
  }, []);

  const handleLoginSuccess = (u: User) => {
    setUser(u);
    if (u.role === Role.CITIZEN) setActiveTab('dashboard');
    else if (u.role === Role.EMPLOYEE) setActiveTab('overview');
    else if (u.role === Role.ADMIN) setActiveTab('overview');
  };

  const handleLogout = () => {
    MockDb.logout();
    setUser(null);
    setScreen('LANDING');
  };

  const handleProfileUpdate = () => {
    const updatedUser = MockDb.getCurrentUser();
    if (updatedUser) {
      setUser(updatedUser);
    }
  };

  const navigateToAuth = (view: 'LOGIN' | 'REGISTER') => {
    setInitialAuthView(view);
    setScreen('AUTH');
  };

  if (!user) {
    if (screen === 'LANDING') {
      return <LandingPage onGetStarted={navigateToAuth} />;
    }
    return (
      <Auth 
        onLogin={handleLoginSuccess} 
        initialView={initialAuthView} 
        onBackToLanding={() => setScreen('LANDING')}
      />
    );
  }

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {user.role === Role.CITIZEN && (
        <CitizenDashboard 
          user={user} 
          activeView={activeTab} 
          onProfileUpdate={handleProfileUpdate} 
        />
      )}
      {user.role === Role.EMPLOYEE && (
        <EmployeeDashboard 
          user={user} 
          activeView={activeTab}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
      {user.role === Role.ADMIN && (
        <AdminDashboard 
          activeView={activeTab} 
          onTabChange={setActiveTab} 
        />
      )}
    </Layout>
  );
}

export default App;
