// src/pages/NotificationsPage.jsx
import { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLog } from '../context/LogContext';
import './NotificationsPage.css';

export default function NotificationsPage() {
  const { toast } = useToast();
  const { addLog } = useLog();

  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastStatus, setBroadcastStatus] = useState('');

  const [notifGuildId, setNotifGuildId] = useState('');
  const [notifBotId, setNotifBotId] = useState('');
  const [notifMsg, setNotifMsg] = useState('');

  async function handleBroadcast() {
    if (!broadcastMsg.trim()) return toast('Digite uma mensagem', 'error');
    try {
      const subs = await api('/api/subscriptions');
      const actives = subs.filter((s) => s.paymentStatus === 'paid');
      if (!actives.length) return toast('Nenhuma assinatura ativa', 'error');
      const r = await api('/api/notifications/broadcast', 'POST', { subscriptions: actives, message: broadcastMsg });
      toast(`Enviado para ${r.sent} servidores`, 'success');
      setBroadcastStatus(`✓ Enviado para ${r.sent}/${r.total} — ${new Date().toLocaleTimeString('pt-BR')}`);
      setBroadcastMsg('');
      addLog('broadcast', 'success', `Mensagem enviada para ${r.sent} servidores`);
    } catch (e) {
      toast(`Erro: ${e.message}`, 'error');
    }
  }

  async function handleNotif() {
    if (!notifGuildId.trim() || !notifMsg.trim()) return toast('Preencha Guild ID e mensagem', 'error');
    try {
      await api('/api/notifications', 'POST', { guildId: notifGuildId, botId: notifBotId, message: notifMsg });
      toast('Notificação enfileirada!', 'success');
      setNotifMsg('');
      setNotifGuildId('');
    } catch (e) {
      toast(`Erro: ${e.message}`, 'error');
    }
  }

  return (
    <div>
      <div className="section-title" style={{ marginBottom: 16 }}>Broadcast de notificações</div>

      <div className="broadcast-box">
        <h3>📢 Enviar para todos os servidores</h3>
        <textarea
          className="txt"
          placeholder="Digite a mensagem que será enviada para todos os bots..."
          value={broadcastMsg}
          onChange={(e) => setBroadcastMsg(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
          <button className="btn btn-accent" onClick={handleBroadcast}>Enviar broadcast</button>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>{broadcastStatus}</span>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div className="broadcast-box">
          <h3>🎯 Enviar para servidor específico</h3>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input
              className="field-input"
              placeholder="Guild ID"
              value={notifGuildId}
              onChange={(e) => setNotifGuildId(e.target.value)}
            />
            <input
              className="field-input"
              placeholder="Bot ID (opcional)"
              value={notifBotId}
              onChange={(e) => setNotifBotId(e.target.value)}
            />
          </div>
          <textarea
            className="txt"
            placeholder="Mensagem..."
            style={{ minHeight: 80 }}
            value={notifMsg}
            onChange={(e) => setNotifMsg(e.target.value)}
          />
          <button className="btn btn-accent" style={{ marginTop: 10 }} onClick={handleNotif}>
            Enviar notificação
          </button>
        </div>
      </div>
    </div>
  );
}
