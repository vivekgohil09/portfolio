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
    desc: 'Scalable event-driven microservices architecture built with Java Spring Boot, Apache Kafka event streams, and distributed MySQL transaction management.',
    tags: ['Java 17', 'Spring Boot', 'Kafka', 'MySQL', 'Docker'],
    badge: 'EVENT-DRIVEN BACKEND',
    filename: 'OrderService.java',
    code: `
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private KafkaTemplate<String, OrderEvent> kafkaTemplate;

    @PostMapping("/checkout")
    public ResponseEntity<OrderStatus> processOrder(@Valid @RequestBody OrderRequest req) {
        OrderEvent event = new OrderEvent(req.getId(), "CREATED", System.currentTimeMillis());
        kafkaTemplate.send("order-topic", event);
        return ResponseEntity.accepted().body(new OrderStatus("PROCESSING"));
    }
}`.trim(),
    color: '#ff3300',
  },
  {
    id: 2,
    num: '02',
    title: 'Financial Aggregator API',
    type: 'Java 17 & PostgreSQL',
    desc: 'High-performance financial data pipeline API for processing multi-exchange transaction records with optimized PostgreSQL queries and analytics caching.',
    tags: ['Java 17', 'PostgreSQL', 'Spring Data JPA', 'REST API', 'Redis'],
    badge: 'HIGH-PERFORMANCE DATA PIPELINE',
    filename: 'TransactionPipeline.java',
    code: `
@Service
@Transactional
public class TransactionPipelineService {

    @Cacheable(value = "financialSummary", key = "#accountNo")
    public AccountAnalytics getAggregatedSummary(String accountNo) {
        List<Record> records = repository.findTop1000ByAccountNoOrderByTimestampDesc(accountNo);
        return AnalyticsEngine.compute(records);
    }
}`.trim(),
    color: '#00d4ff',
  },
  {
    id: 3,
    num: '03',
    title: 'Real-Time WebSockets Engine',
    type: 'Spring WebSockets & Redis',
    desc: 'Low-latency distributed messaging system built using Spring WebSockets, Redis Pub/Sub multi-node broadcasting, and JWT authorization interceptors.',
    tags: ['Spring Boot', 'WebSockets', 'Redis Pub/Sub', 'JWT', 'Java'],
    badge: 'LOW-LATENCY CHAT ENGINE',
    filename: 'WebSocketHandler.java',
    code: `
@Component
public class RealtimeChatHandler extends TextWebSocketHandler {

    @Autowired
    private RedisPublisher redisPublisher;

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        ChatMessage msg = parseJwtAndMessage(session, message);
        redisPublisher.publish("chat-channel", msg);
    }
}`.trim(),
    color: '#7b2ff7',
  },
  {
    id: 4,
    num: '04',
    title: 'Distributed Job Scheduler',
    type: 'Java & RabbitMQ',
    desc: 'Fault-tolerant distributed background task executor handling deferred job processing, dead-letter queues, and real-time Prometheus execution metrics.',
    tags: ['Java', 'RabbitMQ', 'Spring Quartz', 'Prometheus', 'REST'],
    badge: 'DISTRIBUTED QUEUE SYSTEM',
    filename: 'JobWorker.java',
    code: `
@RabbitListener(queues = "\${queue.jobs}")
public void executeBackgroundWorker(JobPayload payload) {
    try {
        jobRunner.execute(payload.getTask());
        metrics.increment("jobs.success");
    } catch (Exception e) {
        deadLetterQueue.dispatch(payload);
    }
}`.trim(),
    color: '#00ff88',
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

      // =========== DESKTOP & MOBILE: horizontal scroll ===========
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

      // Per-card animations
      cardRefs.current.forEach((card) => {
        if (!card) return;

        // Card entrance
        gsap.fromTo(card,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: card, containerAnimation: hScroll, start: 'left 90%' },
          }
        );

        // Accent line draw
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

        // 3D tilt on hover (desktop only)
        const isTouch = window.matchMedia("(hover: none)").matches;
        if (!isTouch) {
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
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ========== JSX Render Card ==========
  const renderCard = (proj, i) => (
    <div
      key={proj.id}
      ref={el => (cardRefs.current[i] = el)}
      className={`proj-card ${activeIndex === i ? 'proj-card--active' : ''}`}
      style={{ '--card-accent': proj.color }}
    >
      <div className="proj-corner proj-corner--tl" />
      <div className="proj-corner proj-corner--br" />

      {/* Cyber Code Terminal Window instead of plain image */}
      <div className="proj-terminal-wrap">
        <div className="proj-terminal-header">
          <div className="proj-terminal-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="proj-terminal-file mono">{proj.filename}</span>
          <span className="proj-terminal-badge mono">{proj.badge}</span>
        </div>
        <div className="proj-terminal-body mono">
          <pre className="proj-code-content">
            <code>{proj.code}</code>
          </pre>
        </div>
        <div className="proj-terminal-glow" style={{ background: `radial-gradient(circle, ${proj.color}22 0%, transparent 70%)` }} />
        <span className="proj-number font-display">{proj.num}</span>
      </div>

      {/* Info Side */}
      <div className="proj-info">
        <div className="proj-line proj-reveal" style={{ background: `linear-gradient(90deg, ${proj.color}, transparent)` }} />
        <p className="proj-type mono proj-reveal" style={{ color: proj.color }}>{proj.type}</p>
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
    <section ref={sectionRef} className="proj-section">
      <div ref={cursorGlowRef} className="proj-cursor-glow" />

      {/* Section Header */}
      <div ref={titleRef} className="proj-header">
        <span className="proj-header-label mono">Selected Architecture</span>
        <h2 className="proj-header-title font-display">
          Projects<span className="proj-dot">.</span>
        </h2>

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
      </div>

      {/* Cards - unified track rendering */}
      <div className="proj-track-wrap">
        <div ref={trackRef} className="proj-track">
          <div className="proj-spacer" />
          {projects.map((proj, i) => renderCard(proj, i))}
          <div className="proj-spacer" />
        </div>
      </div>
    </section>
  );
};

export default Projects;
