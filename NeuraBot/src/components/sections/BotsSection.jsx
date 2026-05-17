import { useState } from "react";
import BotCard from "../ui/BotCard";
import Console3D from "../ui/Console3D";
import SectionLabel from "../ui/SectionLabel";
import { BOTS } from "../../data/bots";

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
          background: #0d0d18;
          border: 1px solid #1e1e2e;
          border-radius: 10px;
          transition: border-color 0.2s;
        }
        .bot-feature-item:hover {
          border-color: var(--bot-color, #00d4ff44);
        }
        @media (max-width: 900px) {
          .bots-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
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
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionLabel text="Nossa Suíte" />
        <h2
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(24px,4vw,44px)",
            fontWeight: 900,
            marginBottom: 16,
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
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
          <div>
            <div style={{ color: "#555", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Funcionalidades
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {bot.features.map((feature) => (
                <div
                  key={feature.label}
                  className="bot-feature-item"
                  style={{ "--bot-color": bot.color }}
                >
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{feature.icon}</span>
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
        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: "#555", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
              Console Interativo
            </div>
            <div style={{ color: "#8888aa", fontSize: 13 }}>
              Clique nos comandos abaixo para testá-los ou digite o seu próprio.
            </div>
          </div>

          <Console3D botName={bot.name} commands={bot.commands} color={bot.color} />

          <div
            style={{
              marginTop: 20,
              padding: "16px 20px",
              background: "#0d0d18",
              border: "1px solid #1e1e2e",
              borderRadius: 10,
            }}
          >
            <div style={{ color: "#555", fontSize: 11, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
              Disponível em:
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "#1a1a2e",
                    border: "1px solid #2a2a3e",
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