import { useState } from "react";
import "./users.css";

const UsersPage = () => {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'

  return (
    <div>

      {mode === "login" ? (
        <section className="users-page">
          <div className="login-card" role="form" aria-labelledby="login-title">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <h1 id="login-title" className="login-title" style={{ margin: 0 }}>Login</h1>
              <button className="btn outline" type="button" onClick={() => setMode('signup')} aria-label="Sign up" style={{ height: 32 }}>Sign up</button>
            </div>
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              <label className="field">
                <span className="label"></span>
                <input className="input" type="email" name="email" autoComplete="email" placeholder="your@email.com" required />
              </label>
              <label className="field">
                <span className="label"></span>
                <input className="input" type="password" name="password" autoComplete="current-password" placeholder="••••••••" required />
              </label>
              <button className="submit" type="submit">Enter</button>
            </form>
          </div>
        </section>
      ) : (
        <section className="users-page">
          <div className="login-card" role="form" aria-labelledby="signup-title">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <h1 id="signup-title" className="login-title" style={{ margin: 0 }}>Sign up</h1>
              <button className="btn outline" type="button" onClick={() => setMode('login')} aria-label="Switch to Login" style={{ height: 32 }} >Login</button>
            </div>
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              <label className="field">
                <span className="label"></span>
                <input className="input" type="email" name="email" autoComplete="email" placeholder="your@email.com" required />
              </label>
              <label className="field">
                <span className="label"></span>
                <input className="input" type="password" name="password" autoComplete="new-password" placeholder="••••••••" required />
              </label>
              <button className="submit" type="submit">Create</button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
};

export default UsersPage;
