// src/components/Topbar.jsx
import { useEffect, useState } from 'react';
import './Topbar.css';

const PAGE_TITLES = {
  overview:      'Visão geral',
  bots:          'Bots PM2',
  subscriptions: 'Assinaturas',
  notifications: 'Notificações',
  logs:          'Logs',
  database:      'MySQL',
};

export default function Topbar({ activePage, onRefresh }) {
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
        <h1>{PAGE_TITLES[activePage] || activePage}</h1>
        <p>{time}</p>
      </div>
      <div className="topbar-right">
        <button className="btn" onClick={onRefresh}>↻ Atualizar</button>
      </div>
    </div>
  );
}
