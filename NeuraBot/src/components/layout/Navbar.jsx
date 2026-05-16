import { useState } from "react";
import { useScrollY } from "../../hooks/useScrollY";
import { NAV_LINKS } from "../../data/site";

export default function Navbar() {
  const scrollY = useScrollY();
  const scrolled = scrollY > 50;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled || menuOpen ? "rgba(7,7,15,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid #ffffff0d" : "none",
        padding: "0 40px",
        transition: "all 0.3s",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .nav-inner { padding: 0 20px !important; }
          .nav-desktop-links { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-mobile-menu { display: flex !important; }
        }
      `}</style>

      {/* Main row */}
      <div
        className="nav-inner"
        style={{
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #00d4ff, #0055ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              fontSize: 14,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            NB
          </div>
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: 2,
            }}
          >
            Neura Bot
          </span>
        </div>

        {/* Desktop links + CTA */}
        <div className="nav-desktop-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <button
            className="btn-primary"
            style={{ padding: "10px 22px", fontSize: 13 }}
            onClick={() => {
              const url = import.meta.env.DEV
                ? "http://localhost:5174"
                : "https://neurabot.com.br/NeuraBot/DashBoard-NeuraBot/"
              window.open(url, "_blank")
            }}
          >
            Ir para o DashBoard
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: "none",
            flexDirection: "column",
            gap: 5,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
          }}
          aria-label="Menu"
        >
          <span style={{ width: 24, height: 2, background: menuOpen ? "#00d4ff" : "#fff", borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
          <span style={{ width: 24, height: 2, background: "#fff", borderRadius: 2, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ width: 24, height: 2, background: menuOpen ? "#00d4ff" : "#fff", borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="nav-mobile-menu"
        style={{
          display: "none",
          flexDirection: "column",
          gap: 4,
          padding: menuOpen ? "16px 20px 24px" : "0 20px",
          maxHeight: menuOpen ? 400 : 0,
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="nav-link"
            onClick={() => setMenuOpen(false)}
            style={{ fontSize: 15, padding: "10px 0", borderBottom: "1px solid #ffffff08" }}
          >
            {link.label}
          </a>
        ))}
        <button
          className="btn-primary"
          style={{ marginTop: 12, padding: "12px", fontSize: 14, width: "100%" }}
          onClick={() => {
            const url = import.meta.env.DEV
              ? "http://localhost:5174"
              : "https://neurabot.com.br/NeuraBot/DashBoard-NeuraBot/"
            window.open(url, "_blank")
          }}
        >
          Ir para o DashBoard
        </button>
      </div>
    </nav>
  );
}