import "../styles/global.css";
import Scanline from "../components/ui/Scanline";

export default function NotFoundPage() {
    return (
        <div style={{
            background: "#07070f",
            color: "#fff",
            minHeight: "100vh",
            fontFamily: "'Sora', 'Segoe UI', sans-serif",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
        }}>
            <Scanline />
            <main style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
                textAlign: "center",
            }}>
                <div style={{ maxWidth: 640, animation: "fadeUp 0.7s ease both" }}>

                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "#00d4ff0d", border: "1px solid #00d4ff22",
                        borderRadius: 20, padding: "6px 16px", fontSize: 12,
                        fontWeight: 600, color: "#00d4ff", letterSpacing: "1.5px",
                        textTransform: "uppercase", marginBottom: 24,
                    }}>
                        <span style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: "#00d4ff", animation: "blink 1.4s ease-in-out infinite",
                            display: "inline-block",
                        }} />
                        Página não encontrada
                    </div>

                    <div style={{
                        fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
                        fontSize: "clamp(100px, 20vw, 180px)", lineHeight: 1,
                        letterSpacing: -4, background: "linear-gradient(135deg, #00d4ff, #0088ff)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>
                        404
                    </div>

                    <h1 style={{
                        fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                        fontSize: "clamp(22px, 5vw, 36px)", color: "#fff",
                        margin: "16px 0 12px", letterSpacing: 1,
                    }}>
                        Oops! Rota desconhecida
                    </h1>

                    <p style={{
                        fontSize: 15, color: "#8888aa", lineHeight: 1.8,
                        marginBottom: 36, maxWidth: 500,
                        marginLeft: "auto", marginRight: "auto",
                    }}>
                        A página que você está procurando não existe, foi movida ou está
                        temporariamente indisponível.
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                        <a href="/NeuraBot/" className="btn-primary">
                            Voltar ao início
                        </a>
                        <a href="/NeuraBot/#suporte" className="btn-outline">
                            Suporte
                        </a>
                    </div>

                </div>
            </main>
        </div>
    );
}