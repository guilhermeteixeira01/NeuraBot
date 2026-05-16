import { FOOTER_COLS } from "../../data/site";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#05050e",
        borderTop: "1px solid #0f0f1e",
        padding: "50px 40px 30px",
      }}
    >
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .footer-bottom {
          border-top: 1px solid #0f0f1e;
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-col-links {
          text-align: left;
        }

        @media (max-width: 768px) {
          footer {
            padding: 40px 24px 24px !important;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px 20px !important;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
          .footer-col-links {
            text-align: left;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }

        @media (max-width: 400px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-brand {
            grid-column: 1 !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="footer-grid">
          {/* Brand — ocupa linha inteira no mobile */}
          <div className="footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #00d4ff, #0055ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 900,
                  fontSize: 14,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                NB
              </div>
              <span
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: 2,
                }}
              >
                Neura Bot
              </span>
            </div>
            <p style={{ color: "#555", fontSize: 13, lineHeight: 1.8, maxWidth: 260 }}>
              A plataforma de bots Discord mais avançada do Brasil. Feito com 🤍 para a
              comunidade gamer.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title} className="footer-col-links">
              <div
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#555",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {col.title}
              </div>
              {col.links.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="nav-link"
                  style={{ display: "block", marginBottom: 10, fontSize: 13 }}
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span style={{ color: "#333", fontSize: 12 }}>
            © 2025 Neura Bot. Todos os direitos reservados.
          </span>
          <span style={{ color: "#333", fontSize: 12 }}>Hospedado no Brasil 🇧🇷</span>
        </div>
      </div>
    </footer>
  );
}