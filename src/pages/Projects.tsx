import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { projects as allProjects, type Project } from '../data/projects';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ImageLightbox } from '../components/projects/ImageLightbox';
import Navbar from '../components/layout/Navbar';

type RevealOnScrollProps = {
  children: React.ReactNode;
  once?: boolean;
  y?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  once = true,
  y = 24,
  className,
  as = 'div',
}) => {
  const shouldReduce = useReducedMotion();
  const Component: any = motion[as] ?? motion.div;
  if (shouldReduce) {
    return <Component className={className}>{children}</Component>;
  }
  return (
    <Component
      className={className}
      style={{ willChange: 'opacity, transform' }}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.2, once }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
};

type FilterKey = 'All' | 'Web' | 'Design' | 'School' | 'Client';
const FILTERS: FilterKey[] = ['All', 'Web', 'Design', 'School', 'Client'];

const pageContainer =
  'min-h-screen bg-[#0b1220] text-[#f5f7fa]';
const contentWrap =
  'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8';
const heroTitle =
  'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight';
const heroSubtitle = 'mt-3 text-[#c6d6e3] max-w-2xl';
const gridClasses = 'mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8';

const cardBase =
  'group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm';
const cardMediaWrap = 'relative aspect-[16/10] overflow-hidden';
const cardMediaImg = 'h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]';
const cardBody = 'p-5 flex flex-col gap-3';
const cardTitle = 'text-lg font-semibold';
const cardDesc = 'text-sm text-[#c6d6e3]';
const cardCta =
  'inline-flex items-center justify-center self-start rounded-lg border border-[#00b4ff66] px-3 py-2 text-sm font-medium text-[#8bb8d8] hover:text-[#00b4ff] hover:border-[#00b4ff] transition-colors';

export default function ProjectsPage(): JSX.Element {
  const [filter, setFilter] = useState<FilterKey>('All');
  const [active, setActive] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'All') return allProjects;
    return allProjects.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <div className={pageContainer}>
      <Navbar current="Projects" />
      {/* Background gradient accent */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60%_40%_at_70%_10%,rgba(0,180,255,0.12)_0%,rgba(0,0,0,0)_70%)]"
      />

      {/* Hero and breadcrumb */}

      <header className={contentWrap}>
        <div className="py-10 sm:py-14 md:py-16">
          {/* Breadcrumb */}
          <RevealOnScroll as="div">
            <nav aria-label="Breadcrumb" className="text-sm text-[#8bb8d8]">
              <a href="/" className="hover:text-[#00b4ff]">Home</a>
              <span className="mx-2 text-[#304055]">/</span>
              <span className="text-[#c6d6e3]">Projects</span>
            </nav>
          </RevealOnScroll>

          {/* Hero */}
          <RevealOnScroll as="section" className="mt-4">
            <h1 className={heroTitle}>Projects</h1>
            <p className={heroSubtitle}>A selection of my recent work.</p>
          </RevealOnScroll>

          {/* Filters */}
          <RevealOnScroll as="div" className="mt-6">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const active = f === filter;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={
                      'rounded-full border px-3 py-1.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#00b4ff] ' +
                      (active
                        ? 'border-[#00b4ff] text-[#00b4ff]'
                        : 'border-[#00b4ff33] text-[#8bb8d8] hover:border-[#00b4ff] hover:text-[#00b4ff]')
                    }
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </RevealOnScroll>
        </div>
      </header>

      <main className={contentWrap}>
        <section>
          <motion.ul layout className={gridClasses}>
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.li key={p.id} layout>
                  <ProjectCard project={p} onOpen={setActive} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </section>
        {/* Footer CTA */}
        <RevealOnScroll as="section" className="mt-16 mb-24 text-center">
          <h2 className="text-xl font-semibold">Want to see more? Let’s connect.</h2>
          <p className="mt-2 text-[#c6d6e3]">I’m open to collaborations and freelance work.</p>
          <a href="/#contact" className="mt-4 inline-flex rounded-full border border-[#00b4ff] bg-[#00b4ff1a] px-4 py-2 text-[#00b4ff]">Contact</a>
        </RevealOnScroll>
      </main>

      <ImageLightbox
        isOpen={!!active}
        images={active?.gallery ?? []}
        title={active?.title}
        description={active?.description}
        role={active?.role}
        stack={active?.stack}
        features={active?.features}
        links={active?.links}
        onClose={() => setActive(null)}
      />
    </div>
  );
}


