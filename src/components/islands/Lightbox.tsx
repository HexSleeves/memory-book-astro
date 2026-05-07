import { useEffect, useRef, useState, useCallback } from "react";
import type { StripPhoto } from "./FilmStrip";

interface OpenDetail {
  chapter: string;
  label: string;
  photos: StripPhoto[];
  startIndex: number;
}

export default function Lightbox() {
  const [state, setState] = useState<OpenDetail | null>(null);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setState(null);
    if (previousFocus.current) previousFocus.current.focus();
    previousFocus.current = null;
  }, []);

  const next = useCallback(() => {
    setState((s) => {
      if (!s) return s;
      setIndex((i) => (i + 1) % s.photos.length);
      return s;
    });
  }, []);

  const prev = useCallback(() => {
    setState((s) => {
      if (!s) return s;
      setIndex((i) => (i - 1 + s.photos.length) % s.photos.length);
      return s;
    });
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<OpenDetail>).detail;
      previousFocus.current = document.activeElement as HTMLElement | null;
      setState(detail);
      setIndex(detail.startIndex);
    };
    window.addEventListener("gallery:open", handler);
    return () => window.removeEventListener("gallery:open", handler);
  }, []);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [state, close, next, prev]);

  if (!state) return null;

  const photo = state.photos[index];

  return (
    <div
      ref={dialogRef}
      className="lb-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${state.label}, photo ${index + 1} of ${state.photos.length}`}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="lb-frame">
        <button type="button" className="lb-close" aria-label="Close" onClick={close}>
          ✕
        </button>
        <button
          type="button"
          className="lb-nav lb-prev"
          aria-label="Previous photo"
          onClick={prev}
          disabled={state.photos.length < 2}
        >
          ←
        </button>
        <figure className="lb-figure">
          <img
            src={photo.src}
            srcSet={photo.srcset}
            sizes="(max-width: 768px) 92vw, 80vw"
            alt={photo.caption}
          />
          <figcaption>
            <span className="lb-caption">{photo.caption}</span>
            <span className="lb-meta">
              {photo.year && <span>{photo.year}</span>}
              <span className="lb-counter">
                {index + 1} / {state.photos.length}
              </span>
            </span>
          </figcaption>
        </figure>
        <button
          type="button"
          className="lb-nav lb-next"
          aria-label="Next photo"
          onClick={next}
          disabled={state.photos.length < 2}
        >
          →
        </button>
      </div>
    </div>
  );
}
