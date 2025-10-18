import { useAuth } from "react-oidc-context";

/**
 * UserInfo - Componente para mostrar información del usuario autenticado con OIDC
 *
 * Muestra el email/username y un botón de logout opcional.
 * Útil para incluir en páginas protegidas.
 */
const UserInfo = ({ showLogout = true }) => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return null;
  }

  const user = auth.user?.profile;
  const displayName = user?.email || user?.preferred_username || user?.sub;

  const handleLogout = async () => {
    try {
      await auth.removeUser();
      const clientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID;
      const logoutUri =
        import.meta.env.VITE_LOGOUT_URI || window.location.origin;
      const cognitoDomain = import.meta.env.VITE_AWS_COGNITO_DOMAIN;
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
        logoutUri
      )}`;
    } catch (error) {
    }
  };

  return (
    <div className="user-info">
      <div className="user-info-content">
        <span className="user-info-icon">👤</span>
        <div className="user-info-details">
          <p className="user-info-username">{displayName}</p>
          <p className="user-info-label">Usuario autenticado</p>
        </div>
      </div>
      {showLogout && (
        <button
          onClick={handleLogout}
          className="user-info-logout-btn"
          aria-label="Cerrar sesión"
        >
          Cerrar sesión
        </button>
      )}
    </div>
  );
};

export default UserInfo;
