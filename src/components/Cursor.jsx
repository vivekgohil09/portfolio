import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Cursor.css';

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener('mousemove', mMove);
      document.addEventListener('mouseenter', mEnter);
      document.addEventListener('mouseleave', mLeave);
      document.addEventListener('mousedown', mDown);
      document.addEventListener('mouseup', mUp);
    };

    const removeEventListeners = () => {
      document.removeEventListener('mousemove', mMove);
      document.removeEventListener('mouseenter', mEnter);
      document.removeEventListener('mouseleave', mLeave);
      document.removeEventListener('mousedown', mDown);
      document.removeEventListener('mouseup', mUp);
    };

    const mMove = (el) => {
      setPosition({ x: el.clientX, y: el.clientY });
    };

    const mEnter = () => setHidden(false);
    const mLeave = () => setHidden(true);
    const mDown = () => setClicked(true);
    const mUp = () => setClicked(false);

    addEventListeners();
    return () => removeEventListeners();
  }, []);

  useEffect(() => {
    const handleLinkHoverEvents = () => {
      document.querySelectorAll('a, button, .hoverable').forEach((el) => {
        el.addEventListener('mouseover', () => setLinkHovered(true));
        el.addEventListener('mouseout', () => setLinkHovered(false));
      });
    };
    handleLinkHoverEvents();
  }, []);

  const variants = {
    default: {
      x: position.x - 16,
      y: position.y - 16,
      scale: clicked ? 0.8 : 1,
      opacity: hidden ? 0 : 1,
      backgroundColor: 'transparent',
      border: '1px solid var(--text-primary)',
    },
    hover: {
      x: position.x - 32,
      y: position.y - 32,
      scale: clicked ? 1.2 : 1.5,
      opacity: hidden ? 0 : 1,
      backgroundColor: 'var(--text-primary)',
      border: 'none',
      mixBlendMode: 'difference'
    }
  };

  const blobVariants = {
    default: {
      x: position.x - 150,
      y: position.y - 150,
      scale: clicked ? 0.8 : 1,
      opacity: hidden ? 0 : 0.6,
      backgroundColor: 'var(--accent-color)',
      filter: 'blur(80px)',
      mixBlendMode: 'screen',
      zIndex: -1
    },
    hover: {
      x: position.x - 150,
      y: position.y - 150,
      scale: clicked ? 1.2 : 1.5,
      opacity: hidden ? 0 : 0.8,
      backgroundColor: 'var(--accent-color)',
      filter: 'blur(100px)',
      mixBlendMode: 'screen',
      zIndex: -1
    }
  };

  return (
    <>
      <motion.div
        className="custom-cursor-blob"
        variants={blobVariants}
        animate={linkHovered ? "hover" : "default"}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.8 }}
        style={{ position: 'fixed', top: 0, left: 0, width: 300, height: 300, borderRadius: '50%', pointerEvents: 'none' }}
      />
      <motion.div
        className="custom-cursor"
        variants={variants}
        animate={linkHovered ? "hover" : "default"}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />
    </>
  );
};

export default Cursor;
