// src/components/Sidebar.jsx
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { page: 'overview', icon: '🤖', label: 'Bots PM2' },
  { page: 'subscriptions', icon: '💳', label: 'Assinaturas' },
  { page: 'notifications', icon: '🔔', label: 'Notificações' },
  { page: 'database', icon: '🗄️', label: 'MySQL' },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { user } = useAuth();
  const { toast } = useToast();

  async function handleLogout() {
    await signOut(auth);
    toast('Saiu com sucesso', 'info');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="s-icon">🤖</div>
        <div>
          <div className="s-name">NeuraBOT</div>
          <div className="s-version">v2.0.0</div>
        </div>
      </div>

      <nav>
        <div className="nav-label">Menu</div>
        {NAV_ITEMS.map(({ page, icon, label }) => (
          <button
            key={page}
            className={`nav-item${activePage === page ? ' active' : ''}`}
            data-page={page}
            onClick={() => onNavigate(page)}
          >
            <span className="ni">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="u-avatar" id="uAvatar">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" />
          ) : (
            (user?.displayName || user?.email || 'U')[0].toUpperCase()
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="u-name">{user?.displayName || 'Usuário'}</div>
          <div className="u-email">{user?.email || ''}</div>
        </div>
        <button className="u-logout" onClick={handleLogout} title="Sair">↩</button>
      </div>
    </aside>
  );
}
