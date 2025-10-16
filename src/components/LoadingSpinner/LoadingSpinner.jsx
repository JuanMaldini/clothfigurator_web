/**
 * LoadingSpinner - Componente de carga global
 *
 * Spinner reutilizable para mostrar estados de carga
 */
const LoadingSpinner = ({ size = "medium", message = "Cargando..." }) => {
  const sizeClasses = {
    small: "spinner-small",
    medium: "spinner-medium",
    large: "spinner-large",
  };

  return (
    <div className="loading-spinner-container">
      <div
        className={`loading-spinner ${sizeClasses[size] || sizeClasses.medium}`}
      >
        <div className="spinner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
