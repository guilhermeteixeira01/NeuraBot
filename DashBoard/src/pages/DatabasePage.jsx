// src/pages/DatabasePage.jsx
import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import './DatabasePage.css';

export default function DatabasePage({ refreshTrigger, onNavigateToSubs }) {
  const { toast } = useToast();
  const [stats, setStats] = useState({ total: '—', paid: '—', pend: '—', exp: '—', revenue: '—' });
  const [queryResult, setQueryResult] = useState('');

  const loadStats = useCallback(async () => {
    try {
      const subs = await api('/api/subscriptions');
      const paid = subs.filter((s) => s.paymentStatus === 'paid');
      const pend = subs.filter((s) => s.paymentStatus === 'pending');
      const exp  = subs.filter((s) => s.paymentStatus === 'expired');
      const rev  = paid.reduce((acc, s) => acc + Number(s.price || 0), 0);
      setStats({
        total:   subs.length,
        paid:    paid.length,
        pend:    pend.length,
        exp:     exp.length,
        revenue: `R$ ${rev.toFixed(2)}`,
      });
      setQueryResult(`Atualizado em ${new Date().toLocaleTimeString('pt-BR')} — ${subs.length} registros`);
      toast('Stats atualizadas', 'success');
    } catch (e) {
      toast(`Erro: ${e.message}`, 'error');
    }
  }, [toast]);

  useEffect(() => { loadStats(); }, [loadStats, refreshTrigger]);

  return (
    <div>
      <div className="section-title" style={{ marginBottom: 16 }}>MySQL — informações</div>

      <div className="db-grid">
        <div className="db-card">
          <h3>🗄️ Conexão</h3>
          {[
            ['Host',      '192.99.119.161'],
            ['Porta',     '3306'],
            ['Banco',     'neurabot'],
            ['Usuário',   'neurabot'],
            ['API porta', '3301'],
          ].map(([k, v]) => (
            <div className="db-row" key={k}>
              <span className="db-row-key">{k}</span>
              <span className="db-row-val">{v}</span>
            </div>
          ))}
        </div>

        <div className="db-card">
          <h3>📊 Assinaturas</h3>
          <div className="db-row"><span className="db-row-key">Total</span><span className="db-row-val">{stats.total}</span></div>
          <div className="db-row"><span className="db-row-key">Pagas</span><span className="db-row-val" style={{ color: 'var(--green)' }}>{stats.paid}</span></div>
          <div className="db-row"><span className="db-row-key">Pendentes</span><span className="db-row-val" style={{ color: 'var(--yellow)' }}>{stats.pend}</span></div>
          <div className="db-row"><span className="db-row-key">Expiradas</span><span className="db-row-val" style={{ color: 'var(--red)' }}>{stats.exp}</span></div>
          <div className="db-row"><span className="db-row-key">Receita total</span><span className="db-row-val" style={{ color: 'var(--green)' }}>{stats.revenue}</span></div>
        </div>
      </div>

      <div className="broadcast-box">
        <h3 style={{ marginBottom: 12, fontSize: 13, fontWeight: 600 }}>⚡ Query rápida via API</h3>
        <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 12 }}>
          Use os filtros de assinatura abaixo — queries diretas não são suportadas pela API REST.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-sm" onClick={() => onNavigateToSubs('paid')}>Ver pagas</button>
          <button className="btn btn-sm" onClick={() => onNavigateToSubs('pending')}>Ver pendentes</button>
          <button className="btn btn-sm" onClick={() => onNavigateToSubs('expired')}>Ver expiradas</button>
          <button className="btn btn-sm" onClick={loadStats}>↻ Atualizar stats</button>
        </div>
        <div style={{ marginTop: 14, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)' }}>
          {queryResult}
        </div>
      </div>
    </div>
  );
}
