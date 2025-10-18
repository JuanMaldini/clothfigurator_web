import "./projects.css";
import HeroCarousel from "../../components/HeroCarousel/HeroCarousel";
import {
  CLOTHFIGURATOR_MEDIA,
  VIRTUAL_OFFICE_MEDIA,
  CONFIGURATOR_MEDIA,
} from "./projectsData";

const Projects = () => (
  <div className="projects-page">
    <section className="projects-headline" aria-label="Projects introduction">
      <p className="projects-headline__eyebrow">Selected works</p>
      <h1 className="projects-headline__title">Explore Interactive Projects</h1>
      <p className="projects-headline__lead">
        Digital experiences that combine three-dimensional interfaces,
        personalization, and dynamic content.
      </p>
    </section>

    <section className="projects-grid">
      <article className="projects-block">
        <h2 className="projects-block__title">Clothfigurator</h2>
        <p className="projects-block__description">
          Real-time textile configurator that lets you visualize combinations,
          finishes, and product variants without friction.
        </p>
        <HeroCarousel items={CLOTHFIGURATOR_MEDIA} label="Clothfigurator" />
      </article>

      <article className="projects-block">
        <h2 className="projects-block__title">Virtual Office</h2>
        <p className="projects-block__description">
          Virtual office with immersive tours that integrate hotspots,
          audiovisual content, and contextual interaction.
        </p>
        <HeroCarousel items={VIRTUAL_OFFICE_MEDIA} label="Virtual Office" />
      </article>

      <article className="projects-block">
        <h2 className="projects-block__title">Configurator</h2>
        <p className="projects-block__description">
          3D configurator for retail that accelerates purchasing decisions and
          reduces production time.
        </p>
        <HeroCarousel items={CONFIGURATOR_MEDIA} label="Configurator" />
      </article>
    </section>
  </div>
);

export default Projects;
