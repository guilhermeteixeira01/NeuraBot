// src/components/Topbar.jsx
import { useEffect, useState } from 'react';
import './Topbar.css';

const PAGE_TITLES = {
  overview: 'Visão geral',
  bots: 'Bots PM2',
  subscriptions: 'Assinaturas',
  notifications: 'Notificações',
  logs: 'Logs',
  database: 'MySQL',
};

export default function Topbar({ activePage, onRefresh, onMenuToggle }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-left">
        {/* Botão hamburguer — só aparece no mobile via CSS */}
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Abrir menu">
          ☰
        </button>
        <div>
          <h1>{PAGE_TITLES[activePage] || activePage}</h1>
          <p>{time}</p>
        </div>
      </div>
      <div className="topbar-right">
        <button className="btn" onClick={onRefresh}>↻ <span>Atualizar</span></button>
      </div>
    </div>
  );
}