import { STATS } from "../../data/site";

export default function StatsBar() {
  return (
    <div
      style={{
        background: "#0d0d1a",
        borderTop: "1px solid #1e1e2e",
        borderBottom: "1px solid #1e1e2e",
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
        @media (max-width: 700px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
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
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                fontSize: 24,
                color: "#00d4ff",
                marginTop: 4,
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