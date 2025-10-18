import { createContext, useContext, useState, useEffect } from "react";
import {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      if (session.tokens) {
        setUser({
          username: currentUser.username,
          userId: currentUser.userId,
          signInDetails: currentUser.signInDetails,
        });
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función de login
   * @param {string} username - Email o username del usuario
   * @param {string} password - Contraseña del usuario
   */
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);

      const { isSignedIn, nextStep } = await signIn({
        username,
        password,
      });

      if (isSignedIn) {
        await checkUser();
        return { success: true };
      }

      return { success: false, nextStep };
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Error al iniciar sesión");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
      return { success: true };
    } catch (err) {
      console.error("Error en logout:", err);
      setError(err.message || "Error al cerrar sesión");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    checkUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
