import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import App from "./pages/App/App.jsx";
import { cognitoAuthConfig } from "./config/oidcConfig.js";

import "react-color-palette/css";

const onSigninCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig} onSigninCallback={onSigninCallback}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
