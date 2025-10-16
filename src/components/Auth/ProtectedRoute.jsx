import { Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "../LoadingSpinner/LoadingSpinner.css";

/**
 * ProtectedRoute - Componente para proteger rutas privadas con OIDC
 *
 * Verifica si el usuario está autenticado antes de permitir el acceso.
 * Si no está autenticado, inicia el flujo de login de Cognito.
 *
 * @param {React.Component} children - Componente hijo a renderizar si está autenticado
 */
const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (auth.isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <LoadingSpinner message="Verificando autenticación..." />
      </div>
    );
  }

  // Si hay error de autenticación
  if (auth.error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <p>Error de autenticación: {auth.error.message}</p>
        <button onClick={() => auth.signinRedirect()}>
          Intentar nuevamente
        </button>
      </div>
    );
  }

  // Si no está autenticado, iniciar login con Cognito
  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <LoadingSpinner message="Redirigiendo al login..." />
      </div>
    );
  }

  // Si está autenticado, mostrar el componente
  return children;
};

export default ProtectedRoute;
