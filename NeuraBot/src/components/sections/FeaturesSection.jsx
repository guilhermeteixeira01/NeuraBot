import SectionLabel from "../ui/SectionLabel";
import { FEATURES } from "../../data/site";
import { Icon } from "../../components/ui/Icons";

export default function FeaturesSection() {
  return (
    <section
      id="recursos"
      style={{
        padding: "80px 40px",
        background: "#0a0a14",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 560px) {
          .features-grid {
            grid-template-columns: 1fr !important;
          }
          #recursos {
            padding: 60px 20px !important;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -200,
          top: "50%",
          transform: "translateY(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, #a855f715 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionLabel text="Tecnologia" color="#a855f7" />
          <h2
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(24px,4vw,44px)",
              fontWeight: 900,
            }}
          >
            INFRAESTRUTURA ENTERPRISE
          </h2>
        </div>

        <div className="features-grid">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature: f }) {
  function handleEnter(e) {
    e.currentTarget.style.border = `1px solid ${f.color}44`;
    e.currentTarget.style.transform = "translateY(-4px)";
  }
  function handleLeave(e) {
    e.currentTarget.style.border = "1px solid #1e1e2e";
    e.currentTarget.style.transform = "none";
  }

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        background: "#0d0d18",
        border: "1px solid #1e1e2e",
        borderRadius: 12,
        padding: "28px 24px",
        transition: "all 0.3s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `color-mix(in srgb, ${f.color} 12%, transparent)`,
          marginBottom: 16,
        }}
      >
        <Icon name={f.icon} size={24} color={f.color} strokeWidth={1.6} />
      </div>
      <h3
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: f.color,
          marginBottom: 10,
          letterSpacing: 0.5,
        }}
      >
        {f.title}
      </h3>
      <p style={{ color: "#8888aa", fontSize: 13, lineHeight: 1.7 }}>{f.desc}</p>
    </div>
  );
}