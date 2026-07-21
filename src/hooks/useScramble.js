import { useState, useEffect, useCallback } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export const useScramble = (text, start) => {
  const [displayText, setDisplayText] = useState(text);

  const scramble = useCallback(() => {
    let frame = 0;
    const queue = [];
    for (let i = 0; i < text.length; i++) {
      const from = text[i] || '';
      const to = text[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to, start, end, char: '' });
    }

    const update = () => {
      let output = '';
      let complete = 0;
      for (let i = 0, n = queue.length; i < n; i++) {
        let { from, to, start, end, char } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = CHARS[Math.floor(Math.random() * CHARS.length)];
            queue[i].char = char;
          }
          output += `<span class="scramble-char">${char}</span>`;
        } else {
          output += from;
        }
      }
      
      setDisplayText(output);
      if (complete === queue.length) {
        setDisplayText(text);
      } else {
        frame++;
        requestAnimationFrame(update);
      }
    };
    
    update();
  }, [text]);

  useEffect(() => {
    if (start) {
      scramble();
    }
  }, [start, scramble]);

  return { displayText };
};
