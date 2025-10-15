import { useEffect, useMemo, useState } from "react";
import "./projects.css";

const hero1Img1 = "https://vanishingpoint3d.com/wp-content/uploads/2024/11/O-0AAA.jpg";
const hero1Img2 = "https://vanishingpoint3d.com/wp-content/uploads/2024/11/O-3AA.jpg";
const hero1Img3 = "https://vanishingpoint3d.com/wp-content/uploads/2024/11/4-1.png";
const HERO1_ITEMS = [
  { type: 'image', src: hero1Img1 },
  { type: 'image', src: hero1Img2 },
  { type: 'image', src: hero1Img3 },
];

const hero2Img1 = "https://vanishingpoint3d.com/wp-content/uploads/2021/03/56.jpeg";
const hero2Img2 = "https://vanishingpoint3d.com/wp-content/uploads/2021/03/l.jpg";
const hero2Img3 = "https://vanishingpoint3d.com/wp-content/uploads/2021/03/99.jpg";
const HERO2_ITEMS = [
  { type: 'image', src: hero2Img1 },
  { type: 'image', src: hero2Img2 },
  { type: 'image', src: hero2Img3 },
];

const hero3Img1 = "https://vanishingpoint3d.com/wp-content/uploads/2024/11/O-6.jpg";
const hero3Img2 = "https://vanishingpoint3d.com/wp-content/uploads/2024/11/Ai-6-scaled.jpg";
const hero3Img3 = "https://vanishingpoint3d.com/wp-content/uploads/2024/12/WB-2.jpg";
const HERO3_ITEMS = [
  { type: 'image', src: hero3Img1 },
  { type: 'image', src: hero3Img2 },
  { type: 'image', src: hero3Img3 },
];

function HeroCarousel({ items, intervalMs = 3500, label = "Hero" }) {
  const validItems = useMemo(() => (Array.isArray(items) ? items.filter(Boolean) : []), [items]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (validItems.length <= 1) return; // no rotation needed
    const id = setInterval(() => setIndex((i) => (i + 1) % validItems.length), intervalMs);
    return () => clearInterval(id);
  }, [validItems.length, intervalMs]);

  const current = validItems[index];
  const hasContent = !!current && !!current.src;

  return (
    <div
      className="hero"
      style={{
        overflow: "hidden",
        position: "relative",
        display: "grid",
        justifyContent: "center",
        alignContent: "center",
        contain: "fit",
        height: "70dvh",

      }}
      aria-label={`${label} carousel`}
    >
      {hasContent ? (
        current.type === "video" ? (
          <video
            src={current.src}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            muted
            playsInline
            autoPlay
            loop
          />
        ) : (
          <img
            src={current.src}
            alt={label}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            color: "#6b7280",
            fontSize: 14,
          }}
        >
          {label} placeholder — agrega imágenes o videos
        </div>
      )}

      {/* simple indicators */}
      {validItems.length > 1 && (
        <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", gap: 6, justifyContent: "center" }}>
          {validItems.map((_, i) => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === index ? "#111827" : "#d1d5db" }} />
          ))}
        </div>
      )}
    </div>
  );
}

const Projects = () => (
  <div>

    <section style={{ justifyContent: "center", alignContent: "center", height: "20dvh", textAlign: "center"}}>
      Explore Interactive Projects
    </section>

    <section style={{ display: "grid", gap: 48 }}>

      <div style={{ display: "grid", gap: 12 }}>
        <p style={{ margin: 0, color: "#4B5563" }}>Texto descriptivo para el primer hero. Coloca aquí un breve mensaje o tagline.</p>
        <HeroCarousel items={HERO1_ITEMS} label="Hero 1" />
      </div>


      <div style={{ display: "grid", gap: 12 }}>
        <p style={{ margin: 0, color: "#4B5563" }}>Un segundo bloque con imágenes o videos en carrusel.</p>
        <HeroCarousel items={HERO2_ITEMS} label="Hero 2" />
      </div>


      <div style={{ display: "grid", gap: 12 }}>
        <p style={{ margin: 0, color: "#4B5563" }}>Tercer hero para destacar más contenido.</p>
        <HeroCarousel items={HERO3_ITEMS} label="Hero 3" />
      </div>

    </section>
  </div>
);

export default Projects;