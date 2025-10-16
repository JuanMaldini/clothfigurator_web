import "./projects.css";
import HeroCarousel from "../../components/HeroCarousel";

const CLOTHFIGURATOR_MEDIA = [
  "/projects/clothfiguraor/clothfigurator.png",
  "/projects/clothfiguraor/clothfigurator_01.jpg",
  "/projects/clothfiguraor/clothfigurator_02.jpg",
  "/projects/clothfiguraor/clothfigurator_03.jpg",
  "/projects/clothfiguraor/clothfigurator_04.jpg",
  "/projects/clothfiguraor/clothfigurator_05.jpg",
];

const VIRTUAL_OFFICE_MEDIA = [
  "/projects/v_office_01/office_01.png",
  "/projects/v_office_01/office_02.png",
  "/projects/v_office_01/office_03.png",
  "/projects/v_office_01/office_04.png",
  "/projects/v_office_01/office_05.png",
  "/projects/v_office_01/office_06.png",
  "/projects/v_office_01/office_07.png",
  "/projects/v_office_01/office_08.png",
];

const CONFIGURATOR_MEDIA = [
  "/projects/v_configurator_01/frame_01.png",
  "/projects/v_configurator_01/frame_02.png",
  "/projects/v_configurator_01/frame_03.png",
];

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
