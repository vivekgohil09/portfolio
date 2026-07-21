import React, { useEffect, useRef } from 'react';
import ScrambleText from './ScrambleText';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    id: 1,
    role: 'Java Software Engineer',
    company: 'Digital MetaWorks',
    location: 'Mumbai, Maharashtra, India · Hybrid',
    date: 'Jan 2026 - Present · 7 mos',
    description:
      'Working as a Java Software Engineer utilizing Spring Boot, MySQL and other technologies.',
    tags: ['Spring boot', 'MySQL', 'Java', 'Backend'],
  },
  {
    id: 2,
    role: 'Data Analyst',
    company: 'Hudl',
    location: 'On-site',
    date: 'Jul 2025 - Dec 2025 · 6 mos',
    description:
      'Analyzed large sets of sports event data and maintained high data accuracy. Used SQL to query, validate, and clean datasets for reporting and internal tools. Identified errors, corrected inconsistencies, and collaborated with teams.',
    tags: ['SQL', 'Data Analysis', 'Reporting'],
  },
  {
    id: 3,
    role: 'Back End Developer',
    company: 'Meliorate Technologies',
    location: 'Mumbai, Maharashtra, India · Remote',
    date: 'Jul 2024 - Jun 2025 · 1 yr',
    description:
      'Developed and maintained RESTful APIs using Spring Boot, ensuring efficient and scalable backend services.',
    tags: ['MySQL', 'Spring Framework', 'REST APIs'],
  },
];

const Experience = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.exp-card');
      items.forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 80,
          filter: 'blur(12px)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'bottom top',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Animate the accent line growing
      gsap.from('.timeline-glow-line', {
        scaleY: 0,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="experience-section relative">
      <div className="container">
        <h2 className="text-large font-display uppercase font-bold mb-24 text-center">
          <ScrambleText text="Journey" />
        </h2>

        <div className="timeline">
          {/* Glowing line */}
          <div className="timeline-track">
            <div className="timeline-glow-line"></div>
          </div>

          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`exp-card ${index % 2 === 0 ? 'card-left' : 'card-right'}`}
            >
              <div className="exp-card-inner">
                {/* Number badge */}
                <div className="exp-number font-display font-bold">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <span className="exp-date mono text-sm">{exp.date}</span>
                <h3 className="exp-role font-display font-bold text-3xl uppercase">
                  {exp.role}
                </h3>
                <h4 className="exp-company font-serif italic text-xl">
                  {exp.company}
                  <span className="exp-location"> · {exp.location}</span>
                </h4>
                <p className="exp-desc text-secondary mt-4">{exp.description}</p>

                {/* Tech tags */}
                <div className="exp-tags mt-4">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="exp-tag mono text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
