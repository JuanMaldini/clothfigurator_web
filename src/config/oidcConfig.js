/**
 * Configuración OIDC para AWS Cognito
 *
 * Configuración usando react-oidc-context para autenticación
 * con AWS Cognito mediante OpenID Connect (OIDC)
 */
// Utiliza el origen actual en tiempo de ejecución como fallback
const runtimeOrigin = (() => {
  try {
    if (typeof window !== "undefined" && window.location?.origin) {
      return window.location.origin;
    }
  } catch {}
  return "http://localhost:5173";
})();

export const cognitoAuthConfig = {
  // Authority: URL del proveedor OIDC (Cognito User Pool)
  authority: import.meta.env.VITE_AWS_COGNITO_DOMAIN,

  // Client ID de la aplicación
  client_id: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,

  // URIs de redirección (permiten override por .env, si no usan el origen actual)
  redirect_uri: import.meta.env.VITE_REDIRECT_URI || runtimeOrigin,
  post_logout_redirect_uri: import.meta.env.VITE_LOGOUT_URI || runtimeOrigin,

  response_type: "code",

  // Alinear scopes con lo habilitado en Cognito (puedes añadir "profile" si lo habilitas)
  scope: import.meta.env.VITE_OIDC_SCOPE || "openid email phone",

  automaticSilentRenew: true,
  loadUserInfo: true,

  metadata: {
    // El issuer de los tokens de Cognito es el endpoint cognito-idp, no el dominio de Hosted UI
    issuer: `https://cognito-idp.${import.meta.env.VITE_AWS_COGNITO_REGION}.amazonaws.com/${import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID}`,
    authorization_endpoint: `${import.meta.env.VITE_AWS_COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `${import.meta.env.VITE_AWS_COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `${import.meta.env.VITE_AWS_COGNITO_DOMAIN}/oauth2/userInfo`,
    end_session_endpoint: `${import.meta.env.VITE_AWS_COGNITO_DOMAIN}/logout`,
  },
};

export const getCognitoLogoutUrl = () => {
  const clientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID;
  const logoutUri = import.meta.env.VITE_LOGOUT_URI || runtimeOrigin;
  const cognitoDomain = import.meta.env.VITE_AWS_COGNITO_DOMAIN;
  return `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
    logoutUri
  )}`;
};

export default cognitoAuthConfig;
