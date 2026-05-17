// src/App.jsx
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';

import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

import OverviewPage from './pages/OverviewPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import NotificationsPage from './pages/NotificationsPage';
import DatabasePage from './pages/DatabasePage';

export default function App() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activePage, setActivePage] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [subsFilter, setSubsFilter] = useState(null);

  // Loading state — user is undefined while Firebase checks auth
  if (user === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text3)' }}>
        <div className="spin" style={{ marginRight: 10 }} /> Carregando...
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  function handleNavigate(page) {
    setActivePage(page);
    setSubsFilter(null);
  }

  function handleRefresh() {
    setRefreshTrigger((n) => n + 1);
    toast('Atualizando...', 'info');
  }

  function handleNavigateToSubs(filter) {
    setSubsFilter(filter);
    setActivePage('subscriptions');
  }

  return (
    <div className="layout">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <div className="main">
        <Topbar activePage={activePage} onRefresh={handleRefresh} />
        <div className="content">
          {activePage === 'overview' && (
            <OverviewPage refreshTrigger={refreshTrigger} />
          )}
          {activePage === 'subscriptions' && (
            <SubscriptionsPage refreshTrigger={refreshTrigger} filter={subsFilter} />
          )}
          {activePage === 'notifications' && <NotificationsPage />}
          {activePage === 'database' && (
            <DatabasePage refreshTrigger={refreshTrigger} onNavigateToSubs={handleNavigateToSubs} />
          )}
        </div>
      </div>
    </div>
  );
}