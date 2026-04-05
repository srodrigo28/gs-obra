import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { AuthUser } from '@/types/auth-types';

type SessionContextValue = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<SessionContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      signIn: (nextUser) => setUser(nextUser),
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }

  return context;
}
