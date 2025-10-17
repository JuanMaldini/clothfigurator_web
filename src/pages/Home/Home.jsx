import "./Home.css";
import HeroCarousel from "../../components/HeroCarousel";
import { ALL_PROJECTS_MEDIA } from "../Projects/projectsData";

const Home = () => (
  <section className="home">
    {/* Hero with carousel + overlay copy */}
    <div className="hero-carousel-wrapper">
      <HeroCarousel
        items={ALL_PROJECTS_MEDIA}
        label="Projects Showcase"
        intervalMs={4000}
        random={true}
      />
      <div className="hero-overlay">
        <div className="hero-inner">
          <h1 className="hero-title">Configurate your experience</h1>
          <p className="hero-sub">Design. Visualize. Iterate.</p>
          <div className="hero-actions">
            <a className="btn" href="/projects">Explore Projects</a>
            <a className="btn ghost" href="/controlpanel">Open Control Panel</a>
          </div>
        </div>
      </div>
    </div>

    {/* Second hero with carousel + CTA */}
    <div className="hero-carousel-wrapper">
      <HeroCarousel
        items={ALL_PROJECTS_MEDIA}
        label="Create with Confidence"
        intervalMs={4000}
        random={true}
      />
      <div className="hero-overlay">
        <div className="hero-inner">
          <h2 className="hero-title small">Create with Confidence</h2>
          <p className="hero-sub">Bring your models and textures, experiment quickly, and share your vision.</p>
          <div className="hero-actions">
            <button
              className="btn outline"
              type="button"
              onClick={() => {
                try {
                  // Smooth scroll to bottom
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  // Highlight footer contact link after scrolling
                  const el = document.getElementById('footer-contact-link');
                  if (el) {
                    el.classList.remove('highlight');
                    // reflow to restart animation
                    // eslint-disable-next-line no-unused-expressions
                    void el.offsetWidth;
                    el.classList.add('highlight');
                    el.focus({ preventScroll: true });
                  }
                } catch {}
              }}
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Home;