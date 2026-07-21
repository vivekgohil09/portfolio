import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VfxBackground from './VfxBackground';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────────────────────────
   Character-by-character scramble reveal
   ─────────────────────────────────────────── */
const GLYPHS = '█▓▒░!@#$%^&*()_+-=[]{}|;:,.<>?~abcdefghijklmnopqrstuvwxyz';

function ShatterChar({ char, delay }) {
  const [display, setDisplay] = useState('█');
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 8;
    const startDelay = delay * 60; // Convert seconds → frames

    let rafId;
    let waited = 0;

    const tick = () => {
      waited++;
      if (waited < startDelay) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (frame < totalFrames) {
        setDisplay(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
        frame++;
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplay(char);
        setIsRevealed(true);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [char, delay]);

  return (
    <span
      className={`hero-char ${isRevealed ? 'revealed' : 'scrambling'}`}
      style={{ display: 'inline-block' }}
    >
      {display === ' ' ? '\u00A0' : display}
    </span>
  );
}

function ShatterText({ text, baseDelay = 0 }) {
  return (
    <span aria-label={text}>
      {text.split('').map((char, i) => (
        <ShatterChar
          key={`${char}-${i}`}
          char={char}
          delay={baseDelay + i * 0.04}
        />
      ))}
    </span>
  );
}

/* ───────────────────────────────────────────
   Floating orbs background decoration
   ─────────────────────────────────────────── */
function FloatingOrbs() {
  return (
    <div className="floating-orbs" aria-hidden="true">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
    </div>
  );
}

/* ───────────────────────────────────────────
   Main Hero Component
   ─────────────────────────────────────────── */
const Hero = () => {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    gsap.to('.hero-image-wrapper', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 25,
      y: (clientY / innerHeight - 0.5) * 25,
    });
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        delay: 1.2 + i * 0.15,
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section
      ref={containerRef}
      className="hero-section h-screen flex flex-col justify-center relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* ── Animated Background ── */}
      <motion.div
        ref={bgRef}
        className="hero-background"
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', stiffness: 80, damping: 30 }}
      >
        <div className="hero-image-wrapper w-full h-full absolute top-0 left-0">
          <VfxBackground />
          <div className="hero-overlay"></div>
        </div>
      </motion.div>

      <FloatingOrbs />

      {/* ── Content ── */}
      <div className="container relative z-10 w-full flex flex-col justify-center h-full">
        {/* Subtitle Tag */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="hero-tag mono text-sm uppercase tracking-widest mb-6"
        >
          <span className="tag-dot"></span>
          Vivek Gohil — Full Stack Engineer
        </motion.div>

        {/* Main Shattering Title */}
        <div className="hero-titles flex flex-col justify-center">
          <h1 className="text-huge font-display font-bold uppercase hoverable hero-title-line" data-text="JAVA">
            <ShatterText text="JAVA" baseDelay={1.4} />
          </h1>
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <span className="font-serif italic text-3xl md:text-5xl text-accent hero-accent-word whitespace-nowrap">
              <ShatterText text="(Full Stack)" baseDelay={1.8} />
            </span>
            <h1 className="text-huge font-display font-bold uppercase hoverable hero-title-line" data-text="DEVELOPER">
              <ShatterText text="DEVELOPER" baseDelay={2.0} />
            </h1>
          </div>
        </div>

        {/* Bottom Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="hero-footer flex justify-between items-end mt-16"
        >
          <div className="hero-desc max-w-lg">
            <p className="text-secondary text-lg leading-relaxed">
              Crafting immersive digital experiences with React, HTML, CSS, JavaScript &amp; Java backend. Building the web of tomorrow, today.
            </p>
          </div>
          <div className="scroll-indicator mono text-sm flex items-center gap-4">
            <span className="scroll-text">Scroll</span>
            <div className="scroll-line">
              <div className="scroll-line-inner"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
