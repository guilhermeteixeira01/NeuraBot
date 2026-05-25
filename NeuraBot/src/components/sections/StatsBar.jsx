import { STATS } from "../../data/site";
import { Icon } from "../ui/Icons";

export default function StatsBar() {
  return (
    <div
      style={{
        background: "rgba(13,13,26,0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,212,255,0.1)",
        borderBottom: "1px solid rgba(0,212,255,0.1)",
        padding: "28px 40px",
      }}
    >
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .stats-item {
          text-align: center;
          padding: 16px;
          border-radius: 14px;
          background: rgba(0,212,255,0.03);
          border: 1px solid rgba(0,212,255,0.07);
          transition: border-color 0.25s, background 0.25s;
        }
        .stats-item:hover {
          border-color: rgba(0,212,255,0.25);
          background: rgba(0,212,255,0.06);
        }
        @media (max-width: 700px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }
        }
        @media (max-width: 360px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="stats-item">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
              <Icon name={s.icon} size={26} color="#00d4ff" strokeWidth={1.5} />
            </div>
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                fontSize: 24,
                color: "#00d4ff",
                marginTop: 6,
                textShadow: "0 0 20px rgba(0,212,255,0.4)",
              }}
            >
              {s.value}
            </div>
            <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}