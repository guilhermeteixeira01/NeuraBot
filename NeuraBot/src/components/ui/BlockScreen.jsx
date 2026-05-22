export default function BlockScreen() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: 'sans-serif',
            userSelect: 'none',
        }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 8px' }}>
                Acesso bloqueado
            </h1>
            <p style={{ fontSize: 14, color: '#888', margin: 0, textAlign: 'center', maxWidth: 340 }}>
                Ferramentas de desenvolvedor foram detectadas.<br />
                Feche o DevTools para continuar.
            </p>
        </div>
    );
}