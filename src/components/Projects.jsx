import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    num: '01',
    title: 'E-Commerce Microservices',
    type: 'Spring Boot & Kafka',
    desc: 'Scalable microservices architecture with event-driven Kafka pipelines, REST APIs, and distributed order management.',
    tags: ['Java', 'Spring Boot', 'Kafka', 'MySQL'],
    image: '/proj_ecommerce.png',
    color: '#D4AF37',
  },
  {
    id: 2,
    num: '02',
    title: 'Financial Aggregator',
    type: 'Java & PostgreSQL',
    desc: 'Real-time financial data aggregation platform with secure data pipelines, PostgreSQL optimization, and analytics endpoints.',
    tags: ['Java', 'PostgreSQL', 'REST API', 'Data Pipelines'],
    image: '/proj_finance.png',
    color: '#C8A96E',
  },
  {
    id: 3,
    num: '03',
    title: 'Real-Time Chat',
    type: 'Spring WebSockets & Redis',
    desc: 'Low-latency messaging system using Spring WebSockets, Redis pub/sub channels, and JWT authentication.',
    tags: ['Spring Boot', 'WebSockets', 'Redis', 'JWT'],
    image: '/proj_chat.png',
    color: '#E8C97A',
  },
];

const Projects = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const titleRef = useRef(null);
  const cardRefs = useRef([]);
  const progressRef = useRef(null);
  const cursorGlowRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Section title entrance ---
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      if (!isMobile) {
        // =========== DESKTOP: horizontal scroll ===========
        const totalScroll = trackRef.current.scrollWidth - window.innerWidth;

        const hScroll = gsap.to(trackRef.current, {
          x: -totalScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${totalScroll + window.innerHeight}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            onUpdate: self => {
              if (progressRef.current) {
                progressRef.current.style.width = `${self.progress * 100}%`;
              }
              const idx = Math.min(
                projects.length - 1,
                Math.floor(self.progress * projects.length)
              );
              setActiveIndex(idx);
            },
          },
        });

        // Per-card desktop animations
        cardRefs.current.forEach((card) => {
          if (!card) return;

          // Image parallax
          const img = card.querySelector('.proj-img');
          gsap.fromTo(img,
            { scale: 1.12 },
            {
              scale: 1, ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: () => `+=${totalScroll + window.innerHeight}`,
                scrub: true,
              },
            }
          );

          // Card entrance
          gsap.fromTo(card,
            { y: 60, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
              scrollTrigger: { trigger: card, containerAnimation: hScroll, start: 'left 90%' },
            }
          );

          // Gold line draw
          const line = card.querySelector('.proj-line');
          gsap.fromTo(line,
            { scaleX: 0 },
            {
              scaleX: 1, duration: 0.9, ease: 'power3.out',
              scrollTrigger: { trigger: card, containerAnimation: hScroll, start: 'left 80%' },
            }
          );

          // Text stagger reveal
          const texts = card.querySelectorAll('.proj-reveal');
          gsap.fromTo(texts,
            { y: 36, opacity: 0 },
            {
              y: 0, opacity: 1, stagger: 0.09, duration: 0.9, ease: 'power3.out',
              scrollTrigger: { trigger: card, containerAnimation: hScroll, start: 'left 70%' },
            }
          );

          // 3D tilt on hover
          const onMove = e => {
            const rect = card.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
            const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
            gsap.to(card, {
              rotateY: dx * 8, rotateX: -dy * 6,
              transformPerspective: 1200, duration: 0.5, ease: 'power2.out',
            });
            if (cursorGlowRef.current) {
              gsap.to(cursorGlowRef.current, {
                x: e.clientX - rect.left, y: e.clientY - rect.top,
                opacity: 1, duration: 0.3, ease: 'power2.out',
              });
            }
          };
          const onLeave = () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
            if (cursorGlowRef.current) {
              gsap.to(cursorGlowRef.current, { opacity: 0, duration: 0.4 });
            }
          };
          card.addEventListener('mousemove', onMove);
          card.addEventListener('mouseleave', onLeave);
        });
      } else {
        // =========== MOBILE: cinematic vertical effects ===========
        cardRefs.current.forEach((card, i) => {
          if (!card) return;

          // Card entrance — clip-path wipe reveal + rotation + scale
          gsap.fromTo(card,
            {
              clipPath: 'inset(100% 0% 0% 0%)',
              opacity: 0,
              y: 80,
              rotateX: 12,
              scale: 0.92,
            },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              duration: 1.2,
              ease: 'power4.out',
              scrollTrigger: { trigger: card, start: 'top 88%' },
            }
          );

          // Image zoom-in reveal
          const img = card.querySelector('.proj-img');
          gsap.fromTo(img,
            { scale: 1.35, filter: 'brightness(0.3) saturate(0)' },
            {
              scale: 1,
              filter: 'brightness(0.75) saturate(0.7)',
              duration: 1.6,
              ease: 'power2.out',
              scrollTrigger: { trigger: card, start: 'top 82%' },
            }
          );

          // Number counter pulse
          const num = card.querySelector('.proj-number');
          gsap.fromTo(num,
            { scale: 0.5, opacity: 0 },
            {
              scale: 1, opacity: 0.15,
              duration: 1,
              ease: 'elastic.out(1, 0.6)',
              scrollTrigger: { trigger: card, start: 'top 80%' },
            }
          );

          // Gold line — draw-in with glow pulse
          const line = card.querySelector('.proj-line');
          gsap.fromTo(line,
            { scaleX: 0, boxShadow: '0 0 0px rgba(212,175,55,0)' },
            {
              scaleX: 1,
              boxShadow: '0 0 16px rgba(212,175,55,0.6)',
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 75%' },
            }
          );

          // Text stagger reveal with slight x-offset per line
          const texts = card.querySelectorAll('.proj-reveal');
          gsap.fromTo(texts,
            { y: 28, x: -12, opacity: 0, filter: 'blur(4px)' },
            {
              y: 0, x: 0, opacity: 1, filter: 'blur(0px)',
              stagger: 0.1,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 72%' },
            }
          );

          // Tags pop-in one by one
          const tags = card.querySelectorAll('.proj-tag');
          gsap.fromTo(tags,
            { scale: 0, opacity: 0 },
            {
              scale: 1, opacity: 1,
              stagger: 0.06,
              duration: 0.5,
              ease: 'back.out(2)',
              scrollTrigger: { trigger: card, start: 'top 65%' },
            }
          );

          // Border glow animation on scroll-through
          gsap.fromTo(card,
            { borderColor: 'rgba(212,175,55,0)' },
            {
              borderColor: 'rgba(212,175,55,0.3)',
              duration: 0.6,
              scrollTrigger: {
                trigger: card,
                start: 'top 60%',
                end: 'bottom 40%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  // ========== JSX ==========
  const renderCard = (proj, i) => (
    <div
      key={proj.id}
      ref={el => (cardRefs.current[i] = el)}
      className={`proj-card ${activeIndex === i ? 'proj-card--active' : ''}`}
      style={{ '--card-accent': proj.color }}
    >
      <div className="proj-corner proj-corner--tl" />
      <div className="proj-corner proj-corner--br" />

      <div className="proj-img-wrap">
        <img src={proj.image} alt={proj.title} className="proj-img" />
        <div className="proj-img-overlay" />
        {!isMobile && <div className="proj-img-scan" />}
        <span className="proj-number font-display">{proj.num}</span>
      </div>

      <div className="proj-info">
        <div className="proj-line proj-reveal" />
        <p className="proj-type mono proj-reveal">{proj.type}</p>
        <h3 className="proj-title font-display proj-reveal">{proj.title}</h3>
        <p className="proj-desc proj-reveal">{proj.desc}</p>
        <div className="proj-tags proj-reveal">
          {proj.tags.map(tag => (
            <span key={tag} className="proj-tag mono">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className={`proj-section ${isMobile ? 'proj-section--mobile' : ''}`}>
      {!isMobile && <div ref={cursorGlowRef} className="proj-cursor-glow" />}

      {/* Section Header */}
      <div ref={titleRef} className="proj-header">
        <span className="proj-header-label mono">Selected Work</span>
        <h2 className="proj-header-title font-display">
          Projects<span className="proj-dot">.</span>
        </h2>

        {!isMobile && (
          <>
            <div className="proj-progress-track">
              <div ref={progressRef} className="proj-progress-fill" />
            </div>
            <p className="proj-counter mono">
              <span className="proj-counter-active">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="proj-counter-sep"> / </span>
              {String(projects.length).padStart(2, '0')}
            </p>
            <div className="proj-dots">
              {projects.map((_, i) => (
                <div key={i} className={`proj-dot-item ${i === activeIndex ? 'active' : ''}`} />
              ))}
            </div>
            <p className="proj-header-sub">Scroll to explore →</p>
          </>
        )}
      </div>

      {/* Cards */}
      {isMobile ? (
        // MOBILE: simple vertical list
        <div className="proj-mobile-list">
          {projects.map((proj, i) => renderCard(proj, i))}
        </div>
      ) : (
        // DESKTOP: horizontal scroll track
        <div className="proj-track-wrap">
          <div ref={trackRef} className="proj-track">
            <div className="proj-spacer" />
            {projects.map((proj, i) => renderCard(proj, i))}
            <div className="proj-spacer" />
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
