import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useLocation } from "react-router-dom";

import BootIntro from "./components/branding/BootIntro";
import ParticleField from "./components/effects/ParticleField";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import useLenisScroll from "./hooks/useLenisScroll";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(true);
  const isEntryGate = location.pathname === "/";
  useLenisScroll();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MotionConfig transition={{ duration: 0.55, ease: [0.22, 0.8, 0.36, 1] }}>
      <div className="relative min-h-screen overflow-hidden">
        <ParticleField />
        <div className="pointer-events-none absolute -left-16 top-10 h-64 w-64 animate-pulse-soft rounded-full bg-sky-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-40 h-72 w-72 animate-glow rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/3 h-44 w-44 animate-drift rounded-full bg-violet-500/25 blur-3xl" />

        {!isEntryGate ? <Navbar /> : null}
        <main className={`relative mx-auto w-full ${isEntryGate ? "max-w-6xl px-4 pb-6 pt-6 sm:px-6" : "max-w-6xl px-4 pb-8 pt-6 sm:px-6 lg:px-8"}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 28, scale: 0.98, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(8px)" }}
            >
              <AppRoutes />
            </motion.div>
          </AnimatePresence>
        </main>
        {!isEntryGate ? <Footer /> : null}

        <AnimatePresence>{showIntro ? <BootIntro /> : null}</AnimatePresence>
      </div>
    </MotionConfig>
  );
}

export default App;
