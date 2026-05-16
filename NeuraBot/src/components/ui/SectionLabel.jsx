export default function SectionLabel({ text, color = "#00d4ff" }) {
  return (
    <div
      style={{
        color,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 3,
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {text}
    </div>
  );
}
