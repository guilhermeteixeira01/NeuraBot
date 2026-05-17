// src/pages/SubscriptionsPage.jsx

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLog } from '../context/LogContext';
import './SubscriptionsPage.css';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCpfCnpj(value) {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

// ─── Modal de Cobrança Asaas ─────────────────────────────────────────────────

function BillingModal({ sub, onClose }) {
  const { toast } = useToast();

  // 'loading_charges' → busca faturas em aberto
  // 'existing'        → mostra fatura pendente encontrada
  // 'choose'          → escolhe método de pagamento
  // 'form'            → preenche dados
  // 'result'          → exibe resultado gerado
  const [step, setStep] = useState('loading_charges');
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [existingCharge, setExistingCharge] = useState(null);
  const [paid, setPaid] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const pollRef = useRef(null);

  // ── Polling: verifica status após gerar cobrança ──────────────────────────
  useEffect(() => {
    if (step !== 'result' || paid) return;

    // Cartão confirma na hora, não precisa polling
    if (method === 'CREDIT_CARD') {
      setPaid(true);
      return;
    }

    let attempts = 0;
    const MAX = 60; // ~5 minutos (60 × 5s)

    pollRef.current = setInterval(async () => {
      attempts++;
      setPollCount(attempts);
      try {
        const subData = await api(`/api/subscriptions/by-email/${sub.dashboardEmail}`);
        if (subData?.paymentStatus === 'paid') {
          clearInterval(pollRef.current);
          setPaid(true);
          toast('🎉 Pagamento confirmado! Assinatura renovada.', 'success');
        }
      } catch { /* silencia erros de polling */ }

      if (attempts >= MAX) clearInterval(pollRef.current);
    }, 5000);

    return () => clearInterval(pollRef.current);
  }, [step, paid, method, sub.dashboardEmail]);

  // Limpa polling ao fechar
  function handleClose() {
    clearInterval(pollRef.current);
    onClose();
  }

  // Dados do formulário
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [ownerName, setOwnerName] = useState('');

  // Dados de cartão (só para CREDIT_CARD)
  const [card, setCard] = useState({
    holderName: '',
    number: '',
    expiry: '',
    ccv: '',
  });

  // ── Busca faturas pendentes ao abrir ──────────────────────────────────────
  useEffect(() => {
    async function fetchPending() {
      try {
        const charges = await api(`/api/billing/${sub.guildId}`);
        const pending = charges.find(
          (c) => c.status === 'PENDING' || c.status === 'OVERDUE'
        );
        if (pending) {
          setExistingCharge(pending);
          setStep('existing');
        } else {
          setStep('choose');
        }
      } catch {
        // Se falhar ao buscar, vai direto pro fluxo normal
        setStep('choose');
      }
    }
    fetchPending();
  }, [sub.guildId]);

  // ── Cancelar fatura existente ─────────────────────────────────────────────
  async function handleCancelCharge() {
    if (!confirm('Cancelar esta fatura e gerar uma nova?')) return;
    setLoading(true);
    try {
      await api(`/api/billing/cancel/${existingCharge.chargeId}`, 'DELETE');
      toast('Fatura cancelada!', 'success');
      setExistingCharge(null);
      setStep('choose');
    } catch (e) {
      toast(`Erro ao cancelar: ${e.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── Selecionar método ─────────────────────────────────────────────────────
  function handleMethodSelect(m) {
    setMethod(m);
    setStep('form');
  }

  // ── Gerar nova cobrança ───────────────────────────────────────────────────
  async function handleSubmit() {
    const rawCpf = cpfCnpj.replace(/\D/g, '');
    if (!ownerName.trim()) {
      toast('Informe o nome completo.', 'error');
      return;
    }
    if (rawCpf.length < 11) {
      toast('CPF/CNPJ inválido.', 'error');
      return;
    }
    if (method === 'CREDIT_CARD') {
      if (!card.holderName || !card.number || !card.expiry || !card.ccv) {
        toast('Preencha todos os dados do cartão.', 'error');
        return;
      }
    }

    setLoading(true);
    try {
      const body = {
        guildId: sub.guildId,
        ownerName: ownerName.trim(),
        ownerEmail: sub.dashboardEmail || undefined,
        cpfCnpj: rawCpf,
        amount: sub.price,
        billingType: method,
        description: `Assinatura ${sub.guildName || sub.guildId} - 30 dias`,
      };

      if (method === 'CREDIT_CARD') {
        const [expMonth, expYear] = card.expiry.split('/');
        body.creditCard = {
          holderName: card.holderName,
          number: card.number.replace(/\s/g, ''),
          expiryMonth: expMonth?.trim(),
          expiryYear: expYear?.trim(),
          ccv: card.ccv,
        };
        body.creditCardHolderInfo = {
          name: ownerName.trim(),
          cpfCnpj: rawCpf,
          email: sub.dashboardEmail || undefined,
        };
      }

      const data = await api('/api/billing/create', 'POST', body);
      setResult(data);
      setStep('result');
    } catch (e) {
      toast(`Erro: ${e.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast('Copiado!', 'success');
    } catch {
      toast('Não foi possível copiar.', 'error');
    }
  }

  const METHOD_LABELS = {
    PIX: { icon: '⚡', label: 'PIX', desc: 'Pagamento instantâneo' },
    BOLETO: { icon: '🏦', label: 'Boleto', desc: 'Vence em 3 dias úteis' },
    CREDIT_CARD: { icon: '💳', label: 'Cartão de Crédito', desc: 'Débito imediato' },
  };

  const BILLING_ICONS = { PIX: '⚡', BOLETO: '🏦', CREDIT_CARD: '💳' };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 480, width: '100%' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>
            {step === 'loading_charges' && '⏳ Verificando faturas...'}
            {step === 'existing' && '📄 Fatura em Aberto'}
            {step === 'choose' && '💰 Gerar Cobrança'}
            {step === 'form' && `${METHOD_LABELS[method]?.icon} Pagar via ${METHOD_LABELS[method]?.label}`}
            {step === 'result' && '✅ Cobrança Gerada'}
          </h3>
          <button
            className="btn btn-sm btn-danger"
            onClick={handleClose}
            style={{ padding: '4px 10px' }}
          >
            ✕
          </button>
        </div>

        {/* ── Identidade do bot ── */}
        <div style={{ background: 'var(--bg3, #1e1e2e)', borderRadius: 10, marginBottom: 20, overflow: 'hidden' }}>
          {sub.botBannerUrl && (
            <img
              src={sub.botBannerUrl}
              alt="banner"
              style={{ width: '100%', height: 64, objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
            <img
              src={sub.botImgPerfil || sub.botAvatar || 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png'}
              alt="bot"
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              onError={(e) => { e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png'; }}
            />
            <span style={{ color: 'var(--text2)', fontSize: 14, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {sub.guildName || sub.guildId}
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700, color: 'var(--green)', flexShrink: 0 }}>
              R$ {Number(sub.price || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* ── STEP: LOADING ── */}
        {step === 'loading_charges' && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, padding: '20px 0', color: 'var(--text3)' }}>
            <div className="spin" />
            Verificando faturas em aberto...
          </div>
        )}

        {/* ── STEP: FATURA EXISTENTE ── */}
        {step === 'existing' && existingCharge && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Info da fatura */}
            <div style={{
              background: 'var(--bg3, #1e1e2e)',
              borderRadius: 10,
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              border: '1px solid var(--yellow, #f0a500)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 20 }}>{BILLING_ICONS[existingCharge.billingType] || '📄'}</span>
                <span style={{ fontWeight: 600, color: 'var(--text2)' }}>
                  {existingCharge.billingType === 'PIX' && 'PIX'}
                  {existingCharge.billingType === 'BOLETO' && 'Boleto Bancário'}
                  {existingCharge.billingType === 'CREDIT_CARD' && 'Cartão de Crédito'}
                </span>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: existingCharge.status === 'OVERDUE' ? 'var(--red, #e74c3c)' : 'var(--yellow, #f0a500)',
                  color: '#fff',
                }}>
                  {existingCharge.status === 'OVERDUE' ? 'VENCIDA' : 'PENDENTE'}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text3)' }}>
                Valor: <strong style={{ color: 'var(--green)' }}>R$ {Number(existingCharge.value || 0).toFixed(2)}</strong>
              </div>
              {existingCharge.dueDate && (
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>
                  Vencimento: <strong style={{ color: 'var(--text2)' }}>
                    {new Date(existingCharge.dueDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </strong>
                </div>
              )}
            </div>

            {/* PIX pendente — mostra QR Code */}
            {existingCharge.billingType === 'PIX' && existingCharge.pixQrCode && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <img
                  src={`data:image/png;base64,${existingCharge.pixQrCode}`}
                  alt="QR Code PIX"
                  style={{ width: 180, height: 180, borderRadius: 10, border: '3px solid var(--green)' }}
                />
                {existingCharge.pixPayload && (
                  <>
                    <p style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center', margin: 0 }}>
                      Ou use o PIX Copia e Cola:
                    </p>
                    <div style={{
                      background: 'var(--bg3)',
                      borderRadius: 8,
                      padding: '10px 14px',
                      fontSize: 11,
                      fontFamily: 'var(--mono)',
                      wordBreak: 'break-all',
                      color: 'var(--text2)',
                      maxHeight: 80,
                      overflowY: 'auto',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}>
                      {existingCharge.pixPayload}
                    </div>
                    <button className="btn" style={{ width: '100%' }} onClick={() => copyToClipboard(existingCharge.pixPayload)}>
                      📋 Copiar código PIX
                    </button>
                  </>
                )}
              </div>
            )}

            {/* BOLETO pendente — link para visualizar */}
            {existingCharge.billingType === 'BOLETO' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {existingCharge.bankSlipUrl && (
                  <a
                    href={existingCharge.bankSlipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ textAlign: 'center', textDecoration: 'none' }}
                  >
                    🖨️ Visualizar / Imprimir Boleto
                  </a>
                )}
                {existingCharge.invoiceUrl && (
                  <a
                    href={existingCharge.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ textAlign: 'center', textDecoration: 'none' }}
                  >
                    🔗 Link da Fatura
                  </a>
                )}
              </div>
            )}

            {/* Botão cancelar e gerar nova */}
            <button
              className="btn btn-danger"
              onClick={handleCancelCharge}
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              {loading ? '⏳ Cancelando...' : '🗑 Cancelar e gerar nova cobrança'}
            </button>

          </div>
        )}

        {/* ── STEP: CHOOSE ── */}
        {step === 'choose' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(METHOD_LABELS).map(([key, { icon, label, desc }]) => (
              <button
                key={key}
                className="btn"
                onClick={() => handleMethodSelect(key)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', textAlign: 'left', fontSize: 15 }}
              >
                <span style={{ fontSize: 24 }}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 400 }}>{desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── STEP: FORM ── */}
        {step === 'form' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <div className="form-group">
              <label>Nome completo *</label>
              <input
                type="text"
                placeholder="Como está no CPF/CNPJ"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>CPF / CNPJ *</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
                maxLength={18}
              />
            </div>

            {method === 'CREDIT_CARD' && (
              <>
                <div className="form-group">
                  <label>Nome no cartão *</label>
                  <input
                    type="text"
                    placeholder="Como impresso no cartão"
                    value={card.holderName}
                    onChange={(e) => setCard({ ...card, holderName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Número do cartão *</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={card.number}
                    maxLength={19}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = v.replace(/(\d{4})(?=\d)/g, '$1 ');
                      setCard({ ...card, number: formatted });
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="form-group">
                    <label>Validade *</label>
                    <input
                      type="text"
                      placeholder="MM/AAAA"
                      value={card.expiry}
                      maxLength={7}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 6);
                        if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                        setCard({ ...card, expiry: v });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV *</label>
                    <input
                      type="text"
                      placeholder="000"
                      value={card.ccv}
                      maxLength={4}
                      onChange={(e) => setCard({ ...card, ccv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    />
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button
                className="btn"
                onClick={handleSubmit}
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading
                  ? (method === 'PIX' ? '⏳ Gerando QR Code...' : '⏳ Gerando...')
                  : '🚀 Gerar Cobrança'
                }
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setStep('choose')}
                disabled={loading}
              >
                ← Voltar
              </button>
            </div>

            {loading && method === 'PIX' && (
              <p style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center', margin: 0 }}>
                O QR Code PIX pode levar alguns segundos para ser gerado...
              </p>
            )}
          </div>
        )}

        {/* ── STEP: RESULT ── */}
        {step === 'result' && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* PIX */}
            {method === 'PIX' && result.pixData && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                {result.pixData.encodedImage && (
                  <img
                    src={`data:image/png;base64,${result.pixData.encodedImage}`}
                    alt="QR Code PIX"
                    style={{ width: 200, height: 200, borderRadius: 12, border: '3px solid var(--green)' }}
                  />
                )}
                {result.pixData.payload && (
                  <>
                    <p style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center', margin: 0 }}>
                      Ou copie o código PIX Copia e Cola:
                    </p>
                    <div style={{
                      background: 'var(--bg3)',
                      borderRadius: 8,
                      padding: '10px 14px',
                      fontSize: 11,
                      fontFamily: 'var(--mono)',
                      wordBreak: 'break-all',
                      color: 'var(--text2)',
                      maxHeight: 80,
                      overflowY: 'auto',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}>
                      {result.pixData.payload}
                    </div>
                    <button className="btn" style={{ width: '100%' }} onClick={() => copyToClipboard(result.pixData.payload)}>
                      📋 Copiar código PIX
                    </button>
                  </>
                )}
                {!result.pixData.payload && (
                  <p style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center' }}>
                    QR Code indisponível no momento. Tente novamente em instantes.
                  </p>
                )}
              </div>
            )}

            {/* BOLETO */}
            {method === 'BOLETO' && result.charge && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ color: 'var(--text2)', fontSize: 14, margin: 0 }}>
                  Boleto gerado com vencimento em{' '}
                  <strong>
                    {result.charge.dueDate
                      ? new Date(result.charge.dueDate + 'T12:00:00').toLocaleDateString('pt-BR')
                      : '—'}
                  </strong>.
                </p>
                {result.charge.bankSlipUrl && (
                  <a
                    href={result.charge.bankSlipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ textAlign: 'center', textDecoration: 'none' }}
                  >
                    🖨️ Visualizar / Imprimir Boleto
                  </a>
                )}
                {result.charge.invoiceUrl && (
                  <a
                    href={result.charge.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ textAlign: 'center', textDecoration: 'none' }}
                  >
                    🔗 Link da Fatura
                  </a>
                )}
              </div>
            )}

            {/* CARTÃO */}
            {method === 'CREDIT_CARD' && result.charge && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
                <p style={{ color: 'var(--text2)', margin: 0, fontWeight: 600 }}>
                  Pagamento com cartão processado!
                </p>
                <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 6 }}>
                  Status: <strong>{result.charge.status}</strong>
                </p>
              </div>
            )}

            {/* Indicador de aguardando pagamento */}
            {!paid && method !== 'CREDIT_CARD' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 10,
                background: 'var(--bg3, #1e1e2e)',
                border: '1px solid var(--yellow, #f0a500)',
                fontSize: 13,
                color: 'var(--text3)',
              }}>
                <div className="spin" style={{ flexShrink: 0 }} />
                <span>Aguardando confirmação do pagamento... ({pollCount > 0 ? `verificação ${pollCount}` : 'iniciando'})</span>
              </div>
            )}

            {/* Pagamento confirmado */}
            {paid && method !== 'CREDIT_CARD' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 10,
                background: 'var(--bg3, #1e1e2e)',
                border: '1px solid var(--green)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--green)',
              }}>
                ✅ Pagamento confirmado! Assinatura renovada.
              </div>
            )}

            <button className="btn btn-sm" onClick={handleClose} style={{ marginTop: 4 }}>
              Fechar
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── SubscriptionsPage ───────────────────────────────────────────────────────

export default function SubscriptionsPage({
  refreshTrigger,
  filter: externalFilter,
}) {
  const { user, isAdmin, subscription: linkedSub } = useAuth();
  const { toast } = useToast();
  const { addLog } = useLog();

  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(externalFilter || null);

  // Modal edição (admin)
  const [editing, setEditing] = useState(null);

  // Modal cobrança Asaas (usuário comum)
  const [billing, setBilling] = useState(null);

  const load = useCallback(async (f) => {
    setLoading(true);
    try {
      if (!isAdmin) {
        if (linkedSub) {
          setSubs([linkedSub]);
          addLog('api', 'info', `Assinatura carregada para ${linkedSub.dashboardEmail}`);
        } else {
          setSubs([]);
          addLog('api', 'warn', 'Nenhuma assinatura vinculada a este e-mail');
        }
        setLoading(false);
        return;
      }

      let data = await api('/api/subscriptions');
      if (f) data = data.filter((s) => s.paymentStatus === f);
      setSubs(data);
      addLog('api', 'info', `${data.length} assinaturas carregadas`);
    } catch (e) {
      setSubs([]);
      addLog('api', 'error', e.message);
    } finally {
      setLoading(false);
    }
  }, [addLog, isAdmin, linkedSub]);

  useEffect(() => {
    load(externalFilter || filter);
  }, [load, refreshTrigger, externalFilter]);

  // ── RENOVAR (admin) ──────────────────────────────────────────────────────

  async function registerPayment(guildId, price) {
    if (!confirm(`Registrar pagamento de R$ ${price} para ${guildId}?`)) return;
    try {
      const r = await api('/api/payments', 'POST', {
        guildId,
        amount: price,
        paymentMethod: 'manual',
      });
      toast(r.message || 'Pagamento registrado!', 'success');
      load(filter);
    } catch (e) {
      toast(`Erro: ${e.message}`, 'error');
    }
  }

  // ── DELETE (admin) ───────────────────────────────────────────────────────

  async function deleteSub(guildId) {
    if (!confirm(`Deletar assinatura de ${guildId}?`)) return;
    try {
      await api(`/api/subscriptions/${guildId}`, 'DELETE');
      toast('Assinatura removida', 'success');
      load(filter);
    } catch (e) {
      toast(`Erro: ${e.message}`, 'error');
    }
  }

  // ── UPDATE (admin) ───────────────────────────────────────────────────────

  async function saveEdit() {
    try {
      await api(`/api/subscriptions/${editing.guildId}`, 'PUT', {
        price: editing.price,
        paymentStatus: editing.paymentStatus,
        startDate: editing.startDate,
        endDate: editing.endDate,
      });
      toast('Assinatura atualizada!', 'success');
      setEditing(null);
      load(filter);
    } catch (e) {
      toast(`Erro: ${e.message}`, 'error');
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
        <div className="section-title">Assinaturas</div>
        <button className="btn btn-sm" onClick={() => load(filter)}>
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
          <div className="loading" style={{ color: 'var(--text3)' }}>
            Nenhuma assinatura encontrada
          </div>
        )}

        {!loading && subs.map((s) => {
          const end = s.endDate
            ? new Date(s.endDate).toLocaleDateString('pt-BR')
            : '—';
          const stCls = STATUS_CLS[s.paymentStatus] || 'badge-offline';

          const avatar =
            s.botImgPerfil ||
            s.botAvatar ||
            'https://cdn-icons-png.flaticon.com/512/4712/4712109.png';

          const banner = s.botBannerUrl || null;

          return (
            <div className="sub-card" key={s.guildId}>

              {/* BANNER + AVATAR SOBREPOSTO */}
              {banner ? (
                <div className="sub-banner-wrap">
                  <img
                    src={banner}
                    alt="banner"
                    className="sub-banner"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <img
                    src={avatar}
                    alt="bot"
                    className="sub-avatar"
                    onError={(e) => {
                      e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png';
                    }}
                  />
                </div>
              ) : null}

              {/* CORPO DO CARD */}
              <div className={`sub-card-body${banner ? ' has-banner' : ''}`}>

                {/* AVATAR sem banner */}
                {!banner && (
                  <img
                    src={avatar}
                    alt="bot"
                    className="sub-avatar"
                    onError={(e) => {
                      e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png';
                    }}
                  />
                )}

                {/* INFO */}
                <div className="sub-info">
                  <div className="sub-name">{s.guildName || s.guildId}</div>
                  <div className="sub-meta">
                    ID: {s.guildId}
                    {' · '}
                    Bot: {s.botId || '—'}
                    {' · '}
                    Vence: {end}
                  </div>
                </div>

                {/* PRICE + STATUS */}
                <div className="sub-price-row" style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>
                    R$ {Number(s.price || 0).toFixed(2)}
                  </span>
                  <span className={`badge ${stCls}`}>{s.paymentStatus}</span>
                </div>

                {/* ACTIONS */}
                <div className="sub-actions" style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  {isAdmin ? (
                    <>
                      <button className="btn btn-sm" onClick={() => registerPayment(s.guildId, s.price || 0)}>
                        💰 Renovar
                      </button>
                      <button className="btn btn-sm" onClick={() => setEditing({ ...s })}>
                        ✏ Editar
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteSub(s.guildId)}>
                        🗑
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-sm" onClick={() => setBilling(s)}>
                      💳 Gerar Cobrança
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL EDIÇÃO (admin) */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Editar assinatura</h3>

            <div className="form-group">
              <label>Preço</label>
              <input
                type="number"
                value={editing.price || ''}
                onChange={(e) => setEditing({ ...editing, price: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={editing.paymentStatus}
                onChange={(e) => setEditing({ ...editing, paymentStatus: e.target.value })}
              >
                <option value="paid">paid</option>
                <option value="pending">pending</option>
                <option value="expired">expired</option>
              </select>
            </div>

            <div className="form-group">
              <label>Data início</label>
              <input
                type="date"
                value={editing.startDate?.slice(0, 10) || ''}
                onChange={(e) => setEditing({ ...editing, startDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Data final</label>
              <input
                type="date"
                value={editing.endDate?.slice(0, 10) || ''}
                onChange={(e) => setEditing({ ...editing, endDate: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn" onClick={saveEdit}>Salvar</button>
              <button className="btn btn-danger" onClick={() => setEditing(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL COBRANÇA ASAAS (usuário comum) */}
      {billing && (
        <BillingModal
          sub={billing}
          onClose={() => setBilling(null)}
        />
      )}

    </div>
  );
}