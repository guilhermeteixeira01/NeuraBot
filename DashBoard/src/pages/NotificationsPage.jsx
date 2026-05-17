// src/pages/NotificationsPage.jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLog } from '../context/LogContext';
import './NotificationsPage.css';

export default function NotificationsPage({ isAdmin }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addLog } = useLog();

  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastStatus, setBroadcastStatus] = useState('');

  const [subs, setSubs] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [selectedGuildId, setSelectedGuildId] = useState('');
  const [notifMsg, setNotifMsg] = useState('');

  // Carrega assinaturas ativas para popular o select
  useEffect(() => {
    api('/api/subscriptions')
      .then((data) => {
        const actives = data.filter((s) => {
          if (!isAdmin) {
            return s.paymentStatus === 'paid' &&
              s.ownerEmail?.toLowerCase() === user?.email?.toLowerCase();
          }
          return s.paymentStatus === 'paid';
        });
        setSubs(actives);
        if (actives.length > 0) setSelectedGuildId(actives[0].guildId);
      })
      .catch(() => toast('Erro ao carregar servidores', 'error'))
      .finally(() => setLoadingSubs(false));
  }, []);

  // Assinatura selecionada atualmente
  const selectedSub = subs.find((s) => s.guildId === selectedGuildId) || null;

  async function handleBroadcast() {
    if (!broadcastMsg.trim()) return toast('Digite uma mensagem', 'error');
    try {
      const r = await api('/api/notifications/broadcast', 'POST', {
        subscriptions: subs,
        message: broadcastMsg,
      });
      toast(`Enviado para ${r.sent} servidores`, 'success');
      setBroadcastStatus(`✓ Enviado para ${r.sent}/${r.total} — ${new Date().toLocaleTimeString('pt-BR')}`);
      setBroadcastMsg('');
      addLog('broadcast', 'success', `Mensagem enviada para ${r.sent} servidores`);
    } catch (e) {
      toast(`Erro: ${e.message}`, 'error');
    }
  }

  async function handleNotif() {
    if (!selectedSub || !notifMsg.trim())
      return toast('Selecione um servidor e digite a mensagem', 'error');
    try {
      await api('/api/notifications', 'POST', {
        guildId: selectedSub.guildId,
        botId: selectedSub.botId,
        message: notifMsg,
      });
      toast('Notificação enfileirada!', 'success');
      setNotifMsg('');
    } catch (e) {
      toast(`Erro: ${e.message}`, 'error');
    }
  }

  return (
    <div>
      <div className="section-title" style={{ marginBottom: 16 }}>
        Broadcast de notificações
      </div>

      {/* BROADCAST GERAL */}
      <div className="broadcast-box">
        <h3>📢 Enviar para todos os servidores</h3>
        <textarea
          className="txt"
          placeholder="Digite a mensagem que será enviada para todos os bots..."
          value={broadcastMsg}
          onChange={(e) => setBroadcastMsg(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-accent" onClick={handleBroadcast}>
            Enviar broadcast
          </button>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>{broadcastStatus}</span>
        </div>
      </div>

      {/* NOTIFICAÇÃO ESPECÍFICA */}
      <div style={{ marginTop: 20 }}>
        <div className="broadcast-box">
          <h3>🎯 Enviar para servidor específico</h3>

          {loadingSubs ? (
            <div className="loading" style={{ padding: '12px 0' }}>
              <div className="spin" /> Carregando servidores...
            </div>
          ) : subs.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 10 }}>
              Nenhuma assinatura ativa encontrada.
            </p>
          ) : (
            <>
              {/* SELECT de servidor */}
              <div className="notif-select-wrap">
                <select
                  className="notif-select"
                  value={selectedGuildId}
                  onChange={(e) => setSelectedGuildId(e.target.value)}
                >
                  {subs.map((s) => (
                    <option key={s.guildId} value={s.guildId}>
                      {s.guildName || s.guildId}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detalhes preenchidos automaticamente */}
              {selectedSub && (
                <div className="notif-meta">
                  <span>Guild ID: <strong>{selectedSub.guildId}</strong></span>
                  <span>Bot ID: <strong>{selectedSub.botId || '—'}</strong></span>
                </div>
              )}
            </>
          )}

          <textarea
            className="txt"
            placeholder="Mensagem..."
            style={{ minHeight: 80, marginTop: 10 }}
            value={notifMsg}
            onChange={(e) => setNotifMsg(e.target.value)}
          />
          <button
            className="btn btn-accent"
            style={{ marginTop: 10 }}
            onClick={handleNotif}
            disabled={!selectedSub}
          >
            Enviar notificação
          </button>
        </div>
      </div>
    </div>
  );
}