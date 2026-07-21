import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <footer
      id="contact"
      ref={ref}
      className="footer-section relative overflow-hidden"
    >
      <div className="container footer-container">
        {/* Top row — info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="footer-top"
        >
          <div className="footer-cta-text font-serif italic text-2xl text-secondary">
            Have a project in mind?<br />Let's build something extraordinary.
          </div>
          <div className="footer-links">
            <a
              href="mailto:gohilvivek68@gmail.com"
              className="hoverable footer-link mono text-sm"
            >
              gohilvivek68@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/vivek-gohil-7851b5267/"
              target="_blank"
              rel="noopener noreferrer"
              className="hoverable footer-link mono text-sm"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/vivekgohil01"
              target="_blank"
              rel="noopener noreferrer"
              className="hoverable footer-link mono text-sm"
            >
              GitHub ↗
            </a>
          </div>
        </motion.div>

        {/* Giant CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="footer-huge hoverable"
        >
          <a href="mailto:gohilvivek68@gmail.com" className="footer-huge-link">
            <span className="footer-huge-text font-display uppercase font-bold">
              Let's Talk
            </span>
          </a>
        </motion.div>

        {/* Bottom copyright */}
        <div className="footer-bottom mono text-sm text-secondary">
          <span>© {new Date().getFullYear()} Vivek Gohil</span>
          <span>Built with passion & code</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
