import SectionLabel from "../ui/SectionLabel";
import { FEATURES } from "../../data/site";
import { Icon } from "../../components/ui/Icons";

export default function FeaturesSection() {
  return (
    <section
      id="recursos"
      style={{
        padding: "80px 40px",
        background: "rgba(10,10,20,0.8)",
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
          background: "radial-gradient(circle, rgba(0,85,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -200,
          top: "20%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)",
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
    e.currentTarget.style.borderColor = `${f.color}55`;
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = `0 12px 40px ${f.color}10`;
    e.currentTarget.style.background = "rgba(13,13,26,0.85)";
  }
  function handleLeave(e) {
    e.currentTarget.style.borderColor = "rgba(0,212,255,0.08)";
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.background = "rgba(13,13,26,0.65)";
  }

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        background: "rgba(13,13,26,0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(0,212,255,0.08)",
        borderRadius: 14,
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
          fontSize: 13,
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