import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './Preloader.css';

const Preloader = ({ setLoading }) => {
  const [progress, setProgress] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 1;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setLoading(false), 800);
      }
      setProgress(currentProgress);
    }, 80);

    return () => clearInterval(interval);
  }, [setLoading]);

  return (
    <motion.div
      className="preloader"
      exit={{
        clipPath: 'inset(0 0 100% 0)',
        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
      }}
    >
      {/* Horizontal lines decoration */}
      <div className="preloader-lines" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="preloader-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.05, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="preloader-content">
        <div className="preloader-counter-wrap" ref={counterRef}>
          <span className="preloader-counter font-display font-bold">
            {String(progress).padStart(3, '0')}
          </span>
        </div>
        <div className="preloader-bottom">
          <span className="mono text-sm uppercase tracking-widest preloader-label">
            Loading Experience
          </span>
          <div className="preloader-bar">
            <motion.div
              className="preloader-bar-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
