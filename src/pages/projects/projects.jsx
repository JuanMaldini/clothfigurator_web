import "./Projects.css";
import HeroCarousel from "../../components/HeroCarousel";
import {
  CLOTHFIGURATOR_MEDIA,
  VIRTUAL_OFFICE_MEDIA,
  CONFIGURATOR_MEDIA,
} from "./projectsData";

const Projects = () => (
  <div className="projects-page">
    <section
      className="projects-headline"
      aria-label="Introducción a los proyectos"
    >
      <p className="projects-headline__eyebrow">Selected works</p>
      <h1 className="projects-headline__title">Explore Interactive Projects</h1>
      <p className="projects-headline__lead">
        Experiencias digitales que combinan interfaces tridimensionales,
        personalización y contenido dinámico.
      </p>
    </section>

    <section className="projects-grid">
      <article className="projects-block">
        <p className="projects-block__description">
          Configurador textil en tiempo real que permite visualizar
          combinaciones, acabados y variantes de producto sin fricciones.
        </p>
        <HeroCarousel items={CLOTHFIGURATOR_MEDIA} label="Clothfigurator" />
      </article>

      <article className="projects-block">
        <p className="projects-block__description">
          Oficina virtual con recorridos inmersivos que integran hotspots,
          contenido audiovisual e interacción contextual.
        </p>
        <HeroCarousel items={VIRTUAL_OFFICE_MEDIA} label="Virtual Office" />
      </article>

      <article className="projects-block">
        <p className="projects-block__description">
          Configurador 3D orientado a retail que acelera decisiones de compra y
          reduce tiempos de producción.
        </p>
        <HeroCarousel items={CONFIGURATOR_MEDIA} label="Configurator" />
      </article>
    </section>
  </div>
);

export default Projects;
