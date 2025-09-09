import React, { useState } from 'react';

type NavItem = { label: string; href: string; isActive?: boolean };

type NavbarProps = {
  current?: 'Projects' | 'About' | 'Skills' | 'Contact';
};

export const Navbar: React.FC<NavbarProps> = ({ current }) => {
  const [open, setOpen] = useState(false);
  const items: NavItem[] = [
    { label: 'Projects', href: '/#projects' },
    { label: 'About', href: '/#about' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Contact', href: '/#contact' },
  ].map((it) => ({ ...it, isActive: it.label === current }));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0b1220]/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="text-sm font-semibold text-[#8bb8d8] hover:text-[#00b4ff]">DV</a>
        <button
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-[#c6d6e3] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#00b4ff] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
        <ul className="hidden items-center gap-6 md:flex">
          {items.map((it) => (
            <li key={it.label}>
              {it.isActive ? (
                <span className="text-[#00b4ff]">{it.label}</span>
              ) : (
                <a href={it.href} className="text-[#8bb8d8] hover:text-[#00b4ff]">{it.label}</a>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div id="mobile-nav" className={(open ? 'block' : 'hidden') + ' border-t border-white/5 bg-[#0b1220]/80 md:hidden'}>
        <ul className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          {items.map((it) => (
            <li key={it.label} className="py-1.5">
              {it.isActive ? (
                <span className="text-[#00b4ff]">{it.label}</span>
              ) : (
                <a href={it.href} className="text-[#8bb8d8] hover:text-[#00b4ff]">{it.label}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;


