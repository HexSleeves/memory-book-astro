import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  audio: string;
  duration: string;
  side: "A" | "B";
  recordedOn?: string;
  align?: "left" | "right";
  transcript: string;
}

export default function CassetteCard({
  title,
  audio,
  duration,
  side,
  recordedOn,
  align = "left",
  transcript,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);

  const paragraphs = transcript
    .split(/\n\s*\n/)
    .map((p) => p.trim().replace(/\n/g, " "))
    .filter(Boolean);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      if (!a.duration || isNaN(a.duration)) return;
      setProgress(a.currentTime / a.duration);
    };
    const onEnd = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    const onError = () => setAudioFailed(true);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    a.addEventListener("error", onError);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("error", onError);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      a.play()
        .then(() => setIsPlaying(true))
        .catch(() => setAudioFailed(true));
    }
  };

  const bars = 32;

  return (
    <article className={`cassette align-${align}`} aria-labelledby={`tape-${title}`}>
      <div className="cassette-shell">
        <div className="cassette-label">
          <div className="cassette-side">
            <span className="cassette-side-label">Side {side}</span>
            <span className="cassette-duration">{duration}</span>
          </div>
          <h3 id={`tape-${title}`} className="cassette-title">
            {title}
          </h3>
          {recordedOn && <span className="cassette-recorded">{recordedOn}</span>}
        </div>

        <div className="cassette-reels" aria-hidden="true">
          <motion.div
            className="reel"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
          >
            <div className="reel-spokes" />
          </motion.div>
          <motion.div
            className="reel"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
          >
            <div className="reel-spokes" />
          </motion.div>
        </div>

        <div className="cassette-window" aria-hidden="true">
          <div className="waveform">
            {Array.from({ length: bars }).map((_, i) => {
              const playing = i / bars < progress;
              return (
                <span
                  key={i}
                  className={`bar ${playing ? "playing" : ""}`}
                  style={{ ["--h" as string]: `${20 + ((i * 7) % 60)}%` }}
                />
              );
            })}
          </div>
        </div>

        <div className="cassette-actions">
          <button
            type="button"
            className="play-btn"
            onClick={toggle}
            aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
            aria-pressed={isPlaying}
            disabled={audioFailed}
          >
            {audioFailed ? "…" : isPlaying ? "❚❚" : "▶"}
          </button>
          <button
            type="button"
            className="transcript-btn"
            onClick={() => setTranscriptOpen((v) => !v)}
            aria-expanded={transcriptOpen}
          >
            {transcriptOpen ? "Hide transcript" : "Show transcript"}
          </button>
        </div>

        <audio ref={audioRef} src={audio} preload="metadata" />
      </div>

      <div className={`cassette-transcript prose ${transcriptOpen ? "open" : ""}`} hidden={!transcriptOpen}>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {audioFailed && (
        <p className="cassette-error" role="status">
          Audio unavailable. The transcript above is the full message.
        </p>
      )}
    </article>
  );
}
