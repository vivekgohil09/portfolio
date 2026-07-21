import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Header.css';

const MagneticButton = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className="magnetic-wrapper hoverable"
    >
      {children}
    </motion.div>
  );
};

const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      className="header flex items-center justify-between container"
    >
      <MagneticButton>
        <div className="header-logo font-display font-bold text-xl uppercase">
          VIVEK.G
        </div>
      </MagneticButton>
      
      <div className="header-status flex items-center mono text-sm">
        <span className="status-dot"></span>
        Available for freelance
        <span className="time-divider">|</span>
        Local Time: {formatTime(time)}
      </div>
      
      <div className="header-actions flex items-center">
        <MagneticButton>
          <a href="#contact" className="contact-btn font-display uppercase font-bold text-sm">Let's Talk</a>
        </MagneticButton>
      </div>
    </motion.header>
  );
};

export default Header;
