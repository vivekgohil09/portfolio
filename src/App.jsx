import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';

import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import NoiseOverlay from './components/NoiseOverlay';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Apply dark theme initially
    document.documentElement.setAttribute('data-theme', 'dark');

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader setLoading={setLoading} key="preloader" />}
      </AnimatePresence>
      
      {!loading && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Cursor />
            <NoiseOverlay />
            <Header />
            <main>
              <Hero />
              <Experience />
              <Skills />
              <Projects />
            </main>
            <Footer />
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}

export default App;
