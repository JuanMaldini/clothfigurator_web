import "./Home.css";

const Home = () => (
  <section className="home">
    {/* Hero 1 */}
    <div className="hero hero-1">
      <div className="hero-inner">
        <h1 className="hero-title">Clothfigurator</h1>
        <p className="hero-sub">Design. Visualize. Iterate.</p>
        <div className="hero-actions">
          <a className="btn" href="/projects">Explore Projects</a>
          <a className="btn ghost" href="/controlpanel">Open Control Panel</a>
        </div>
      </div>
    </div>

    {/* Hero 2 */}
    <div className="hero hero-2">
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
  </section>
);

export default Home;