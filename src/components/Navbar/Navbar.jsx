import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import "./Navbar.css";
import Logo from "../../../public/icons/Logo.png";


const Navbar = () => {
  const auth = useAuth();


  const handleLogout = async () => {
    try {
      await auth.removeUser();
      // Redirigir a Cognito logout
      const clientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID;
      const logoutUri =
        import.meta.env.VITE_LOGOUT_URI || window.location.origin;
      const cognitoDomain = import.meta.env.VITE_AWS_COGNITO_DOMAIN;
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
        logoutUri
      )}`;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <section>
      <header className="topsColor">
        <Link to="/" className="navbar-brand">
          <img src={Logo} width={32} alt="Clothfigurator Logo" />
          Vanishing Point 3D
        </Link>
        <nav>
          <Link to="/projects">Projects</Link>

          {/* Mostrar Control Panel solo si está logueado */}
          {/* {auth.isAuthenticated && ( */}
            <Link to="/controlpanel">Control Panel</Link>
          {/* }) */}

          {/* Mostrar Login o icono de Logout (✕) según el estado */}
          {auth.isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="nav-logout-icon"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              ✕
            </button>
          ) : (
            <Link to="/login" className="nav-login-btn">
              Login
            </Link>
          )}
        </nav>
      </header>
    </section>
  );
};

export default Navbar;
