import "./users.css";

const UsersPage = () => (
  <section className="users-page">
    <div className="login-card" role="form" aria-labelledby="login-title">
      <h1 id="login-title" className="login-title">Iniciar sesión</h1>
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <label className="field">
          <span className="label">Email</span>
          <input className="input" type="email" name="email" autoComplete="email" placeholder="tu@email.com" required />
        </label>
        <label className="field">
          <span className="label">Contraseña</span>
          <input className="input" type="password" name="password" autoComplete="current-password" placeholder="••••••••" required />
        </label>
        <button className="submit" type="submit">Entrar</button>
      </form>
    </div>
  </section>
);

export default UsersPage;
