// src/pages/NotificationsPage.jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLog } from '../context/LogContext';
import { getGuildData, sendChannelMessage } from '../services/discordSync';
import './NotificationsPage.css';

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const IconHash = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 9H20M4 15H20M10 3L8 21M16 3L14 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconBroadcast = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6.34 6.34C4.22 8.46 4.22 15.54 6.34 17.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17.66 6.34C19.78 8.46 19.78 15.54 17.66 17.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3.51 3.51C-0.17 7.19 -0.17 16.81 3.51 20.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M20.49 3.51C24.17 7.19 24.17 16.81 20.49 20.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconTarget = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconChat = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15C21 15.53 20.79 16.04 20.41 16.41C20.04 16.79 19.53 17 19 17H7L3 21V5C3 4.47 3.21 3.96 3.59 3.59C3.96 3.21 4.47 3 5 3H19C19.53 3 20.04 3.21 20.41 3.59C20.79 3.96 21 4.47 21 5V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const IconWarning = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.29 3.86L1.82 18C1.64 18.31 1.55 18.67 1.55 19.03C1.55 19.39 1.64 19.74 1.82 20.05C2 20.36 2.26 20.62 2.57 20.8C2.88 20.98 3.23 21.07 3.59 21.07H20.41C20.77 21.07 21.12 20.98 21.43 20.8C21.74 20.62 22 20.36 22.18 20.05C22.36 19.74 22.45 19.39 22.45 19.03C22.45 18.67 22.36 18.31 22.18 18L13.71 3.86C13.53 3.55 13.27 3.3 12.96 3.12C12.65 2.95 12.3 2.86 11.95 2.86C11.6 2.86 11.25 2.95 10.94 3.12C10.63 3.3 10.37 3.55 10.29 3.86Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const IconClose = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconMegaphone = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 11V13C3 14.1 3.9 15 5 15H7L10 21H12L12 15L19 18V6L12 9V3H10L7 9H5C3.9 9 3 9.9 3 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export default function NotificationsPage({ isAdmin }) {
  const { user, subscription: linkedSub, subscriptionLoading } = useAuth();
  const { toast } = useToast();
  const { addLog } = useLog();

  // ── Broadcast ──────────────────────────────────────────
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastStatus, setBroadcastStatus] = useState('');

  // ── Assinaturas / select ───────────────────────────────
  const [subs, setSubs] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [selectedGuildId, setSelectedGuildId] = useState('');
  const [notifMsg, setNotifMsg] = useState('');

  // ── Enviar mensagem para canal (só cliente) ────────────
  const [discordData, setDiscordData] = useState(null);
  const [loadingDiscord, setLoadingDiscord] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [channelMsg, setChannelMsg] = useState('');
  const [embedJson, setEmbedJson] = useState('');
  const [embedError, setEmbedError] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Carrega assinaturas
  useEffect(() => {
    // Aguarda o AuthContext resolver (isAdmin undefined = ainda carregando)
    if (isAdmin === undefined) return;

    if (!isAdmin) {
      // Cliente: aguarda AuthContext terminar de buscar a subscription
      if (user === undefined || subscriptionLoading) return;
      if (linkedSub && linkedSub.paymentStatus === 'paid') {
        setSubs([linkedSub]);
        setSelectedGuildId(linkedSub.guildId);
      } else {
        setSubs([]);
      }
      setLoadingSubs(false);
      return;
    }
    // Admin: carrega todas as assinaturas pagas
    api('/api/subscriptions')
      .then((data) => {
        const actives = data.filter((s) => s.paymentStatus === 'paid');
        setSubs(actives);
        if (actives.length > 0) setSelectedGuildId(actives[0].guildId);
      })
      .catch(() => toast('Erro ao carregar servidores', 'error'))
      .finally(() => setLoadingSubs(false));
  }, [isAdmin, linkedSub, user, subscriptionLoading]);

  const selectedSub = subs.find((s) => s.guildId === selectedGuildId) || null;

  // Carrega canais do Discord quando troca de servidor (só cliente)
  useEffect(() => {
    if (isAdmin || !selectedGuildId) return;
    setLoadingDiscord(true);
    setDiscordData(null);
    setSelectedChannelId('');
    setChannelMsg('');
    setEmbedJson('');
    getGuildData(selectedGuildId)
      .then(setDiscordData)
      .catch(() => toast('Erro ao carregar canais do servidor', 'error'))
      .finally(() => setLoadingDiscord(false));
  }, [selectedGuildId, isAdmin]);

  // Canais de texto disponíveis para envio (tipo 0 = texto, tipo 5 = anúncio)
  const textChannels = (discordData?.channels || []).filter(c => c.type === 0 || c.type === 5);

  // ── Handlers ───────────────────────────────────────────
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

  async function handleSendChannelMsg() {
    if (!selectedChannelId) return toast('Selecione um canal', 'error');
    if (!channelMsg.trim() && !embedJson.trim()) return toast('Digite uma mensagem ou cole um embed JSON', 'error');

    let parsedEmbed = null;
    if (embedJson.trim()) {
      try {
        parsedEmbed = JSON.parse(embedJson.trim());
        setEmbedError('');
      } catch {
        setEmbedError('JSON inválido — verifique a sintaxe');
        return;
      }
    }

    setSendingMsg(true);
    try {
      await sendChannelMessage(selectedGuildId, selectedChannelId, channelMsg, parsedEmbed);
      const ch = textChannels.find(c => c.id === selectedChannelId);
      toast(`Mensagem enviada para #${ch?.name || selectedChannelId}!`, 'success');
      addLog('channel-msg', 'success', `Mensagem enviada para #${ch?.name}`);
      setChannelMsg('');
      setEmbedJson('');
      setEmbedError('');
    } catch (e) {
      toast(`Erro ao enviar: ${e.message}`, 'error');
    } finally {
      setSendingMsg(false);
    }
  }

  // ── Listas filtradas ───────────────────────────────────

  // ── Render ─────────────────────────────────────────────
  return (
    <div>
      <div className="section-title" style={{ marginBottom: 16 }}>
        Broadcast de notificações
      </div>

      {/* BROADCAST GERAL — só admin */}
      {isAdmin && (
        <div className="broadcast-box">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 7 }}><IconBroadcast size={15} /> Enviar para todos os servidores</h3>
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
      )}

      {/* NOTIFICAÇÃO ESPECÍFICA */}
      <div style={{ marginTop: isAdmin ? 20 : 0 }}>
        {isAdmin && (
          <div className="broadcast-box">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 7 }}><IconTarget size={15} /> Enviar para servidor específico</h3>

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
              placeholder="Mensagem (enviada via DM para o dono do bot)..."
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
        )
        }</div>

      {/* ── ENVIAR MENSAGEM PARA CANAL — só cliente ── */}
      {!isAdmin && selectedSub && (
        <div style={{ marginTop: 20 }}>
          <div className="broadcast-box">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <IconChat size={15} /> Enviar mensagem para canal do Discord
            </h3>

            {loadingDiscord ? (
              <div className="loading" style={{ padding: '12px 0' }}>
                <div className="spin" /> Carregando canais...
              </div>
            ) : !discordData ? (
              <p style={{ fontSize: 13, color: 'var(--text3)' }}>
                Nenhum dado sincronizado. Aguarde o bot enviar os dados.
              </p>
            ) : textChannels.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text3)' }}>
                Nenhum canal de texto encontrado.
              </p>
            ) : (
              <>
                <div className="notif-select-wrap" style={{ marginBottom: 10 }}>
                  <select
                    className="notif-select"
                    value={selectedChannelId}
                    onChange={(e) => setSelectedChannelId(e.target.value)}
                  >
                    <option value=""> Selecione um canal </option>
                    {textChannels.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.type === 5 ? '» ' : '# '}{c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  className="txt"
                  placeholder="Mensagem de texto (opcional se usar embed)..."
                  style={{ minHeight: 80 }}
                  value={channelMsg}
                  onChange={(e) => setChannelMsg(e.target.value)}
                />

                {/* Embed JSON */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: "'Sora', sans-serif" }}>
                      Embed JSON <span style={{ opacity: 0.6 }}>(opcional)</span>
                    </span>
                    {embedJson && (
                      <button
                        style={{ fontSize: 11, color: 'var(--text3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 3 }}
                        onClick={() => { setEmbedJson(''); setEmbedError(''); }}
                      >
                        <IconClose size={10} /> limpar
                      </button>
                    )}
                  </div>
                  <textarea
                    className="txt"
                    style={{
                      minHeight: 110,
                      fontFamily: "'Courier New', monospace",
                      fontSize: 12,
                      borderColor: embedError ? 'rgba(255,80,80,0.45)' : undefined,
                    }}
                    placeholder={'{\n  "title": "Título do embed",\n  "description": "Descrição...",\n  "color": 54015\n}'}
                    value={embedJson}
                    onChange={(e) => { setEmbedJson(e.target.value); setEmbedError(''); }}
                    spellCheck={false}
                  />
                  {embedError && (
                    <p style={{ fontSize: 12, color: '#ff6060', marginTop: 4, fontFamily: "'Sora', sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}>
                      <IconWarning size={13} /> {embedError}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                  <button className="btn btn-embed">
                    <a href="https://neurabot.com.br/GeradorEmbed/" target="_blank">
                      Gerar Embed
                    </a>
                  </button>
                  <button
                    className="btn btn-accent"
                    onClick={handleSendChannelMsg}
                    disabled={sendingMsg || !selectedChannelId || (!channelMsg.trim() && !embedJson.trim())}
                  >
                    {sendingMsg ? 'Enviando...' : 'Enviar no canal'}
                  </button>
                  {selectedChannelId && (
                    <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                      #{textChannels.find(c => c.id === selectedChannelId)?.name}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}