import { Amplify } from "aws-amplify";

/**
 * Configuración de AWS Amplify
 *
 * Inicializa AWS Amplify con la configuración de Cognito
 * Las variables de entorno deben estar configuradas en .env
 */

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,
      region: import.meta.env.VITE_AWS_COGNITO_REGION || "us-east-1",

      // Configuraciones opcionales
      loginWith: {
        email: true,
        username: true,
      },

      // Configuración de seguridad
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
};

/**
 * Configura AWS Amplify con los parámetros definidos
 */
export const configureAmplify = () => {
  try {
    Amplify.configure(amplifyConfig);
    console.log("✅ AWS Amplify configurado correctamente");
  } catch (error) {
    console.error("❌ Error al configurar AWS Amplify:", error);
  }
};

export default amplifyConfig;
