import "./users.css";

/**
 * UsersPage - Página de inicio de sesión
 *
 * Componente que muestra un formulario de login simple.
 * Los usuarios deben ser pre-creados por el administrador.
 */
const UsersPage = () => {
  return (
    <div>
      <section className="users-page">
        {/* Tarjeta de login con formulario de autenticación */}
        <div className="login-card" role="form" aria-labelledby="login-title">
          {/* Encabezado del formulario */}
          <h1 id="login-title" className="login-title">
            Login
          </h1>

          {/* Formulario de inicio de sesión */}
          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            {/* Campo de email */}
            <label className="field">
              <span className="label"></span>
              <input
                className="input"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="your@email.com"
                required
              />
            </label>

            {/* Campo de contraseña */}
            <label className="field">
              <span className="label"></span>
              <input
                className="input"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </label>

            {/* Botón de envío */}
            <button className="submit" type="submit">
              Enter
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default UsersPage;
