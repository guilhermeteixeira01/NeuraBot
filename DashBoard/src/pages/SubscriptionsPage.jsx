// src/pages/SubscriptionsPage.jsx

import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLog } from '../context/LogContext';
import './SubscriptionsPage.css';

export default function SubscriptionsPage({
  refreshTrigger,
  filter: externalFilter
}) {

  const { toast } = useToast();
  const { addLog } = useLog();

  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(externalFilter || null);

  // modal edição
  const [editing, setEditing] = useState(null);

  const load = useCallback(async (f) => {
    setLoading(true);

    try {
      let data = await api('/api/subscriptions');

      if (f) {
        data = data.filter(
          (s) => s.paymentStatus === f
        );
      }

      setSubs(data);

      addLog(
        'api',
        'info',
        `${data.length} assinaturas carregadas`
      );

    } catch (e) {
      setSubs([]);

      addLog(
        'api',
        'error',
        e.message
      );

    } finally {
      setLoading(false);
    }

  }, [addLog]);

  useEffect(() => {
    load(externalFilter || filter);
  }, [load, refreshTrigger, externalFilter]);

  // =========================
  // RENOVAR
  // =========================

  async function registerPayment(guildId, price) {
    if (!confirm(
      `Registrar pagamento de R$ ${price} para ${guildId}?`
    )) return;

    try {
      const r = await api(
        '/api/payments',
        'POST',
        {
          guildId,
          amount: price,
          paymentMethod: 'manual'
        }
      );

      toast(
        r.message || 'Pagamento registrado!',
        'success'
      );

      load(filter);

    } catch (e) {
      toast(`Erro: ${e.message}`, 'error');
    }
  }

  // =========================
  // DELETE
  // =========================

  async function deleteSub(guildId) {
    if (!confirm(
      `Deletar assinatura de ${guildId}?`
    )) return;

    try {
      await api(
        `/api/subscriptions/${guildId}`,
        'DELETE'
      );

      toast(
        'Assinatura removida',
        'success'
      );

      load(filter);

    } catch (e) {
      toast(`Erro: ${e.message}`, 'error');
    }
  }

  // =========================
  // UPDATE
  // =========================

  async function saveEdit() {
    try {

      await api(
        `/api/subscriptions/${editing.guildId}`,
        'PUT',
        {
          price: editing.price,
          paymentStatus: editing.paymentStatus,
          startDate: editing.startDate,
          endDate: editing.endDate,
        }
      );

      toast(
        'Assinatura atualizada!',
        'success'
      );

      setEditing(null);

      load(filter);

    } catch (e) {
      toast(
        `Erro: ${e.message}`,
        'error'
      );
    }
  }

  const STATUS_CLS = {
    paid: 'sub-status-paid',
    pending: 'sub-status-pending',
    expired: 'sub-status-expired',
  };

  return (
    <div>

      {/* HEADER */}

      <div className="section-header">
        <div className="section-title">
          Assinaturas
        </div>

        <button
          className="btn btn-sm"
          onClick={() => load(filter)}
        >
          ↻ Recarregar
        </button>
      </div>

      {/* GRID */}

      <div className="subs-grid">

        {loading && (
          <div className="loading">
            <div className="spin" />
            Buscando...
          </div>
        )}

        {!loading && subs.length === 0 && (
          <div
            className="loading"
            style={{
              color: 'var(--text3)'
            }}
          >
            Nenhuma assinatura encontrada
          </div>
        )}

        {!loading && subs.map((s) => {

          const end = s.endDate
            ? new Date(s.endDate)
              .toLocaleDateString('pt-BR')
            : '—';

          const stCls =
            STATUS_CLS[s.paymentStatus]
            || 'badge-offline';

          return (
            <div
              className="sub-card"
              key={s.guildId}
            >

              {/* BOT IMAGE */}

              <img
                src={
                  s.botAvatar ||
                  'https://cdn-icons-png.flaticon.com/512/4712/4712109.png'
                }
                alt="bot"
                className="sub-avatar"
              />

              {/* INFO */}

              <div className="sub-info">

                <div className="sub-name">
                  {s.guildName || s.guildId}
                </div>

                <div className="sub-meta">
                  ID: {s.guildId}
                  {' · '}
                  Bot: {s.botId || '—'}
                  {' · '}
                  Vence: {end}
                </div>

              </div>

              {/* PRICE + STATUS */}

              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  flexShrink: 0
                }}
              >

                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--green)'
                  }}
                >
                  R$ {Number(
                    s.price || 0
                  ).toFixed(2)}
                </span>

                <span
                  className={`badge ${stCls}`}
                >
                  {s.paymentStatus}
                </span>

              </div>

              {/* ACTIONS */}

              <div
                style={{
                  display: 'flex',
                  gap: 5,
                  flexShrink: 0
                }}
              >

                <button
                  className="btn btn-sm"
                  onClick={() =>
                    registerPayment(
                      s.guildId,
                      s.price || 0
                    )
                  }
                >
                  💰 Renovar
                </button>

                <button
                  className="btn btn-sm"
                  onClick={() => setEditing({
                    ...s
                  })}
                >
                  ✏ Editar
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() =>
                    deleteSub(s.guildId)
                  }
                >
                  🗑
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL EDIT */}

      {editing && (
        <div className="modal-overlay">

          <div className="modal-card">

            <h3>
              Editar assinatura
            </h3>

            <div className="form-group">
              <label>Preço</label>

              <input
                type="number"
                value={editing.price || ''}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    price: e.target.value
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                value={editing.paymentStatus}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    paymentStatus: e.target.value
                  })
                }
              >
                <option value="paid">
                  paid
                </option>

                <option value="pending">
                  pending
                </option>

                <option value="expired">
                  expired
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Data início</label>

              <input
                type="date"
                value={
                  editing.startDate
                    ?.slice(0, 10) || ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    startDate: e.target.value
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Data final</label>

              <input
                type="date"
                value={
                  editing.endDate
                    ?.slice(0, 10) || ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    endDate: e.target.value
                  })
                }
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 20
              }}
            >

              <button
                className="btn"
                onClick={saveEdit}
              >
                Salvar
              </button>

              <button
                className="btn btn-danger"
                onClick={() => setEditing(null)}
              >
                Cancelar
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}