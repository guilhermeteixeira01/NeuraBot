import { Icon } from "./Icons";

export default function BotCard({ bot, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active ? `${bot.color}12` : "#0d0d18",
        border: `1px solid ${active ? bot.color : "#1e1e2e"}`,
        borderRadius: 12,
        padding: "18px 20px",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        transform: active ? "translateY(-4px)" : "none",
        boxShadow: active ? `0 8px 40px ${bot.glow}` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Active top-line accent */}
      {active && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${bot.color}, transparent)`,
          }}
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: `${bot.color}20`,
            border: `1px solid ${bot.color}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={bot.icon} size={22} color={bot.color} strokeWidth={1.6} />
        </div>
        <div>
          <div
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            {bot.name}
          </div>
          <div
            style={{
              display: "inline-block",
              background: `${bot.color}20`,
              color: bot.color,
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 20,
              border: `1px solid ${bot.color}40`,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            {bot.tag}
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: "#8888aa", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
        {bot.desc}
      </p>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
        {bot.stats.map((s) => (
          <div key={s.label} style={{ flex: 1 }}>
            <div
              style={{
                color: bot.color,
                fontWeight: 700,
                fontSize: 16,
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              {s.value}
            </div>
            <div style={{ color: "#555", fontSize: 10, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}