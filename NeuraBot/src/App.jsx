import "./styles/global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Scanline from "./components/ui/Scanline";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <HomePage />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/">
      <div style={{
        background: "#07070f",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "'Sora', 'Segoe UI', sans-serif",
        overflowX: "hidden",
      }}>
        <Scanline />
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}