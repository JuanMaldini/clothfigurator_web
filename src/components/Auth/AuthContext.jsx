import { createContext, useContext, useState, useEffect } from "react";
import {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";

/**
 * AuthContext - Contexto de autenticación global
 *
 * Maneja el estado de autenticación del usuario en toda la aplicación.
 * Proporciona funciones para login, logout y verificación de estado.
 */
const AuthContext = createContext(null);

/**
 * Hook personalizado para acceder al contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

/**
 * AuthProvider - Proveedor del contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Verifica si hay un usuario autenticado al cargar la aplicación
   */
  useEffect(() => {
    checkUser();
  }, []);

  /**
   * Verifica el estado actual de autenticación
   */
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
      // Usuario no autenticado
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

      // Manejar casos especiales (MFA, cambio de contraseña, etc.)
      return { success: false, nextStep };
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Error al iniciar sesión");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función de logout
   */
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

  /**
   * Verifica si el usuario está autenticado
   */
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
