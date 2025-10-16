import "./V_Configurator_01.css";

function VConfigurator01() {
  const iframeSrc = import.meta.env.VITE_VCONFIGURATOR01_IFRAME_SRC || "";

  return (
    <div className="rooot">
      <iframe
        style={{ visibility: "visible", border: "none" }}
        id="iframe_1"
        src={iframeSrc}
        height="100%"
        width="100%"
        allowFullScreen
        title="V Configurator"
      />
      {!iframeSrc && (
        <p className="ip-hint">
          Define la clave <code>VITE_VCONFIGURATOR01_IFRAME_SRC</code> en tu entorno para habilitar la
          vista.
        </p>
      )}
    </div>
  );
}

export default VConfigurator01;