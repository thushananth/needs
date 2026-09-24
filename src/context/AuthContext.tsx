'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type UserRole = 'client' | 'provider';

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

/** A stored account can hold both a customer and a provider profile under one email. */
interface Account {
  name: string;
  email: string;
  roles: UserRole[];
  /** `salt:hash` (PBKDF2). Absent for social accounts and accounts created before passwords existed. */
  passwordHash?: string;
  social?: boolean;
}

export type AuthError = 'not-found' | 'bad-password' | 'use-social';
export type AuthOutcome = { user: AuthUser; error?: undefined } | { user?: undefined; error: AuthError };

export type RegisterResult = 'created' | 'exists' | 'role-conflict';

interface AuthContextValue {
  user: AuthUser | null;
  /** false until the stored session has been read on the client */
  ready: boolean;
  /** Signs in to an existing account after checking the password. */
  signIn: (email: string, password: string, preferredRole?: UserRole) => Promise<AuthOutcome>;
  /** Social sign-in: signs in, creating the account on first use. */
  signInSocial: (email: string, name: string, role: UserRole) => AuthUser;
  /**
   * Creates an account. Never overwrites: 'exists' means this email already has this role,
   * 'role-conflict' means it has only the other role and needs `addRole` after confirmation.
   */
  register: (
    user: AuthUser,
    password: string,
  ) => Promise<{ result: RegisterResult; existingRole?: UserRole; user?: AuthUser }>;
  /** Adds a role to an existing account (after the visitor confirmed and proved the password) and signs in as it. */
  addRole: (email: string, role: UserRole, password: string) => Promise<AuthOutcome>;
  /** Switches active session role between client and provider. */
  switchRole: (role: UserRole) => void;
  signOut: () => void;
  /** Runs `action` for a signed-in provider; otherwise sends the visitor to sign in / register first. */
  requireProvider: (action?: () => void) => void;
}

const SESSION_KEY = 'donow_session';
const ACCOUNTS_KEY = 'donow_accounts';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const toHex = (buf: ArrayBuffer | Uint8Array) =>
  Array.from(new Uint8Array(buf as ArrayBuffer), (b) => b.toString(16).padStart(2, '0')).join('');

const derive = async (password: string, salt: Uint8Array) => {
  const key = await window.crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await window.crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 100_000, hash: 'SHA-256' },
    key,
    256,
  );
  return toHex(bits);
};

const hashPassword = async (password: string) => {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  return `${toHex(salt)}:${await derive(password, salt)}`;
};

const verifyPassword = async (password: string, stored: string) => {
  const [saltHex, hash] = stored.split(':');
  const salt = new Uint8Array((saltHex.match(/../g) ?? []).map((h) => parseInt(h, 16)));
  return (await derive(password, salt)) === hash;
};

type StoredAccount = Partial<Account> & { role?: UserRole; email: string; name: string };

const normalizeAccount = (a: StoredAccount): Account => ({
  name: a.name,
  email: a.email,
  roles: a.roles ?? (a.role ? [a.role] : ['client']),
  passwordHash: a.passwordHash,
  social: a.social,
});

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readJSON<AuthUser | null>(SESSION_KEY, null));
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === SESSION_KEY || e.key === null) setUser(readJSON<AuthUser | null>(SESSION_KEY, null));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const startSession = (u: AuthUser) => {
    setUser(u);
    writeJSON(SESSION_KEY, u);
    return u;
  };

  const readAccounts = () => readJSON<Record<string, StoredAccount>>(ACCOUNTS_KEY, {});

  const authenticate = async (account: Account, password: string): Promise<AuthError | null> => {
    if (account.passwordHash) {
      return (await verifyPassword(password, account.passwordHash)) ? null : 'bad-password';
    }
    if (account.social) return 'use-social';
    account.passwordHash = await hashPassword(password);
    return null;
  };

  const register = useCallback(async (u: AuthUser, password: string) => {
    const accounts = readAccounts();
    const key = u.email.toLowerCase();
    const found = accounts[key];
    if (found) {
      const account = normalizeAccount(found);
      return account.roles.includes(u.role)
        ? { result: 'exists' as const, existingRole: u.role }
        : { result: 'role-conflict' as const, existingRole: account.roles[0] };
    }
    accounts[key] = { name: u.name, email: u.email, roles: [u.role], passwordHash: await hashPassword(password) };
    writeJSON(ACCOUNTS_KEY, accounts);
    return { result: 'created' as const, user: startSession(u) };
  }, []);

  const signIn = useCallback(async (email: string, password: string, preferredRole: UserRole = 'client') => {
    const accounts = readAccounts();
    const key = email.toLowerCase();
    if (!accounts[key]) return { error: 'not-found' as const };
    const account = normalizeAccount(accounts[key]);
    const error = await authenticate(account, password);
    if (error) return { error };
    if (!account.roles.includes(preferredRole)) {
      account.roles.push(preferredRole);
    }
    accounts[key] = account;
    writeJSON(ACCOUNTS_KEY, accounts);
    return { user: startSession({ name: account.name, email: account.email, role: preferredRole }) };
  }, []);

  const addRole = useCallback(async (email: string, role: UserRole, password: string) => {
    const accounts = readAccounts();
    const key = email.toLowerCase();
    if (!accounts[key]) return { error: 'not-found' as const };
    const account = normalizeAccount(accounts[key]);
    const error = await authenticate(account, password);
    if (error) return { error };
    if (!account.roles.includes(role)) account.roles.push(role);
    accounts[key] = account;
    writeJSON(ACCOUNTS_KEY, accounts);
    return { user: startSession({ name: account.name, email: account.email, role }) };
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    startSession(updated);
  }, [user]);

  const signInSocial = useCallback((email: string, name: string, role: UserRole) => {
    const accounts = readAccounts();
    const key = email.toLowerCase();
    const account = normalizeAccount(accounts[key] ?? { name, email, roles: [role], social: true });
    if (!account.roles.includes(role)) account.roles.push(role);
    accounts[key] = account;
    writeJSON(ACCOUNTS_KEY, accounts);
    return startSession({ name: account.name, email: account.email, role });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const requireProvider = useCallback(
    (action?: () => void) => {
      if (user?.role === 'provider') {
        action?.();
        return;
      }
      const next = encodeURIComponent(pathname);
      router.push(user ? `/signup?role=provider&next=${next}` : `/login?role=provider&next=${next}`);
    },
    [user, pathname, router],
  );

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signInSocial, register, addRole, switchRole, signOut, requireProvider }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const safeNext = (next: string | null) =>
  next && next.startsWith('/') && !next.startsWith('//') ? next : null;
