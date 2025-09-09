import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '../../data/projects';

type Props = {
  project: Project;
  onOpen: (project: Project) => void;
};

export const ProjectCard: React.FC<Props> = ({ project, onOpen }) => {
  const shouldReduce = useReducedMotion();
  return (
    <motion.article
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
      initial={shouldReduce ? undefined : { opacity: 0, y: 24 }}
      whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ amount: 0.2, once: true }}
      transition={shouldReduce ? undefined : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduce ? undefined : { y: -2, scale: 1.01 }}
      style={{ willChange: 'opacity, transform' }}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-[#00b4ff]"
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-b-none">
          <img
            src={project.cover}
            alt={project.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div className="pointer-events-none absolute inset-0 rounded-b-none ring-1 ring-inset ring-white/10 group-hover:ring-[#00b4ff66]" />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-[#c6d6e3]">{project.description}</p>
          {project.tech && project.tech.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="rounded-full border border-[#00b4ff33] bg-[#00b4ff12] px-2.5 py-1 text-xs text-[#8bb8d8]">
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {project.links?.case && (
              <a href={project.links.case} className="inline-flex items-center rounded-lg border border-[#00b4ff66] px-3 py-2 text-sm font-medium text-[#8bb8d8] transition-colors hover:border-[#00b4ff] hover:text-[#00b4ff]">
                View case
              </a>
            )}
            {project.links?.demo && (
              <a href={project.links.demo} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-[#c6d6e3] transition-colors hover:border-[#00b4ff66] hover:text-[#00b4ff]">
                Live
              </a>
            )}
            {project.links?.github && (
              <a href={project.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-[#c6d6e3] transition-colors hover:border-[#00b4ff66] hover:text-[#00b4ff]">
                GitHub
              </a>
            )}
          </div>
        </div>
      </button>
    </motion.article>
  );
};


