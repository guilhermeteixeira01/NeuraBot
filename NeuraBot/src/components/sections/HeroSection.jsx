import ParticleField from "../ui/ParticleField";
import { STATS } from "../../data/site";

export default function HeroSection() {
  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .hero-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .hero-mascot {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .hero-stats {
          display: flex;
          gap: 32px;
          margin-top: 48px;
          flex-wrap: wrap;
        }
        .hero-buttons {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .hero-copy {
            align-items: center !important;
            text-align: center !important;
          }
          .hero-mascot {
            order: -1;
          }
          .hero-mascot-circle {
            width: 200px !important;
            height: 200px !important;
          }
          .hero-mascot-img {
            width: 155px !important;
            height: 155px !important;
          }
          .hero-buttons {
            justify-content: center;
            width: 100%;
          }
          .hero-buttons .btn-primary,
          .hero-buttons .btn-outline {
            width: 100%;
            max-width: 320px;
            text-align: center;
          }
          .hero-stats {
            justify-content: center;
            gap: 28px;
          }
          .hero-desc {
            max-width: 100% !important;
            margin-bottom: 32px !important;
          }
        }

        @media (max-width: 480px) {
          .hero-inner {
            padding: 100px 20px 60px !important;
          }
        }
      `}</style>

      <ParticleField />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.07) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "grid-fade 1s forwards",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, #00d4ff08 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="hero-inner"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "120px 40px 80px",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="hero-grid">
          {/* Left: copy */}
          <div className="hero-copy" style={{ animation: "fadeUp 0.8s ease both" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#00d4ff15",
                border: "1px solid #00d4ff30",
                borderRadius: 20,
                padding: "6px 16px",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  animation: "blink 1.5s infinite",
                  flexShrink: 0,
                }}
              />
              <span style={{ color: "#00d4ff", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>
                Sistema Online — 99.9% Uptime
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(30px, 5vw, 62px)",
                lineHeight: 1.1,
                background: "linear-gradient(135deg, #ffffff 30%, #00d4ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 24,
                width: "100%",
              }}
            >
              BOTS DE DISCORD{" "}
              <span style={{ display: "block" }}>DE OUTRO NÍVEL</span>
            </h1>

            <p
              className="hero-desc"
              style={{
                color: "#8888aa",
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 40,
                maxWidth: 480,
              }}
            >
              A suíte completa de automação para Discord. Segurança, música, engajamento e
              inteligência artificial em um único ecossistema.
            </p>

            <div className="hero-buttons">
              {/* <button className="btn-primary" style={{ fontSize: 15 }}>
                🚀 Começar Grátis
              </button> */}
              <button className="btn-outline" onClick={() => window.open("/DOCS/documentacao_neura_bot.html", "_blank")}>
                Ver Documentação →</button>
            </div>

            <div className="hero-stats">
              {STATS.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 22, color: "#00d4ff" }}>
                    {s.value}
                  </div>
                  <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: mascot */}
          <div
            className="hero-mascot"
            style={{
              position: "relative",
              animation: "fadeUp 0.8s 0.2s ease both",
            }}
          >
            <div style={{ position: "relative" }}>
              {[0, 1].map((i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: -20,
                    borderRadius: "50%",
                    border: "1px solid #00d4ff40",
                    animation: `pulse-ring 2.5s ${i * 1.2}s ease-out infinite`,
                  }}
                />
              ))}
              <div
                className="hero-mascot-circle"
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 40% 35%, #00d4ff15, #0a0a1f)",
                  border: "1px solid #00d4ff25",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  animation: "float 4s ease-in-out infinite",
                }}
              >
                <img
                  className="hero-mascot-img"
                  src="/imgs/bot sem efeito.png"
                  alt="Mascote Neura Bot"
                  style={{
                    position: "relative",
                    left: -5,
                    top: 8,
                    width: 220,
                    height: 220,
                    objectFit: "contain",
                    filter: "drop-shadow(0 0 30px #00d4ff55)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}