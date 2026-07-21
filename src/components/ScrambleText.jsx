import React, { useRef, useState, useEffect } from 'react';
import { useScramble } from '../hooks/useScramble';
import { useInView } from 'framer-motion';

const ScrambleText = ({ text, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { displayText } = useScramble(text, isInView);

  return (
    <span ref={ref} className={className} dangerouslySetInnerHTML={{ __html: displayText }} />
  );
};

export default ScrambleText;
