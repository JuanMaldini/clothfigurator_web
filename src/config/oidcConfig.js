/**
 * Configuración OIDC para AWS Cognito
 *
 * Configuración usando react-oidc-context para autenticación
 * con AWS Cognito mediante OpenID Connect (OIDC)
 */

// LOG: Variables de entorno cargadas
console.log("🔧 OIDC Config - Variables de entorno:", {
  VITE_AWS_COGNITO_DOMAIN: import.meta.env.VITE_AWS_COGNITO_DOMAIN,
  VITE_AWS_COGNITO_CLIENT_ID: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,
  VITE_REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI,
  VITE_LOGOUT_URI: import.meta.env.VITE_LOGOUT_URI,
});

export const cognitoAuthConfig = {
  // Authority: URL del proveedor OIDC (Cognito User Pool)
  authority: import.meta.env.VITE_AWS_COGNITO_DOMAIN,

  // Client ID de la aplicación
  client_id: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,

  // URL de redirección después del login
  redirect_uri: import.meta.env.VITE_REDIRECT_URI || "http://localhost:5173",

  // URL de redirección después del logout
  post_logout_redirect_uri:
    import.meta.env.VITE_LOGOUT_URI || "http://localhost:5173",

  // Tipo de respuesta (code para Authorization Code Flow)
  response_type: "code",

  // Scopes solicitados
  scope: "openid email profile phone aws.cognito.signin.user.admin",

  // Configuraciones adicionales
  automaticSilentRenew: true, // Renovación automática de tokens
  loadUserInfo: true, // Cargar información del usuario

  // Metadata adicional (opcional)
  metadata: {
    issuer: import.meta.env.VITE_AWS_COGNITO_DOMAIN,
    authorization_endpoint: `${import.meta.env.VITE_AWS_COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `${import.meta.env.VITE_AWS_COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `${import.meta.env.VITE_AWS_COGNITO_DOMAIN}/oauth2/userInfo`,
    end_session_endpoint: `${import.meta.env.VITE_AWS_COGNITO_DOMAIN}/logout`,
  },
};

// LOG: Configuración final
console.log("🔧 OIDC Config - Configuración completa:", cognitoAuthConfig);

/**
 * Función helper para construir la URL de logout de Cognito
 */
export const getCognitoLogoutUrl = () => {
  const clientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID;
  const logoutUri = import.meta.env.VITE_LOGOUT_URI || "http://localhost:5173";
  const cognitoDomain = import.meta.env.VITE_AWS_COGNITO_DOMAIN;

  return `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};

export default cognitoAuthConfig;
