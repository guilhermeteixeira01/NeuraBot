import ParticleField from "../ui/ParticleField";
import { STATS } from "../../data/site";
import botlogo from "../../../../imgs/bot sem efeito.png";

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
        /* Floating info cards */
        .hero-float-card {
          position: absolute;
          background: rgba(13,13,26,0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(0,212,255,0.18);
          border-radius: 14px;
          padding: 12px 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          white-space: nowrap;
        }
        .hero-float-card-val {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: #00d4ff;
        }
        .hero-float-card-lbl {
          color: #8888aa;
          font-size: 11px;
          margin-top: 2px;
        }
        .hfc-1 { top: 20px; right: 200px; animation: floatCard 5s ease-in-out infinite; }
        .hfc-2 { bottom: 100px; right: -80px; animation: floatCard 6s 0.5s ease-in-out infinite; }
        .hfc-3 { top: 200px; left: -50px; animation: floatCard 4.5s 1s ease-in-out infinite; }

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
          .hero-float-card { display: none; }
        }

        @media (max-width: 480px) {
          .hero-inner {
            padding: 100px 20px 60px !important;
          }
        }
      `}</style>

      <ParticleField />

      {/* Grid background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.05) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "grid-fade 1s forwards",
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "55%",
          transform: "translate(-50%,-50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 65%)",
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
            {/* Online badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.25)",
                borderRadius: 50,
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
              <span style={{ color: "#00d4ff", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>
                Sistema Online — 99.9% Uptime
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(30px, 5vw, 62px)",
                lineHeight: 1.05,
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
              <button className="btn-outline" onClick={() => window.open("/DOCS/documentacao_neura_bot.html", "_blank")}>
                Ver Documentação →
              </button>
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
                    border: "1px solid rgba(0,212,255,0.3)",
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
                  background: "radial-gradient(circle at 40% 35%, rgba(0,212,255,0.1), rgba(10,10,31,0.8))",
                  border: "1px solid rgba(0,212,255,0.2)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  animation: "float 4s ease-in-out infinite",
                  backdropFilter: "blur(8px)",
                }}
              >
                <img
                  className="hero-mascot-img"
                  src={botlogo}
                  alt="Mascote Neura Bot"
                  style={{
                    position: "relative",
                    left: -5,
                    top: 8,
                    width: 220,
                    height: 220,
                    objectFit: "contain",
                    filter: "drop-shadow(0 0 30px rgba(0,212,255,0.5))",
                  }}
                />
              </div>

              {/* Floating info cards */}
              <div className="hero-float-card hfc-1">
                <div className="hero-float-card-val">3.700+</div>
                <div className="hero-float-card-lbl">Servidores Ativos</div>
              </div>
              <div className="hero-float-card hfc-2">
                <div className="hero-float-card-val">99.9%</div>
                <div className="hero-float-card-lbl">Uptime Garantido</div>
              </div>
              <div className="hero-float-card hfc-3">
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "blink 1.5s infinite" }} />
                  <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700 }}>ONLINE</span>
                </div>
                <div className="hero-float-card-lbl" style={{ marginTop: 3 }}>Todos os sistemas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}