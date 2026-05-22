// src/pages/NotificationsPage.jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLog } from '../context/LogContext';
import { getGuildData, sendChannelMessage } from '../services/discordSync';
import './NotificationsPage.css';

const CHANNEL_ICON = { 0: '#', 2: '🔊', 4: '📁', 5: '📣', 15: '📋' };

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

  // ── Discord data (só cliente) ──────────────────────────
  const [discordData, setDiscordData] = useState(null);
  const [loadingDiscord, setLoadingDiscord] = useState(false);
  const [discordTab, setDiscordTab] = useState('channels');
  const [discordSearch, setDiscordSearch] = useState('');

  // ── Enviar mensagem para canal ─────────────────────────
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [channelMsg, setChannelMsg] = useState('');
  const [embedJson, setEmbedJson] = useState('');
  const [embedError, setEmbedError] = useState('');
  const [channelSearch, setChannelSearch] = useState('');
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

  // Carrega dados do Discord quando troca de servidor (só cliente)
  // Nota: não inclui isAdmin nas deps para evitar que o efeito não dispare
  // quando selectedGuildId já está setado mas isAdmin acabou de resolver p/ false
  useEffect(() => {
    // isAdmin === true  → admin não precisa de dados do Discord
    // isAdmin === undefined → ainda carregando, aguarda
    if (isAdmin || !selectedGuildId) return;
    setLoadingDiscord(true);
    setDiscordData(null);
    setDiscordSearch('');
    setSelectedChannelId('');
    setChannelMsg('');
    setEmbedJson('');
    getGuildData(selectedGuildId)
      .then(setDiscordData)
      .catch(() => toast('Erro ao carregar dados do servidor Discord', 'error'))
      .finally(() => setLoadingDiscord(false));
  }, [selectedGuildId, isAdmin]); // isAdmin é mantido para reagir quando resolve de undefined→false

  const selectedSub = subs.find((s) => s.guildId === selectedGuildId) || null;

  // Canais de texto disponíveis para envio (tipo 0 = texto, tipo 5 = anúncio)
  const textChannels = (discordData?.channels || []).filter(c => c.type === 0 || c.type === 5);

  // Canais filtrados pelo campo de busca do painel de envio
  const filteredTextChannels = textChannels.filter(c =>
    c.name.toLowerCase().includes(channelSearch.toLowerCase())
  );

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

    // Valida JSON do embed se preenchido
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
  const q = discordSearch.toLowerCase();

  const filteredChannels = (discordData?.channels || []).filter(c =>
    c.name.toLowerCase().includes(q)
  );

  const filteredMembers = (discordData?.members || []).filter(m =>
    !m.bot && (
      m.username.toLowerCase().includes(q) ||
      m.displayName.toLowerCase().includes(q)
    )
  );

  const filteredRoles = (discordData?.roles || [])
    .filter(r => r.name.toLowerCase().includes(q))
    .sort((a, b) => b.position - a.position);

  // ── Render ─────────────────────────────────────────────
  return (
    <div>
      <div className="section-title" style={{ marginBottom: 16 }}>
        Broadcast de notificações
      </div>

      {/* BROADCAST GERAL — só admin */}
      {isAdmin && (
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
      )}

      {/* NOTIFICAÇÃO ESPECÍFICA */}
      <div style={{ marginTop: isAdmin ? 20 : 0 }}>
        {isAdmin && (
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
            <h3>💬 Enviar mensagem para canal do Discord</h3>

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
                {/* Busca + Select de canal */}
                <input
                  className="field-input"
                  style={{ width: '100%', marginBottom: 6, boxSizing: 'border-box' }}
                  placeholder="🔍 Filtrar canal..."
                  value={channelSearch}
                  onChange={(e) => {
                    setChannelSearch(e.target.value);
                    setSelectedChannelId(''); // limpa seleção ao filtrar
                  }}
                />
                <div className="notif-select-wrap" style={{ marginBottom: 10 }}>
                  <select
                    className="notif-select"
                    value={selectedChannelId}
                    onChange={(e) => setSelectedChannelId(e.target.value)}
                  >
                    <option value="">— Selecione um canal —</option>
                    {filteredTextChannels.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.type === 5 ? '📣' : '#'} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                {filteredTextChannels.length === 0 && channelSearch && (
                  <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>
                    Nenhum canal corresponde a "{channelSearch}".
                  </p>
                )}

                {/* Mensagem de texto */}
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
                        style={{ fontSize: 11, color: 'var(--text3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() => { setEmbedJson(''); setEmbedError(''); }}
                      >
                        ✕ limpar
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
                    <p style={{ fontSize: 12, color: '#ff6060', marginTop: 4, fontFamily: "'Sora', sans-serif" }}>
                      ⚠ {embedError}
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

      {/* ── DADOS DO DISCORD — só para clientes ── */}
      {!isAdmin && selectedSub && (
        <div style={{ marginTop: 20 }}>
          <div className="broadcast-box">

            <div className="dc-header">
              <h3 style={{ margin: 0 }}>🖥️ Dados do servidor Discord</h3>
              {discordData && (
                <span className="dc-timestamp">
                  Atualizado: {new Date(discordData.timestamp).toLocaleString('pt-BR')}
                </span>
              )}
            </div>

            {discordData && (
              <div className="dc-summary">
                {[
                  { val: discordData.summary.totalChannels, label: 'Canais' },
                  { val: discordData.summary.humans, label: 'Membros' },
                  { val: discordData.summary.bots, label: 'Bots' },
                  { val: discordData.summary.totalRoles, label: 'Cargos' },
                ].map(({ val, label }) => (
                  <div key={label} className="dc-stat">
                    <span className="dc-stat-val">{val}</span>
                    <span className="dc-stat-label">{label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="dc-tabs">
              {[
                { id: 'channels', label: '# Canais' },
                { id: 'members', label: '👤 Membros' },
                { id: 'roles', label: '🏷️ Cargos' },
              ].map(t => (
                <button
                  key={t.id}
                  className={`dc-tab${discordTab === t.id ? ' active' : ''}`}
                  onClick={() => { setDiscordTab(t.id); setDiscordSearch(''); }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {discordData && (
              <input
                className="field-input dc-search"
                placeholder={
                  discordTab === 'channels' ? 'Buscar canal...' :
                    discordTab === 'members' ? 'Buscar membro...' : 'Buscar cargo...'
                }
                value={discordSearch}
                onChange={(e) => setDiscordSearch(e.target.value)}
              />
            )}

            {loadingDiscord ? (
              <div className="loading" style={{ padding: '16px 0' }}>
                <div className="spin" /> Carregando dados do Discord...
              </div>
            ) : !discordData ? (
              <p className="dc-empty">
                Nenhum dado sincronizado ainda. Aguarde o bot enviar os dados.
              </p>
            ) : (
              <div className="dc-list">

                {discordTab === 'channels' && (
                  filteredChannels.length === 0
                    ? <p className="dc-empty">Nenhum canal encontrado.</p>
                    : filteredChannels.map(c => (
                      <div key={c.id} className="dc-item">
                        <span className="dc-item-icon">{CHANNEL_ICON[c.type] || '#'}</span>
                        <span className="dc-item-name">{c.name}</span>
                        {c.topic && (
                          <span className="dc-item-meta" title={c.topic}>
                            {c.topic.slice(0, 45)}{c.topic.length > 45 ? '…' : ''}
                          </span>
                        )}
                      </div>
                    ))
                )}

                {discordTab === 'members' && (
                  filteredMembers.length === 0
                    ? <p className="dc-empty">Nenhum membro encontrado.</p>
                    : filteredMembers.map(m => (
                      <div key={m.id} className="dc-item">
                        <img
                          src={m.avatar}
                          alt=""
                          className="dc-avatar"
                          onError={e => { e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }}
                        />
                        <div className="dc-item-info">
                          <span className="dc-item-name">{m.displayName}</span>
                          <span className="dc-item-meta">@{m.username}</span>
                        </div>
                        <div className="dc-roles-wrap">
                          {m.roles.slice(0, 3).map(r => (
                            <span key={r.id} className="dc-role-badge">{r.name}</span>
                          ))}
                          {m.roles.length > 3 && (
                            <span className="dc-role-badge">+{m.roles.length - 3}</span>
                          )}
                        </div>
                      </div>
                    ))
                )}

                {discordTab === 'roles' && (
                  filteredRoles.length === 0
                    ? <p className="dc-empty">Nenhum cargo encontrado.</p>
                    : filteredRoles.map(r => (
                      <div key={r.id} className="dc-item">
                        <span
                          className="dc-role-dot"
                          style={{ background: r.color === '#000000' ? '#555' : r.color }}
                        />
                        <span className="dc-item-name">{r.name}</span>
                        <span className="dc-item-meta">
                          {r.memberCount} membro{r.memberCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    ))
                )}

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}