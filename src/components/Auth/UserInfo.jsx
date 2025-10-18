import { useAuth } from "./AuthContext";

const UserInfo = ({ showLogout = true }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="user-info">
      <div className="user-info-content">
        <span className="user-info-icon">👤</span>
        <div className="user-info-details">
          <p className="user-info-username">{user.username}</p>
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
