import { useState, useEffect, useRef } from "react";
import { useCursorBlink } from "../../hooks/useCursorBlink";

export default function Console3D({ botName, commands, color }) {
  const [typed, setTyped] = useState("");
  const [lines, setLines] = useState([]);
  const cursor = useCursorBlink(500);
  const inputRef = useRef(null);

  // Reset lines whenever the active bot changes
  useEffect(() => {
    setLines([
      { text: `> Neura Bot Console v2.4.1`, c: "#00d4ff" },
      { text: `> Conectado ao bot: ${botName}`, c: color },
      { text: `> Status: ONLINE ✓`, c: "#22c55e" },
      { text: `> Aguardando comando...`, c: "#888" },
    ]);
    setTyped("");
  }, [botName, color]);

  function handleKey(e) {
    if (e.key !== "Enter" || !typed.trim()) return;

    const cmd = typed.trim();
    const isValid = commands.some((c) =>
      c.toLowerCase().includes(cmd.toLowerCase().replace("/", ""))
    );

    setLines((prev) => [
      ...prev.slice(-8),
      { text: `$ ${cmd}`, c: "#fff" },
      isValid
        ? { text: `✓ Comando executado com sucesso!`, c: "#22c55e" }
        : { text: `⚠ Comando não encontrado. Use: ${commands[0]}`, c: "#f59e0b" },
    ]);
    setTyped("");
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        background: "#0a0a0f",
        border: `1px solid ${color}55`,
        borderRadius: 12,
        padding: "20px 24px",
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
        lineHeight: 1.7,
        boxShadow: `0 0 40px ${color}22, inset 0 0 20px rgba(0,0,0,0.5)`,
        transform: "perspective(800px) rotateY(-8deg) rotateX(3deg)",
        transformOrigin: "left center",
        cursor: "text",
        minHeight: 220,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
          borderBottom: `1px solid ${color}33`,
          paddingBottom: 10,
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28ca41" }} />
        <span style={{ color: "#555", fontSize: 11, marginLeft: 8 }}>
          Neura Bot-console — {botName.toLowerCase()}
        </span>
      </div>

      {/* Output lines */}
      {lines.map((l, i) => (
        <div key={i} style={{ color: l.c, opacity: i === lines.length - 1 ? 1 : 0.7 }}>
          {l.text}
        </div>
      ))}

      {/* Input row */}
      <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
        <span style={{ color }}> $ </span>
        <span style={{ color: "#fff", marginLeft: 6 }}>{typed}</span>
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 14,
            background: cursor ? "#fff" : "transparent",
            marginLeft: 2,
          }}
        />
      </div>

      {/* Hidden real input */}
      <input
        ref={inputRef}
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        onKeyDown={handleKey}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        autoComplete="off"
      />

      {/* Command pills */}
      <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {commands.map((cmd) => (
          <span
            key={cmd}
            onClick={() => setTyped(cmd)}
            style={{
              background: `${color}15`,
              border: `1px solid ${color}44`,
              color,
              borderRadius: 4,
              padding: "2px 8px",
              fontSize: 11,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {cmd}
          </span>
        ))}
      </div>
    </div>
  );
}
