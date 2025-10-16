import { Amplify } from "aws-amplify";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,
      region: import.meta.env.VITE_AWS_COGNITO_REGION || "us-east-1",

      loginWith: {
        email: true,
        username: true,
      },

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

export const configureAmplify = () => {
  try {
    Amplify.configure(amplifyConfig);
    console.log("✅ AWS Amplify configurado correctamente");
  } catch (error) {
    console.error("❌ Error al configurar AWS Amplify:", error);
  }
};

export default amplifyConfig;
