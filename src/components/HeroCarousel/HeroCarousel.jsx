import { useEffect, useMemo, useState } from "react";

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") {
        return { type: "image", src: item };
      }
      if (typeof item === "object" && item.src) {
        return { type: item.type || "image", src: item.src };
      }
      return null;
    })
    .filter(Boolean);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const HeroCarousel = ({
  items = [],
  intervalMs = 3500,
  label = "Hero",
  random = true,
}) => {
  const slides = useMemo(() => {
    const normalized = normalizeItems(items);
    return random ? shuffleArray(normalized) : normalized;
  }, [items, random]);

  const [index, setIndex] = useState(0);
  const [delayMs, setDelayMs] = useState(intervalMs);

  const goTo = (target) => {
    if (!Number.isFinite(target) || slides.length === 0) return;
    const next = ((target % slides.length) + slides.length) % slides.length;
    setIndex(next);
    setDelayMs(intervalMs);
  };

  const goNext = () => {
    if (slides.length === 0) return;
    setIndex((current) => (current + 1) % slides.length);
    setDelayMs(intervalMs);
  };

  const goPrev = () => {
    if (slides.length === 0) return;
    setIndex((current) => (current - 1 + slides.length) % slides.length);
    setDelayMs(intervalMs);
  };

  // Mantener sincronizado el delay por defecto si cambia la prop
  useEffect(() => {
    setDelayMs(intervalMs);
  }, [intervalMs]);

  // Autoplay con timeout reiniciable para controlar el delay tras interacción
  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timerId = setTimeout(() => {
      setIndex((current) => (current + 1) % slides.length);
      // Al avanzar automáticamente, restaura el delay por defecto
      setDelayMs(intervalMs);
    }, delayMs);
    return () => clearTimeout(timerId);
  }, [slides.length, index, delayMs, intervalMs]);

  useEffect(() => {
    if (index >= slides.length) {
      setIndex(0);
    }
  }, [slides.length, index]);

  const hasSlides = slides.length > 0;

  return (
    <div className="hero" aria-label={`${label} carousel`}>
      {hasSlides ? (
        slides.map((slide, slideIndex) =>
          slide.type === "video" ? (
            <video
              key={`video-${slideIndex}`}
              src={slide.src}
              className={`hero__media ${slideIndex === index ? "is-active" : ""}`}
              muted
              playsInline
              autoPlay
              loop
            />
          ) : (
            <img
              key={`image-${slideIndex}`}
              src={slide.src}
              alt={`${label} slide ${slideIndex + 1}`}
              className={`hero__media ${slideIndex === index ? "is-active" : ""}`}
            />
          )
        )
      ) : (
        <div className="hero__placeholder">
          {label} placeholder — agrega imágenes o videos
        </div>
      )}

      {slides.length > 1 && (
        <div className="hero__indicators">
          {slides.map((_, indicatorIndex) => (
            <span
              key={indicatorIndex}
              className={`hero__indicator ${indicatorIndex === index ? "is-active" : ""}`}
              onClick={() => goTo(indicatorIndex)}
              role="button"
              aria-label={`Go to slide ${indicatorIndex + 1}`}
              tabIndex={0}
            />
          ))}
        </div>
      )}

      {slides.length > 1 && (
        <div>
          <button type="button" onClick={goPrev} aria-label="Previous slide">
            Prev
          </button>
          <button type="button" onClick={goNext} aria-label="Next slide">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
