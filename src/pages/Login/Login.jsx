import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Login.css";

/**
 * LoginPage - Página de inicio de sesión con OIDC
 *
 * Muestra un botón para iniciar sesión con Cognito.
 * Si ya está autenticado, redirige al control panel.
 */
const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir al control panel
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/controlpanel");
    }
  }, [auth.isAuthenticated, navigate]);

  // Si está cargando
  if (auth.isLoading) {
    return (
      <div className="login-page">
        <div className="login-card">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Si hay error
  if (auth.error) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Error de Autenticación</h1>
          <p className="error-message">{auth.error.message}</p>
          <button
            className="login-button"
            onClick={() => auth.signinRedirect()}
          >
            Intentar Nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Iniciar Sesión</h1>
        <p className="login-description">
          Accede al panel de control y configuradores
        </p>
        <button className="login-button" onClick={() => auth.signinRedirect()}>
          Entrar con Cognito
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
