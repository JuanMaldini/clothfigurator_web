import "./users.css";

const UsersPage = () => (
  <div> {/*switch between login and signup forms*/}
    <section className="users-page">
      <div className="login-card" role="form" aria-labelledby="login-title">
        <h1 id="login-title" className="login-title">Iniciar sesión</h1>
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span className="label"></span>
            <input className="input" type="email" name="email" autoComplete="email" placeholder="tu@email.com" required />
          </label>
          <label className="field">
            <span className="label"></span>
            <input className="input" type="password" name="password" autoComplete="current-password" placeholder="••••••••" required />
          </label>
          <button className="submit" type="submit">Enter</button>
        </form>
      </div>
    </section>

    <section className="users-page">
      <div className="login-card" role="form" aria-labelledby="login-title">
        <h1 id="login-title" className="login-title">Crear cuenta</h1>
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span className="label"></span>
            <input className="input" type="email" name="email" autoComplete="email" placeholder="tu@email.com" required />
          </label>
          <label className="field">
            <span className="label"></span>
            <input className="input" type="password" name="password" autoComplete="current-password" placeholder="••••••••" required />
          </label>
          <button className="submit" type="submit">Create</button>
        </form>
      </div>
    </section>
  </div>

);

export default UsersPage;
