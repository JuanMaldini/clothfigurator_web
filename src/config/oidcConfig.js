/**
 * Configuración OIDC para AWS Cognito
 *
 * Configuración usando react-oidc-context para autenticación
 * con AWS Cognito mediante OpenID Connect (OIDC)
 */



export const cognitoAuthConfig = {
  // Authority: URL del proveedor OIDC (Cognito User Pool)
  authority: import.meta.env.VITE_AWS_COGNITO_DOMAIN,

  // Client ID de la aplicación
  client_id: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,

  redirect_uri: import.meta.env.VITE_REDIRECT_URI || "http://localhost:5173",

  post_logout_redirect_uri:
    import.meta.env.VITE_LOGOUT_URI || "http://localhost:5173",

  response_type: "code",

  scope: "openid email profile phone aws.cognito.signin.user.admin",

  automaticSilentRenew: true,
  loadUserInfo: true,

  metadata: {
    issuer: import.meta.env.VITE_AWS_COGNITO_DOMAIN,
    authorization_endpoint: `${import.meta.env.VITE_AWS_COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `${import.meta.env.VITE_AWS_COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `${import.meta.env.VITE_AWS_COGNITO_DOMAIN}/oauth2/userInfo`,
    end_session_endpoint: `${import.meta.env.VITE_AWS_COGNITO_DOMAIN}/logout`,
  },
};

console.log("🔧 OIDC Config - Configuración completa:");

export const getCognitoLogoutUrl = () => {
  const clientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID;
  const logoutUri = import.meta.env.VITE_LOGOUT_URI || "http://localhost:5173";
  const cognitoDomain = import.meta.env.VITE_AWS_COGNITO_DOMAIN;

  return `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};

export default cognitoAuthConfig;
