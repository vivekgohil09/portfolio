import React from 'react';
import './ProjectGrid.css';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Full Stack Development',
    tags: ['[ React ]', '[ Node.js ]', '[ MongoDB ]'],
    image: 'https://images.unsplash.com/photo-1557821552-17105153ce9a?auto=format&fit=crop&q=80&w=800',
    link: '#'
  },
  {
    id: 2,
    title: 'Fintech Dashboard',
    category: 'Frontend Engineering',
    tags: ['[ Vue ]', '[ TypeScript ]', '[ Tailwind ]'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    link: '#'
  },
  {
    id: 3,
    title: 'Social Media App',
    category: 'Mobile & Backend',
    tags: ['[ React Native ]', '[ GraphQL ]'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
    link: '#'
  },
  {
    id: 4,
    title: 'AI Analytics Tool',
    category: 'Machine Learning',
    tags: ['[ Python ]', '[ FastAPI ]', '[ React ]'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    link: '#'
  }
];

const ProjectGrid = () => {
  return (
    <section className="projects section container">
      <div className="projects-header flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase">Selected Works</h2>
        <span className="mono text-sm">(2023 - 2024)</span>
      </div>
      
      <div className="projects-grid">
        {projects.map((project) => (
          <a href={project.link} className="project-card" key={project.id}>
            <div className="project-image-container">
              <img src={project.image} alt={project.title} className="project-image" />
              <div className="project-overlay">
                <div className="overlay-btn flex items-center justify-center">
                  <ArrowUpRight size={24} />
                </div>
              </div>
            </div>
            
            <div className="project-info">
              <div className="project-meta flex justify-between items-center mono text-sm text-secondary">
                <span>{project.category}</span>
                <div className="project-tags">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              <h3 className="project-title text-xl font-bold uppercase">{project.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ProjectGrid;
