import "./V_Clothfigurator.css";

const VClothfigurator = () => (
  <div className="ip-page">
    <header className="ip-header">
      <p className="ip-eyebrow">Interactive project</p>
      <h1 className="ip-title">Clothfigurator</h1>
      <p className="ip-summary">
        Esta vista alojará el configurador textil interactivo original. Mientras
        terminamos la integración, puedes lanzar la versión disponible desde el
        panel de control.
      </p>
    </header>

    <div className="ip-actions">
      <button type="button" className="ip-button" disabled aria-disabled="true">
        Abrir clothfigurator
      </button>
      <span className="ip-hint">
        Previsualización temporalmente deshabilitada.
      </span>
    </div>

    <div className="ip-frame-wrap is-disabled" aria-disabled="true">
      <div className="ip-overlay">
        <p>Integraremos aquí el iframe definitivo del clothfigurator.</p>
      </div>
    </div>
  </div>
);

export default VClothfigurator;
