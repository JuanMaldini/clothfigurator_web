import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import App from "./pages/App/App.jsx";
import { cognitoAuthConfig } from "./config/oidcConfig.js";
import "./webVitals.js";

// LOG: Eventos de autenticación
const onSigninCallback = () => {
  console.log("✅ Auth Provider - onSigninCallback ejecutado");
  window.history.replaceState({}, document.title, window.location.pathname);
};

console.log("🚀 Main.jsx - Iniciando aplicación con AuthProvider");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig} onSigninCallback={onSigninCallback}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
