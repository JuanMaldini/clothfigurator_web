import { createContext, useContext } from "react";
import { useAuth as useOidcAuth } from "react-oidc-context";

const AuthContext = createContext(null);

export const useAuth = () => {
  const auth = useOidcAuth();

  return {
    user: auth.isAuthenticated
      ? {
          username: auth.user?.profile?.email || auth.user?.profile?.sub,
          userId: auth.user?.profile?.sub,
          email: auth.user?.profile?.email,
          profile: auth.user?.profile,
        }
      : null,

    loading: auth.isLoading,
    error: auth.error?.message || null,
    isAuthenticated: () => auth.isAuthenticated,

    login: () => auth.signinRedirect(),
    logout: async () => {
      try {
        await auth.removeUser();
        const clientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID;
        const logoutUri =
          import.meta.env.VITE_LOGOUT_URI || window.location.origin;
        const cognitoDomain = import.meta.env.VITE_AWS_COGNITO_DOMAIN;
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },

    tokens: {
      idToken: auth.user?.id_token,
      accessToken: auth.user?.access_token,
      refreshToken: auth.user?.refresh_token,
    },

    oidcAuth: auth,
  };
};

export const AuthProvider = ({ children }) => {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export default AuthContext;
