import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type ImageLightboxProps = {
  isOpen: boolean;
  images: string[];
  startIndex?: number;
  title?: string;
  description?: string;
  role?: string;
  stack?: string[];
  features?: string[];
  links?: { github?: string; demo?: string };
  onClose: () => void;
};

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  images,
  startIndex = 0,
  title,
  description,
  role,
  stack,
  features,
  links,
  onClose,
}) => {
  const shouldReduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Focus trap minimal: move focus inside when opened
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          aria-modal
          role="dialog"
          aria-label={title ?? 'Project details'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: shouldReduce ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: shouldReduce ? 1 : 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] text-[#f5f7fa] shadow-2xl"
            initial={{ y: shouldReduce ? 0 : 24, opacity: shouldReduce ? 1 : 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: shouldReduce ? 0 : 24, opacity: shouldReduce ? 1 : 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#00b4ff]"
              aria-label="Close dialog"
            >
              ✕
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-4 md:p-6">
                <div className="aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <img src={images[startIndex]} alt={title ?? 'Project image'} className="h-full w-full object-cover" loading="eager" />
                </div>
              </div>
              <div className="flex flex-col gap-3 p-4 md:p-6">
                {title && <h2 className="text-xl font-semibold">{title}</h2>}
                {description && <p className="text-sm text-[#c6d6e3]">{description}</p>}
                {role && (
                  <p className="text-sm"><span className="text-[#8bb8d8]">Role:</span> {role}</p>
                )}
                {stack && stack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {stack.map((s) => (
                      <span key={s} className="rounded-full border border-[#00b4ff33] bg-[#00b4ff12] px-2.5 py-1 text-xs text-[#8bb8d8]">{s}</span>
                    ))}
                  </div>
                )}
                {features && features.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-[#c6d6e3]">
                    {features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
                {(links?.github || links?.demo) && (
                  <div className="mt-2 flex gap-3">
                    {links.github && (
                      <a href={links.github} className="rounded-lg border border-[#00b4ff66] px-3 py-2 text-sm text-[#8bb8d8] hover:border-[#00b4ff] hover:text-[#00b4ff]" target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    )}
                    {links.demo && (
                      <a href={links.demo} className="rounded-lg border border-[#00b4ff66] px-3 py-2 text-sm text-[#8bb8d8] hover:border-[#00b4ff] hover:text-[#00b4ff]" target="_blank" rel="noreferrer">
                        Live demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


