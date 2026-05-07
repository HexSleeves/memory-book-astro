import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

export interface StripPhoto {
  srcset: string;
  src: string;
  width: number;
  height: number;
  caption: string;
  year?: string;
  tape?: "yellow" | "blue" | "rose";
  tilt: number;
}

interface Props {
  label: string;
  chapter: string;
  photos: StripPhoto[];
}

export default function FilmStrip({ label, chapter, photos }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const compute = () => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;
      setMaxScroll(Math.max(0, track.scrollWidth - container.clientWidth));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [photos.length]);

  const openLightbox = (index: number) => {
    window.dispatchEvent(
      new CustomEvent("gallery:open", {
        detail: { chapter, label, photos, startIndex: index },
      }),
    );
  };

  const scrollBy = (delta: number) => {
    const next = Math.min(0, Math.max(-maxScroll, x.get() + delta));
    x.set(next);
  };

  return (
    <div className="strip-wrap" ref={containerRef}>
      <div className="strip-head">
        <h3 className="strip-label">{label}</h3>
        <div className="strip-controls" aria-hidden={maxScroll === 0}>
          <button
            type="button"
            className="strip-btn"
            aria-label={`Scroll ${label} left`}
            onClick={() => scrollBy(360)}
            disabled={maxScroll === 0}
          >
            ←
          </button>
          <button
            type="button"
            className="strip-btn"
            aria-label={`Scroll ${label} right`}
            onClick={() => scrollBy(-360)}
            disabled={maxScroll === 0}
          >
            →
          </button>
        </div>
      </div>

      <div
        className="strip-viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${label} photo strip`}
      >
        <motion.div
          ref={trackRef}
          className="strip-track"
          drag={maxScroll > 0 ? "x" : false}
          dragConstraints={{ left: -maxScroll, right: 0 }}
          dragElastic={0.08}
          dragMomentum={true}
          style={{ x }}
        >
          {photos.map((p, i) => (
            <button
              key={i}
              type="button"
              className="strip-photo polaroid taped"
              data-tape={p.tape}
              style={{ ["--polaroid-tilt" as string]: `${p.tilt}deg` }}
              onClick={() => openLightbox(i)}
              aria-label={`Open photo: ${p.caption}`}
            >
              <img
                src={p.src}
                srcSet={p.srcset}
                width={p.width}
                height={p.height}
                sizes="(max-width: 640px) 70vw, 280px"
                loading="lazy"
                decoding="async"
                alt={p.caption}
                draggable={false}
              />
              <figcaption>
                <span className="caption">{p.caption}</span>
                {p.year && <span className="year">{p.year}</span>}
              </figcaption>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
