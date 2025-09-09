import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion, useReducedMotion } from 'framer-motion';

export type CarouselSlide = {
  id: string;
  content: React.ReactNode;
};

type Props = {
  slides: CarouselSlide[];
  className?: string;
};

export const ProjectsCarousel: React.FC<Props> = ({ slides, className }) => {
  const shouldReduce = useReducedMotion();
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: shouldReduce ? 10 : 20 }, shouldReduce ? [] : [autoplay.current]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={className} onMouseEnter={() => autoplay.current?.stop()} onMouseLeave={() => autoplay.current?.play()}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s) => (
            <div className="min-w-0 flex-[0_0_100%] px-2 sm:px-3" key={s.id}>
              <motion.div
                initial={shouldReduce ? undefined : { opacity: 0, y: 24 }}
                whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ amount: 0.2, once: true }}
                transition={shouldReduce ? undefined : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {s.content}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      {/* Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={
                'h-2.5 w-2.5 rounded-full border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#00b4ff] ' +
                (selectedIndex === i ? 'bg-[#00b4ff]' : 'bg-white/10 hover:bg-white/20')
              }
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous slide"
            onClick={() => emblaApi?.scrollPrev()}
            className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-[#c6d6e3] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#00b4ff]"
          >
            Prev
          </button>
          <button
            aria-label="Next slide"
            onClick={() => emblaApi?.scrollNext()}
            className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-[#c6d6e3] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#00b4ff]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCarousel;


