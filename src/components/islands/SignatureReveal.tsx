import { useEffect, useRef, useState } from "react";

interface Props {
  closing: string;
}

const PRIMARY_PATH =
  "M30 95 C 60 30, 95 130, 130 75 S 200 35, 235 95 Q 270 130, 300 60 T 380 90 Q 420 105, 455 65";
const ACCENT_PATH = "M85 110 Q 95 105, 110 110";

export default function SignatureReveal({ closing }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<SVGPathElement>(null);
  const accentRef = useRef<SVGPathElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const primary = primaryRef.current;
    const accent = accentRef.current;
    if (!wrap || !primary || !accent) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setupPath = (path: SVGPathElement, delayMs: number) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = reduceMotion ? "0" : String(len);
      path.style.transition = `stroke-dashoffset 2400ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`;
    };

    setupPath(primary, 0);
    setupPath(accent, 1400);

    if (reduceMotion) {
      setAnimated(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            primary.style.strokeDashoffset = "0";
            accent.style.strokeDashoffset = "0";
            setAnimated(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`sig ${animated ? "is-done" : ""}`} ref={wrapRef}>
      <p className="sig-closing">{closing}</p>
      <svg
        className="sig-glyph"
        viewBox="0 0 480 140"
        role="img"
        aria-label="Handwritten signature"
      >
        <path
          ref={primaryRef}
          d={PRIMARY_PATH}
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          ref={accentRef}
          d={ACCENT_PATH}
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.6}
          fill="none"
        />
      </svg>
    </div>
  );
}
