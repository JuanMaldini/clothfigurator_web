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

const HeroCarousel = ({ items = [], intervalMs = 3500, label = "Hero" }) => {
  const slides = useMemo(() => normalizeItems(items), [items]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timerId = setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      intervalMs
    );
    return () => clearInterval(timerId);
  }, [slides.length, intervalMs]);

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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
