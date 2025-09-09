export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  tech?: string[];
  category: 'Web' | 'Design' | 'School' | 'Client';
  cover: string;
  gallery: string[];
  links: { github?: string; demo?: string; case?: string };
  role?: string;
  stack?: string[];
  features?: string[];
  alt: string;
};

export const projects: Project[] = [
  {
    id: 'rejseguide',
    title: 'Rejseguide Website',
    description: 'Travel guide platform with curated destinations and clean UI.',
    tags: ['Web', 'UI', 'React'],
    category: 'School',
    cover: 'https://picsum.photos/seed/rejse/1280/720',
    gallery: [
      'https://picsum.photos/seed/rejse-1/1600/900',
      'https://picsum.photos/seed/rejse-2/1600/900',
      'https://picsum.photos/seed/rejse-3/1600/900',
    ],
    links: { demo: '#', github: '#', case: '#' },
    role: 'Front-end',
    stack: ['React', 'CSS'],
    tech: ['React', 'Tailwind', 'Figma'],
    features: ['Responsive layout', 'Curated content', 'Clean navigation'],
    alt: 'Rejseguide project cover image',
  },
  {
    id: 'spotit',
    title: 'Spotit – Smart Parking',
    description: 'Find available parking spots, with simple route planning.',
    tags: ['UI', 'Prototype'],
    category: 'School',
    cover: 'https://picsum.photos/seed/spotit/1280/720',
    gallery: [
      'https://picsum.photos/seed/spotit-1/1600/900',
      'https://picsum.photos/seed/spotit-2/1600/900',
    ],
    links: { demo: '#', github: '#', case: '#' },
    role: 'Product design',
    stack: ['Figma'],
    tech: ['Figma', 'Prototype'],
    features: ['Map view', 'Simple flows'],
    alt: 'Spotit app mockups',
  },
  {
    id: 'scana',
    title: 'Scana – The Opinion App',
    description: 'Quick polls and anonymous feedback for better decisions.',
    tags: ['Web', 'UI'],
    category: 'Client',
    cover: 'https://picsum.photos/seed/scana/1280/720',
    gallery: [
      'https://picsum.photos/seed/scana-1/1600/900',
      'https://picsum.photos/seed/scana-2/1600/900',
    ],
    links: { demo: '#', github: '#', case: '#' },
    role: 'Front-end',
    stack: ['React', 'TypeScript'],
    tech: ['React', 'TypeScript'],
    features: ['Auth flow', 'Feed UI'],
    alt: 'Scana app screens',
  },
  {
    id: 'naturnat',
    title: 'Naturnat – Nature Trips',
    description: 'Plan weekend trips with weather insights and routes.',
    tags: ['Web', 'UI'],
    category: 'School',
    cover: 'https://picsum.photos/seed/naturnat/1280/720',
    gallery: [
      'https://picsum.photos/seed/naturnat-1/1600/900',
      'https://picsum.photos/seed/naturnat-2/1600/900',
    ],
    links: { demo: '#', github: '#', case: '#' },
    role: 'Front-end',
    stack: ['HTML', 'CSS', 'Bootstrap'],
    tech: ['HTML', 'Bootstrap'],
    features: ['Weather API', 'Contact form'],
    alt: 'Naturnat website preview',
  },
  {
    id: 'portfolio',
    title: 'Portfolio Redesign',
    description: 'Dark, gradient-accented portfolio with smooth interactions.',
    tags: ['Web', 'UI'],
    category: 'Web',
    cover: 'https://picsum.photos/seed/portfolio/1280/720',
    gallery: [
      'https://picsum.photos/seed/portfolio-1/1600/900',
      'https://picsum.photos/seed/portfolio-2/1600/900',
    ],
    links: { demo: '#', github: '#', case: '#' },
    role: 'Front-end',
    stack: ['React', 'Tailwind'],
    tech: ['React', 'Tailwind'],
    features: ['Animations', 'Responsive grid'],
    alt: 'Portfolio landing section screenshot',
  },
  {
    id: 'clientsite',
    title: 'Client Marketing Site',
    description: 'Clean marketing site with CMS and optimized images.',
    tags: ['Web', 'Client'],
    category: 'Client',
    cover: 'https://picsum.photos/seed/client/1280/720',
    gallery: [
      'https://picsum.photos/seed/client-1/1600/900',
      'https://picsum.photos/seed/client-2/1600/900',
    ],
    links: { demo: '#', github: '#', case: '#' },
    role: 'Front-end',
    stack: ['Next.js', 'Tailwind'],
    tech: ['Next.js', 'Tailwind'],
    features: ['CMS integration', 'SEO basics'],
    alt: 'Client site hero section',
  },
];


