import "./styles/global.css";
import Scanline from "./components/ui/Scanline";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div
      style={{
        background: "#07070f",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "'Sora', 'Segoe UI', sans-serif",
        overflowX: "hidden",
      }}
    >
      <Scanline />
      <Navbar />
      <main>
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}
