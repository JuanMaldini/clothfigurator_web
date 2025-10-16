import { createContext, useContext } from "react";
import { useAuth as useOidcAuth } from "react-oidc-context";

/**
 * AuthContext - Contexto de autenticación usando OIDC
 *
 * Wrapper alrededor de react-oidc-context para mantener
 * compatibilidad con el código existente.
 */
const AuthContext = createContext(null);

/**
 * Hook personalizado para acceder al contexto de autenticación
 * Adapta react-oidc-context a nuestra API anterior
 */
export const useAuth = () => {
  const auth = useOidcAuth();

  return {
    // Usuario actual
    user: auth.isAuthenticated
      ? {
          username: auth.user?.profile?.email || auth.user?.profile?.sub,
          userId: auth.user?.profile?.sub,
          email: auth.user?.profile?.email,
          profile: auth.user?.profile,
        }
      : null,

    // Estados
    loading: auth.isLoading,
    error: auth.error?.message || null,
    isAuthenticated: () => auth.isAuthenticated,

    // Acciones
    login: () => auth.signinRedirect(),
    logout: async () => {
      try {
        await auth.removeUser();
        // Redirigir a Cognito logout
        const clientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID;
        const logoutUri =
          import.meta.env.VITE_LOGOUT_URI || window.location.origin;
        const cognitoDomain = import.meta.env.VITE_AWS_COGNITO_DOMAIN;
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
        return { success: true };
      } catch (err) {
        console.error("Error en logout:", err);
        return { success: false, error: err.message };
      }
    },

    // Tokens (por si los necesitas)
    tokens: {
      idToken: auth.user?.id_token,
      accessToken: auth.user?.access_token,
      refreshToken: auth.user?.refresh_token,
    },

    // Objeto auth original por si necesitas acceso completo
    oidcAuth: auth,
  };
};

/**
 * Provider no es necesario ya que usamos AuthProvider de react-oidc-context
 * pero lo exportamos para mantener compatibilidad
 */
export const AuthProvider = ({ children }) => {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export default AuthContext;
