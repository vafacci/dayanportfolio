import React from 'react';
import { Mail, Linkedin, Github, Instagram } from 'lucide-react';

export type SocialLink = {
  id: 'mail' | 'linkedin' | 'github' | 'instagram';
  label: string;
  href: string;
  external?: boolean;
};

export const socialLinks: SocialLink[] = [
  { id: 'mail', label: 'Email', href: 'mailto:vafaivafai@gmail.com' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/', external: true },
  { id: 'github', label: 'GitHub', href: 'https://github.com/dayanvafai', external: true },
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/', external: true },
];

type Props = {
  links?: SocialLink[];
  className?: string;
};

export const SocialLinks: React.FC<Props> = ({ links = socialLinks, className }) => {
  return (
    <div className={
      'flex flex-wrap items-center gap-3 ' + (className ?? '')
    }>
      {links.map((item) => {
        const common = 'inline-flex items-center justify-center h-10 w-10 rounded-2xl border border-white/10 bg-white/5 text-[#c6d6e3] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#00b4ff]';
        const aria = item.id === 'mail' ? 'Email' : item.label;
        const rel = item.external ? 'noopener noreferrer me' : 'me';
        const target = item.external ? '_blank' : undefined;
        const Icon = item.id === 'mail' ? Mail : item.id === 'linkedin' ? Linkedin : item.id === 'github' ? Github : Instagram;
        return (
          <a
            key={item.id}
            href={item.href}
            target={target}
            rel={rel}
            aria-label={aria}
            className={common}
          >
            <Icon size={18} aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;


