import { Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "../LoadingSpinner/LoadingSpinner.css";

/**
 * @param {React.Component} children - Componente hijo a renderizar si está autenticado
 */
const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

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

  return children;
};

export default ProtectedRoute;
