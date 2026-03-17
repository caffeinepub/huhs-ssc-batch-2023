import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { GalleryEvent } from "../backend.d";

const FALLBACK_SLIDES = [
  {
    image: "/assets/generated/hero-slide1.dim_1200x600.jpg",
    title: "Welcome to SSC Batch 2023",
    subtitle: "Harishchar Union High School and College",
    desc: "Celebrating the academic journey and achievements of our batch.",
  },
  {
    image: "/assets/generated/hero-slide2.dim_1200x600.jpg",
    title: "Farewell Ceremony 2023",
    subtitle: "A Bittersweet Goodbye",
    desc: "Memories that will last a lifetime – our farewell celebration.",
  },
  {
    image: "/assets/generated/hero-slide3.dim_1200x600.jpg",
    title: "Annual Sports Day 2023",
    subtitle: "Champions Rise!",
    desc: "Students showcased their athletic excellence on the field.",
  },
];

interface HeroCarouselProps {
  galleryEvents?: GalleryEvent[];
}

export default function HeroCarousel({ galleryEvents }: HeroCarouselProps) {
  const slides =
    galleryEvents && galleryEvents.length > 0
      ? galleryEvents
          .flatMap((ev) =>
            ev.imageUrls.map((img, i) => ({
              image: img,
              title: ev.eventName,
              subtitle: `Photo ${i + 1}`,
              desc: `From the event: ${ev.eventName}`,
            })),
          )
          .slice(0, 6)
      : FALLBACK_SLIDES;

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-xl"
      style={{ height: "420px" }}
      data-ocid="hero.carousel"
    >
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/generated/hero-slide1.dim_1200x600.jpg";
            }}
          />
          <div className="absolute inset-0 hero-overlay" />
          <div className="absolute inset-0 flex flex-col justify-center pl-8 pr-12 sm:pl-14">
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-secondary text-sm font-semibold uppercase tracking-widest mb-2"
            >
              {slides[current].subtitle}
            </motion.p>
            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight max-w-xl"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm sm:text-base max-w-md"
            >
              {slides[current].desc}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={prev}
        data-ocid="hero.carousel.prev"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors z-10"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={next}
        data-ocid="hero.carousel.next"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors z-10"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((slide, i) => (
          <button
            type="button"
            key={slide.title + slide.subtitle}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
