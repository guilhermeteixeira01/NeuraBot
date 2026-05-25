import { useState } from "react";
import BotCard from "../ui/BotCard";
import Console3D from "../ui/Console3D";
import SectionLabel from "../ui/SectionLabel";
import { BOTS } from "../../data/bots";
import { Icon } from "../ui/Icons";

const TAGS = ["Servidores Gamers", "E-sports", "Comunidades", "Educação", "Negócios"];

export default function BotsSection() {
  const [activeBot, setActiveBot] = useState(0);
  const bot = BOTS[activeBot];

  return (
    <section id="bots" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
      <style>{`
        .bots-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        .bots-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .bot-feature-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 14px 16px;
          background: rgba(13,13,26,0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0,212,255,0.08);
          border-radius: 12px;
          transition: border-color 0.25s, background 0.25s;
        }
        .bot-feature-item:hover {
          border-color: rgba(0,212,255,0.35);
          background: rgba(0,212,255,0.04);
        }
        .bot-feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: color-mix(in srgb, var(--bot-color, #00d4ff) 12%, transparent);
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* ── Console 3D tilt ── */
        .console-3d-scene {
          perspective: 1000px;
          perspective-origin: 70% 50%;
        }
        .console-3d-inner {
          transform: rotateY(-10deg) rotateX(2deg);
          transform-origin: right center;
          transform-style: preserve-3d;
          border-radius: 14px;
          box-shadow:
            -6px 6px 0 -1px rgba(0,212,255,0.08),
            -12px 12px 0 -2px rgba(0,212,255,0.04),
            0 24px 60px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(0,212,255,0.1);
        }

        @media (max-width: 900px) {
          .bots-layout {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .console-3d-scene {
            perspective: none !important;
          }
          .console-3d-inner {
            transform: none !important;
            transform-origin: unset !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
          }
        }
        @media (max-width: 480px) {
          #bots {
            padding: 60px 20px !important;
          }
          .bots-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 60, display: "flex", flexDirection: "column", gap: 16 }}>
        <SectionLabel text="Nossa Suíte" />
        <h2
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(24px,4vw,44px)",
            fontWeight: 900,
          }}
        >
          CADA BOT. UM SUPERPODER.
        </h2>
        <p style={{ color: "#8888aa", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
          Bots desenvolvidos com tecnologia de ponta para elevar sua comunidade Discord.
        </p>
      </div>

      <div className="bots-layout">
        {/* Left: Bot cards + Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="bots-cards-grid">
            {BOTS.map((b, i) => (
              <BotCard
                key={b.id}
                bot={b}
                active={activeBot === i}
                onClick={() => setActiveBot(i)}
              />
            ))}
          </div>

          {/* Features do bot ativo */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ color: "#444466", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>
              Funcionalidades
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {bot.features.map((feature) => (
                <div
                  key={feature.label}
                  className="bot-feature-item"
                  style={{ "--bot-color": bot.color }}
                >
                  <div className="bot-feature-icon">
                    <Icon
                      name={feature.icon}
                      size={18}
                      color={bot.color}
                      strokeWidth={1.8}
                    />
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      {feature.label}
                    </div>
                    <div style={{ color: "#8888aa", fontSize: 12, lineHeight: 1.5 }}>
                      {feature.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel: Console + Tags */}
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 80 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ color: "#444466", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
              Console Interativo
            </div>
            <div style={{ color: "#8888aa", fontSize: 13 }}>
              Clique nos comandos abaixo para testá-los ou digite o seu próprio.
            </div>
          </div>

          <div className="console-3d-scene">
            <div className="console-3d-inner">
              <Console3D botName={bot.name} commands={bot.commands} color={bot.color} />
            </div>
          </div>

          <div
            style={{
              padding: "16px 20px",
              background: "rgba(13,13,26,0.65)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(0,212,255,0.08)",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ color: "#444466", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
              Disponível em:
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "rgba(0,212,255,0.05)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "#8888aa",
                    fontSize: 11,
                    padding: "4px 12px",
                    borderRadius: 20,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}