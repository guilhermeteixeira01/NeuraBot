import SectionLabel from "../ui/SectionLabel";
import { PLANS } from "../../data/plans";

export default function PlansSection() {
  return (
    <section id="planos" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
      <style>{`
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .plans-grid {
            grid-template-columns: 1fr !important;
            max-width: 420px;
            margin: 0 auto;
          }
          .plan-card-popular {
            transform: none !important;
          }
        }
        @media (max-width: 480px) {
          #planos {
            padding: 60px 20px !important;
          }
        }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionLabel text="Preços" color="#22c55e" />
        <h2
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(24px,4vw,44px)",
            fontWeight: 900,
            marginBottom: 16,
          }}
        >
          PLANOS SEM SURPRESA
        </h2>
        <p style={{ color: "#8888aa", fontSize: 16 }}>
          Sem taxas ocultas. Cancele quando quiser.
        </p>
      </div>

      <div className="plans-grid">
        {PLANS.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>
    </section>
  );
}

function PlanCard({ plan }) {
  function handleEnter(e) {
    if (!plan.popular) {
      e.currentTarget.style.background = `rgba(13,13,26,0.85)`;
      e.currentTarget.style.borderColor = `${plan.color}44`;
    }
  }
  function handleLeave(e) {
    if (!plan.popular) {
      e.currentTarget.style.background = "rgba(13,13,26,0.65)";
      e.currentTarget.style.borderColor = "rgba(0,212,255,0.1)";
    }
  }

  return (
    <div
      className={`plan-card${plan.popular ? " plan-card-popular" : ""}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        background: plan.popular
          ? `rgba(0,212,255,0.07)`
          : "rgba(13,13,26,0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${plan.popular ? plan.color : "rgba(0,212,255,0.1)"}`,
        borderRadius: 18,
        padding: "36px 28px",
        position: "relative",
        transition: "transform 0.3s, border-color 0.3s, background 0.3s, box-shadow 0.3s",
        transform: plan.popular ? "scale(1.05)" : "none",
        boxShadow: plan.popular ? `0 0 50px ${plan.color}20` : "none",
        opacity: plan.comingSoon ? 0.6 : 1,
      }}
    >
      {plan.popular && (
        <div
          style={{
            position: "absolute",
            top: -1,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #00d4ff, #0055ff)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            padding: "4px 20px",
            borderRadius: "0 0 10px 10px",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          MAIS POPULAR
        </div>
      )}

      {plan.comingSoon && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#555",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 20,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Em Breve
        </div>
      )}

      <div
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: plan.color,
          marginBottom: 8,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {plan.name}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 28 }}>
        <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 32 }}>
          {plan.price}
        </span>
        {plan.period && (
          <span style={{ color: "#555", fontSize: 14 }}>{plan.period}</span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {plan.features.map((f) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: `${plan.color}18`,
                border: `1px solid ${plan.color}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: plan.color, fontSize: 11 }}>✓</span>
            </div>
            <span style={{ color: "#aaaacc", fontSize: 14 }}>{f}</span>
          </div>
        ))}
      </div>

      <button
        disabled={plan.comingSoon}
        onClick={() => window.open("https://discord.com/channels/1396934712102097127/1396934712609476620", "_blank")}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 50,
          border: plan.popular ? "none" : `1px solid ${plan.color}55`,
          cursor: plan.comingSoon ? "not-allowed" : "pointer",
          background: plan.popular
            ? "linear-gradient(135deg, #00d4ff, #0055ff)"
            : "transparent",
          color: plan.popular ? "#fff" : plan.color,
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          transition: "all 0.25s",
          boxShadow: plan.popular ? "0 0 20px rgba(0,212,255,0.3)" : "none",
          letterSpacing: 0.3,
        }}
      >
        {plan.cta}
      </button>
    </div>
  );
}