export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  email: string;
  name: string;
};

export type AuthResult = {
  success: boolean;
  message: string;
  user?: AuthUser;
};

export type GoogleAuthConfig = {
  appUrlLocal: string;
  appUrlDns: string;
  redirectUrlLocal: string;
  redirectUrlDns: string;
  publicClientId: string;
};
