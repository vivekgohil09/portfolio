import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './Skills.css';

const skills = [
  "REACT", "JAVASCRIPT", "HTML", "CSS", "JAVA", "SPRING BOOT",
  "TAILWIND CSS", "FRAMER MOTION", "SQL"
];

const Skills = () => {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;

    gsap.to(marquee, {
      xPercent: -50,
      ease: "none",
      duration: 20,
      repeat: -1
    });
  }, []);

  return (
    <section className="skills-section py-24 bg-accent text-bg overflow-hidden relative">
      <div className="container mb-12">
        <h2 className="font-serif italic text-2xl">Core Competencies</h2>
      </div>

      <div className="marquee-wrapper">
        <div ref={marqueeRef} className="marquee-content flex">
          {[...skills, ...skills, ...skills, ...skills].map((skill, index) => (
            <div key={index} className="skill-item text-huge font-display uppercase font-bold mx-8 flex-shrink-0 hoverable">
              {skill}
              <span className="skill-dot"></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
