import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Auth.css";

/**
 * LoginForm - Formulario de inicio de sesión
 *
 * Permite a los usuarios autenticarse con email/username y contraseña.
 * Utiliza AWS Cognito para la autenticación.
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Maneja cambios en los inputs del formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar errores al escribir
    if (error) setError("");
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validación básica
    if (!formData.username || !formData.password) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        // Login exitoso - redirigir al control panel
        navigate("/controlpanel");
      } else {
        // Error en login
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error en handleSubmit:", err);
      setError("Error inesperado al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Iniciar Sesión</h1>

        {/* Mostrar errores */}
        {(error || authError) && (
          <div className="auth-error">{error || authError}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Campo de email/username */}
          <div className="form-field">
            <label htmlFor="username">Email o Usuario</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="tu@email.com"
              autoComplete="username"
              disabled={loading}
              required
            />
          </div>

          {/* Campo de contraseña */}
          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>

          {/* Botón de envío */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
