import type { AuthCredentials, AuthResult, GoogleAuthConfig } from '@/types/auth-types';

const DEFAULT_EMAIL = process.env.EXPO_PUBLIC_DEFAULT_AUTH_EMAIL ?? 'admin@gmail.com';
const DEFAULT_PASSWORD = process.env.EXPO_PUBLIC_DEFAULT_AUTH_PASSWORD ?? '12345678';

export function getDefaultAuthCredentials(): AuthCredentials {
  return {
    email: DEFAULT_EMAIL,
    password: DEFAULT_PASSWORD,
  };
}

export function validateLocalLogin(credentials: AuthCredentials): AuthResult {
  const normalizedEmail = credentials.email.trim().toLowerCase();
  const normalizedPassword = credentials.password.trim();

  if (!normalizedEmail || !normalizedPassword) {
    return {
      success: false,
      message: 'Informe o e-mail e a senha para entrar.',
    };
  }

  if (normalizedEmail !== DEFAULT_EMAIL.toLowerCase() || normalizedPassword !== DEFAULT_PASSWORD) {
    return {
      success: false,
      message: 'Credenciais invalidas. Verifique o usuario padrao configurado no .env.',
    };
  }

  return {
    success: true,
    message: 'Login realizado com sucesso.',
    user: {
      email: DEFAULT_EMAIL,
      name: 'Administrador GS',
    },
  };
}

export function getGoogleAuthConfig(): GoogleAuthConfig {
  return {
    appUrlLocal: process.env.EXPO_PUBLIC_APP_URL_LOCAL ?? '',
    appUrlDns: process.env.EXPO_PUBLIC_APP_URL_DNS ?? '',
    redirectUrlLocal: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URL_LOCAL ?? '',
    redirectUrlDns: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URL_DNS ?? '',
    publicClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '',
  };
}

export function isGoogleAuthConfigured() {
  const config = getGoogleAuthConfig();

  return Boolean(
    config.appUrlLocal &&
      config.appUrlDns &&
      config.redirectUrlLocal &&
      config.redirectUrlDns &&
      config.publicClientId &&
      config.publicClientId !== 'SEU_GOOGLE_CLIENT_ID_AQUI',
  );
}
